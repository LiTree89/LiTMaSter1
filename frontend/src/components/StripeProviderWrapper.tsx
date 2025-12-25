import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function StripeProviderWrapper({ publishableKey, children }: { publishableKey: string, children: React.ReactNode }) {
  const stripePromise = loadStripe(publishableKey);
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
