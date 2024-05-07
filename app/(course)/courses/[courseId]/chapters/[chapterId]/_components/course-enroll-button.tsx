"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import GooglePayButton from "@google-pay/button-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout`)

      window.location.assign(response.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GooglePayButton
      environment="TEST"
      buttonSizeMode="fill"
      buttonType="pay"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {              
              allowedAuthMethods: ['PAN_ONLY','CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD','DISCOVER','VISA'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId',
              }
            }
          }
        ],
        merchantInfo : {
          merchantId: 'BCR2DN4TXXMIL2T5',
          merchantName: 'Descite'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'TOTAL',
          totalPrice: price.toFixed(2),
          currencyCode: 'INR',
          countryCode: 'IN',
        },
      }}
      onLoadPaymentData={paymentData => {
        console.log('TODO: send order to server',paymentData.paymentMethodData);
      }}
    />
  )
}