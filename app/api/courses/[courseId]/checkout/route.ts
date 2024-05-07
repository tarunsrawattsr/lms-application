import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import Razorpay from "razorpay";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Check if the customer already exists in the Razorpay database
    let razorpayCustomer = await db.stripeCustomer.findUnique({
      where:{
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      }
    });

    if (!razorpayCustomer) {
      const customer = await razorpay.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      // Save the customer ID to the database
      razorpayCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        }
      });
    }

    // Create a new order
    const order = await razorpay.orders.create({
      amount: Math.round(course.price! * 100),
      currency: "INR",
      receipt: `${user.id}`,
      payment_capture: true,
    });

    // Return the URL for the payment page
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      customerId: user.id
    });
    
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
