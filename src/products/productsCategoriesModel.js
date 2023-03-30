import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductsCategoriesModel = sequelize.define("product_category", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
});

export default ProductsCategoriesModel;
