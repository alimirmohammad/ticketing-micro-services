import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Types } from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@amticketingorg/common";

import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/order";

const EXPIRATION_WINDOW_MINUTES = 15;

const router = Router();

router.post(
  "/api/orders",
  requireAuth,
  body("ticketId")
    .notEmpty()
    .custom((input: string) => Types.ObjectId.isValid(input))
    .withMessage("TicketId must be valid"),
  validateRequest,
  async function (req: Request, res: Response) {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("The ticket is already reserved");

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + EXPIRATION_WINDOW_MINUTES);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      ticket,
      expiresAt,
    });
    await order.save();
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
