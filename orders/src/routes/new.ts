import mongoose from "mongoose";

import express, { Request, Response } from "express";

import { requireAuth, validateRequest } from "@yabtickets/common";
import { body } from "express-validator";

const router = express.Router();

router.post("/api/orders", requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    // not the best way to couple order service with ticket service, but it's a good way to show how to validate the ticketId.
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be a valid ObjectId')
],  validateRequest, async (req: Request, res: Response) => {

  res.send({});
});

export { router as newOrdersRouter };