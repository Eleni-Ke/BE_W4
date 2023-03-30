import express from "express";
import ReviewsModel from "./model.js";
import UsersModel from "../users/model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviewId } = await ReviewsModel.create({
      content: req.body.content,
      userId: req.body.userId,
      productId: req.params.productId,
    });
    res.status(201).send({ reviewId });
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
