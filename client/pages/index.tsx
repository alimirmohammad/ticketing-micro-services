import { InferGetServerSidePropsType } from "next";
import Link from "next/link";

import { TicketDto } from "../typings/dto";
import { client } from "./_app";

export default function LandingPage({
  tickets,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}

export async function getServerSideProps() {
  const { data } = await client.get<TicketDto[]>("/api/tickets");
  return { props: { tickets: data } };
}
