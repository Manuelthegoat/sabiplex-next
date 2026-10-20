import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHmac, timingSafeEqual } from 'crypto';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret || !signature) {
    return new NextResponse('Webhook is not configured correctly.', { status: 400 });
  }

  const hash = createHmac('sha512', secret).update(rawBody).digest();
  const receivedSignature = Buffer.from(signature, 'hex');

  if (hash.length !== receivedSignature.length || !timingSafeEqual(hash, receivedSignature)) {
    return new NextResponse('Invalid Signature', { status: 400 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Invalid JSON body', { status: 400 });
  }

  const { event, data } = body;

  if (event === 'charge.success') {
    const userId = data.metadata?.userId;
    const courseId = data.metadata?.courseId;

    if (!userId || !courseId) {
      return new NextResponse('Missing metadata', { status: 400 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (
      !course ||
      data.status !== 'success' ||
      typeof course.price !== 'number' ||
      data.amount !== Math.round(course.price * 100) ||
      data.currency !== 'NGN'
    ) {
      return new NextResponse('Payment details do not match the course.', { status: 400 });
    }

    await db.purchase.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { amountPaidKobo: data.amount, currency: data.currency },
      create: { courseId, userId, amountPaidKobo: data.amount, currency: data.currency },
    });
  } else {
    return new NextResponse(`Unhandled event type: ${event}`, { status: 200 });
  }

  return new NextResponse(null, { status: 200 });
}
