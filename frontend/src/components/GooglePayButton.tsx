import React, { useState } from "react";
import { useStripe, useElements, PaymentRequestButtonElement, PaymentRequestOptions } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeProviderWrapper from "./StripeProviderWrapper";

export default function GooglePayButton({ amount, description }: { amount: number; description: string }) {
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  React.useEffect(() => {
    async function setup() {
      const res = await fetch("/api/wallet/googlepay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description })
      });
      const data = await res.json();
      if (!data.clientSecret || !data.publishableKey) return;
      setPublishableKey(data.publishableKey);
      setClientSecret(data.clientSecret);
    }
    setup();
  }, [amount, description]);

  if (!publishableKey || !clientSecret) {
    return <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded" disabled>Loading Google Pay...</button>;
  }

  return (
    <StripeProviderWrapper publishableKey={publishableKey}>
      <GooglePayButtonInner amount={amount} description={description} clientSecret={clientSecret} />
    </StripeProviderWrapper>
  );
}

function GooglePayButtonInner({ amount, description, clientSecret }: { amount: number; description: string; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  React.useEffect(() => {
    if (!stripe) return;
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: description, amount: Math.round(amount * 100) },
      requestPayerName: true,
      requestPayerEmail: true,
      googlePay: { merchantId: "BCR2DN6T6Q5K7JQJ" } // Replace with your Google Pay merchant ID
    } as PaymentRequestOptions);
    pr.canMakePayment().then((result: any) => {
      if (result) setCanMakePayment(true);
    });
    setPaymentRequest(pr);
  }, [stripe, amount, description]);

  if (!stripe || !elements || !paymentRequest || !canMakePayment) {
    return <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded" disabled>Google Pay Unavailable</button>;
  }

  return (
    <PaymentRequestButtonElement
      options={{ paymentRequest }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    />
  );
}
