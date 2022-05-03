import { Types } from "mongoose";

export const stripe = {
  charges: {
    create: jest
      .fn()
      .mockResolvedValue({ id: new Types.ObjectId().toHexString() }),
  },
};
