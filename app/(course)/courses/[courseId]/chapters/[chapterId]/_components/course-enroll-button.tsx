declare global {
  interface Window {
    Razorpay: any;
  }
}

"use client"

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const makePayment = async () => {
    const res = await initializeRazorpay();
    if (!res) {
      toast.error("Failed to load Razorpay SDK");
      return;
    }
    
    try {
      // Make API call to the serverless API
      const result = await axios.post(`/api/courses/${courseId}/checkout`);
      if (!result){
        alert("Server error. Device not online");
        return;
      }
      const {amount, id:order_id, currency, userId} = result.data;
      const options = {
        key: "rzp_test_tyFo6oqZuT23mv",
        amount: amount.toString(),
        currency: currency,
        name: "Descite",
        description: "Purchase this course",
        image: "public\logo.svg",
        order_id: order_id,
        handler: async function (response:any) {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
            };
            try {
              const paySuccess = await axios.post(`/api/courses/${courseId}/purchased`);
              if (paySuccess.status === 200) {
                toast.success("Payment successful");
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } else {
                toast.error("Payment failed");
              }
            } catch (error) {
              console.error(error);
            }
        },
        prefill: {
            name: "Descite",
            email: "tarunrawat5058@gmail.com",
            contact: "9625078597",
        },
        notes: {
            address: "Descite New Delhi",
        },
        theme: {
            color: "#61dafb",
        },
      };
      const payment = new window.Razorpay(options);
      payment.open();

    } catch (error) {
      toast.error("Failed to initiate payment");
      console.error(error);
    }
  };

  const initializeRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  return (
    <Button
      onClick={makePayment}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
