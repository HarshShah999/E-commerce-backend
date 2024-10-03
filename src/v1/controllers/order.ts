import { OrderModel } from "../models/order";
import { NextFunction, Request, Response } from "express";
import express from "express";
import { auth } from "../middlewares/Auth";
const router = express.Router();
import Joi from "joi";
import { Validation } from "../library/validation";
import { Functions } from "../library/function";

/* routes */
router.post("/create", auth, createOrder);
router.put(
  "/orderstatus/:orderId",
  orderIdSchema,
  orderStatusSchema,
  updateOrderStatus
);
router.put(
  "/paymentstatus/:orderId",
  orderIdSchema,
  paymentStatusSchema,
  updatePaymentStatus
);
router.delete("/delete/:orderId", auth, orderIdSchema, deleteOrder);

module.exports = router;

/* Schemas */
function orderIdSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    orderId: Joi.string().required(),
  });

  let validationObj=new Validation()
  validationObj.validateRequest(req,res,next,schema)
  
  
}

function orderStatusSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    orderStatus: Joi.string().required(),
  });
  let validationObj=new Validation()
  validationObj.validateRequest(req,res,next,schema)
  

}

function paymentStatusSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    paymentStatus: Joi.string().required(),
  });
  
  let validationObj=new Validation()
  validationObj.validateRequest(req,res,next,schema)
}

/* --------------------------------------------------Handler----------------------------------------------------- */

async function createOrder(req: Request, res: Response) {
  
    const orderModel = new OrderModel();
    let functionObj=new Functions()
    const userId = req.user.id;
    console.log("USERID###", userId);
    const order = await orderModel.createOrder(userId);
    if(!order){
        res.send(functionObj.output(0,"Fail to create order"))
        return
    }
    else{
        res.send(functionObj.output(1,"Order created successfully",order))
        return
    }
  } 
  
//handling by Admin only
async function updateOrderStatus(req: Request, res: Response) {

    const orderModel = new OrderModel();
    let functionObj=new Functions()
    //const userId = req.user.id;
    const { orderStatus } = req.body;
    const orderId = +req.params.orderId;
    const updatedOrder = await orderModel.updateOrderStatus(
      orderId,
      orderStatus
    );
    if(!updatedOrder){
        res.send(functionObj.output(0,"Fail to update order"))
        return
    }
    else{
        res.send(functionObj.output(1,"Order status updated successfully",updatedOrder))
        return
    }

  
}

//handling by Admin only
async function updatePaymentStatus(req: Request, res: Response) {

    const orderModel = new OrderModel();
    let functionObj=new Functions()
    const { paymentStatus } = req.body;
    const orderId = +req.params.orderId;
    const updatedOrder = await orderModel.updatePaymentStatus(
      orderId,
      paymentStatus
    );
    if(!updatedOrder){
        res.send(functionObj.output(0,"Fail to update order"))
        return
    }
    else{
        res.send(functionObj.output(1,"Order status updated successfully",updatedOrder))
        return
    }

   
}

//delete[cancle] order
async function deleteOrder(req: Request, res: Response) {
 
    const orderModel = new OrderModel();
    let functionObj=new Functions()
    
    const orderId = +req.params.orderId;
    const deletedOrder = await orderModel.deleteOrder(orderId);
    if(!deletedOrder){
        res.send(functionObj.output(0,"Fail to calcel order"))
        return
    }
    else{
        res.send(functionObj.output(1,"Order canceltion successfully",deletedOrder))
        return
    }

  
}
