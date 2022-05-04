import { InferGetServerSidePropsType } from "next";

import { OrderDto } from "../../typings/dto";
import { client } from "../_app";

export default function ShowOrders({
  orders,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
}

export async function getServerSideProps() {
  const { data } = await client.get<OrderDto[]>("/api/orders");
  return { props: { orders: data } };
}
