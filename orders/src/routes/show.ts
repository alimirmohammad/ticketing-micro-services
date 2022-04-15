import { Router, Request, Response } from "express";
import { NotAuthorizedError, NotFoundError } from "@amticketingorg/common";

import { Order } from "../models/order";

const router = Router();

router.get(
  "/api/orders/:orderId",
  async function (req: Request, res: Response) {
    const order = await Order.findById(req.params.orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    res.send(order);
  }
);

export { router as showOrderRouter };
