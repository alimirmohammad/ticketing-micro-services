import { Router, Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@amticketingorg/common";

import { Ticket } from "../models/ticket";
import { body } from "express-validator";

const router = Router();

router.put(
  "/api/tickets/:id",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be positive"),
  ],
  validateRequest,
  requireAuth,
  async function (req: Request, res: Response) {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
