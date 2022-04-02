import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@amticketingorg/common";

import { Ticket } from "../models/ticket";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
  ],
  validateRequest,
  async function (req: Request, res: Response) {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
