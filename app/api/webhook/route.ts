import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.json();
  const signature = headers().get('x-paystack-signature');

  // Validate Paystack signature
  const crypto = await import('crypto');
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(body))
    .digest('hex');

  if (hash !== signature) {
    return new NextResponse('Invalid Signature', { status: 400 });
  }

  const { event, data } = body;

  if (event === 'charge.success') {
    const userId = data.metadata.userId;
    const courseId = data.metadata.courseId;

    if (!userId || !courseId) {
      return new NextResponse('Missing metadata', { status: 400 });
    }

    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!existingPurchase) {
      await db.purchase.create({
        data: {
          courseId,
          userId,
        },
      });
    }
  } else {
    return new NextResponse(`Unhandled event type: ${event}`, { status: 200 });
  }

  return new NextResponse(null, { status: 200 });
}
