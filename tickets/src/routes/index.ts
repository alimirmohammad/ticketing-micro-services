import { Router, Request, Response } from "express";

import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets", async function (req: Request, res: Response) {
  const tickets = await Ticket.find({ orderId: undefined });

  res.send(tickets);
});

export { router as indexTicketRouter };
