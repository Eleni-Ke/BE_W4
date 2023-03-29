import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.minPrice && req.query.maxPrice)
      query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };

    // if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };

    // if (req.query.description)
    //   query.description = { [Op.iLike]: `%${req.query.description}%` };

    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };

    const products = await ProductModel.findAndCountAll({
      where: {
        ...query,
        ...(req.query.search && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${req.query.search}%` } },
            { description: { [Op.iLike]: `%${req.query.search}%` } },
          ],
        }),
      },
      limit: req.query.limit,
      offset: req.query.offset,
      //   order: [
      //     req.query.orderby
      //       ? [
      //           req.query.orderby,
      //           req.query.dir ? req.query.dir.toUpperCase() : "ASC",
      //         ]
      //       : ["productId", req.query.dir ? req.query.dir.toUpperCase() : "ASC"],
      //   ],
    });

    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.productId, {
      // attributes: { exclude: ["createdAt", "updatedAt"] },
    }); // attributes could be an array (when you want to pass a list of the selected fields), or an object (with the exclude property, whenever you want to pass a list of omitted fields)
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductModel.update(
      req.body,
      { where: { id: req.params.productId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductModel.destroy({
      where: { id: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
