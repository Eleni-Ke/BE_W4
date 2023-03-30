import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import ProductModel from "../products/model.js";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

ProductModel.hasMany(ReviewsModel, {
  foreignKey: { name: "productId", allowNull: false },
});
ReviewsModel.belongsTo(ProductModel, {
  foreignKey: { name: "productId", allowNull: false },
});

UsersModel.hasMany(ReviewsModel, {
  foreignKey: { name: "userId", allowNull: false },
});
ReviewsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

export default ReviewsModel;
