import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import axios from 'axios';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse('Already purchased', { status: 400 });
    }

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    const paystackPayload = {
      email: user.emailAddresses[0].emailAddress,
      amount: Math.round(course.price! * 100), // Amount in kobo (smallest Paystack unit)
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      metadata: {
        userId: user.id,
        courseId: course.id,
      },
    };

    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (paystackResponse.status !== 200) {
      return new NextResponse('Failed to initialize payment', { status: 500 });
    }

    const { authorization_url } = paystackResponse.data.data;

    return NextResponse.json({ url: authorization_url });
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
