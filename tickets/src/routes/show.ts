import { Router, Request, Response } from "express";
import { NotFoundError } from "@amticketingorg/common";

import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets/:id", async function (req: Request, res: Response) {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
