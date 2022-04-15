import { Router, Request, Response } from "express";
import { requireAuth } from "@amticketingorg/common";

import { Order } from "../models/order";

const router = Router();

router.get(
  "/api/orders",
  requireAuth,
  async function (req: Request, res: Response) {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "ticket"
    );
    res.send(orders);
  }
);

export { router as indexOrderRouter };
