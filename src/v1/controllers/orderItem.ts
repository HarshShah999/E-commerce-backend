import { OrderItemModel } from "../models/orderItem";
import { Request, Response, NextFunction } from "express";
import express from "express";
import { auth } from "../middlewares/Auth";
import Joi from "joi";
import { Validation } from "../library/validation";
import { Functions } from "../library/function";
const router = express.Router();

/* routes */
router.post("/createItem", orderItemShema, createOrderItem);
router.get("/allItems", auth, getOrderItems);

module.exports = router;

/* Schemas */
function orderItemShema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    orderId: Joi.number().required(),
    productId: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

function updateOrderItemShema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    orderItemId: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

/* ------------------------------------------------------------------Handler---------------------------------------------------------------- */

//create OrderItem
async function createOrderItem(req: Request, res: Response) {
  const orderItemModel = new OrderItemModel();
  let functionObj = new Functions();
  const { orderId, productId, quantity } = req.body;
  const orderItem = await orderItemModel.createOrderItem(
    orderId,
    productId,
    quantity
  );
  if (!orderItem) {
    res.send(functionObj.output(0, "Fail"));
    return;
  } else {
    res.send(
      functionObj.output(1, "Order item created successfully", orderItem)
    );
    return;
  }
}

//getOrderItems --> To show whichever the orders makes by user
async function getOrderItems(req: Request, res: Response) {
  const orderItemModel = new OrderItemModel();
  let functionObj = new Functions();
  const userId = req.user.id;
  console.log("USERID", userId);
  const orderItems = await orderItemModel.getOrderItems(userId);
  if (orderItems.length === 0) {
    res.send(functionObj.output(0, "Fail"));
    return;
  } else {
    res.send(
      functionObj.output(1, "Success", orderItems)
    );
    return;
  }
}
