import { useEffect, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import StripeCheckout from "react-stripe-checkout";

import { CurrentUserResponse, OrderDto, PaymentDto } from "../../typings/dto";
import { client } from "../_app";
import useRequest from "../../hooks/use-request";

export default function ShowOrder({
  order,
  currentUser,
}: InferGetServerSidePropsType<typeof getServerSideProps> &
  CurrentUserResponse) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, error } = useRequest<PaymentDto>({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: () => router.push("/orders"),
  });

  useEffect(
    function () {
      function findTimeLeft() {
        const msLeft = new Date(order.expiresAt).getTime() - Date.now();
        setTimeLeft(Math.round(msLeft / 1000));
      }

      findTimeLeft();
      const timerId = setInterval(findTimeLeft, 1000);
      return function () {
        clearInterval(timerId);
      };
    },
    [order]
  );

  if (timeLeft < 0) return <div>Order has expired</div>;

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        email={currentUser?.email}
        amount={order.ticket.price * 100}
      />
      {error}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { orderId } = context.query;
  const { data } = await client.get<OrderDto>(`/api/orders/${orderId}`);
  return { props: { order: data } };
}
