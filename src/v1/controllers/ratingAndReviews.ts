import { Request, Response, NextFunction } from "express";
import { ReviewModel } from "../models/ratingAndReview";
import { OrderItemModel } from "../models/orderItem";
import Joi from "joi";
import express from "express";
import { auth } from "../middlewares/Auth";
import { ProductModel } from "../models/product";
import { Validation } from "../library/validation";
import { Functions } from "../library/function";
const router = express.Router();

/* routes */
router.post("/createRating", auth, productIdSchema, reviewSchema, createReview);
router.get("/getReviews", productIdSchema, getProductReview);

module.exports = router;

/* schemas */
function reviewSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    review: Joi.string().required(),
    orderItemId: Joi.number().required(),
  });
  let validationObj=new Validation()
  validationObj.validateRequest(req,res,next,schema)


}
function productIdSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    productId: Joi.number().required(),
  });

  let validationObj=new Validation()
  validationObj.validateRequest(req,res,next,schema)
 
}

/* --------------------------------------------Handler------------------------------------------------------------------- */

async function createReview(req: Request, res: Response) {
 
    let reviewModel = new ReviewModel();
    let productModel = new ProductModel();
    let orderItemModel = new OrderItemModel();
    let functionObj=new Functions()
    const userId = req.user.id;
    const { productId, rating, review, orderItemId } = req.body;

    //check if customer is purchased product or not
    const isProductPurchased = await orderItemModel.getOrderItemById(
      orderItemId
    );
    if (!isProductPurchased) {
        res.send(functionObj.output(0, "product is not purchased yet"));
        return;
      } 

    //check if the customer is already reviewd or not
    const isReviewAlreadyDone = await reviewModel.getReviewByUserIdAndOrderItemId(
      userId,
      orderItemId
    );
    if (isReviewAlreadyDone) {
        res.send(functionObj.output(0, "product is already reviewed"));
        return;
    }

    //create new rating and reviews entry in DB
    const reviewInfo = {
      userId,
      productId,
      orderItemId,
      rating,
      review,
    };
    const getReview = await reviewModel.createReview(reviewInfo);

    //after creating reviews add it into product
    const updatingProduct = await productModel.updateProductRating(productId);
    
    if(!getReview && !updatingProduct){
        res.send(functionObj.output(0, "Fail")) 
    }
    else{
        res.send(functionObj.output(1, "review created successfully",getReview))
        return
    }
    
  } 

//get particular product rating and review
async function getProductReview(req: Request, res: Response) {

    let reviewModel = new ReviewModel();
    let functionObj=new Functions()
    const { productId } = req.body;

    const allreviews = await reviewModel.getProductReviews(productId);
    if(!allreviews){
        res.send(functionObj.output(0, "Fail")) 
        return
    }
    else{
        res.send(functionObj.output(1, "Product's  rating & reviews fetched successfully",allreviews))
        return
    }
  
  
}
