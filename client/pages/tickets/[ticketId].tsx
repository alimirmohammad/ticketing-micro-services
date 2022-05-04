import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import useRequest from "../../hooks/use-request";
import { OrderDto, TicketDto } from "../../typings/dto";
import { client } from "../_app";

export default function ShowTicket({
  ticket,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { doRequest, error } = useRequest<OrderDto>({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) => router.push(`/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {error}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { ticketId } = context.query;
  const { data } = await client.get<TicketDto>(`/api/tickets/${ticketId}`);
  return { props: { ticket: data } };
}
