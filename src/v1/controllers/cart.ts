import { CartModel } from "../models/cart";
import { ProductModel } from "../models/product";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import express from "express";
import { auth } from "../middlewares/Auth";
import { Validation } from "../library/validation";
import { Functions } from "../library/function";
const router = express.Router();

/* routes */
router.post("/addtocart", auth, productIdSchema, addToCart);
router.put("/updatecart", productIdSchema, cartIdSchema, quantitySchema, updateCart);
router.delete("/romoveItem", productIdSchema, removeFromCart);
router.get("/allCartItems", auth, getAllCartItems);

module.exports = router;

/* schemas */
function productIdSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    productId: Joi.number().required(),
  });

 let validationObj=new Validation()
 validationObj.validateRequest(req,res,next,schema)

}

function quantitySchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    quantity: Joi.number().required(),
  });

  let validationObj=new Validation()
 validationObj.validateRequest(req,res,next,schema)
 
}

function cartIdSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    cartId: Joi.number().required(),
  });

  let validationObj=new Validation()
  validationObj.validateRequest(req,res,next,schema)
  

}

/* ---------------------------------------------Handler----------------------------------------------------------- */

async function addToCart(req: Request, res: Response) {
   
    let cartModel = new CartModel();
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const userId = req.user.id;
    const { productId } = req.body;

    //find paricular product exsit or not?
    const product = await productModel.getProductById(productId);
    if (!product) {
        res.send(functionObj.output(0, "Product not found"));
        return;
     
    }
     
    
    //check if item is already present into cart or not?
    const cartItem = await cartModel.getCartItemByProductId(productId);
    if(cartItem){
        res.send(functionObj.output(0,"The Product has already been added into Cart"))
        return
    }
    //everything is fine --->add to cart
    const cartInfo = {
      u_id: userId,
      pro_id: productId,
    };
    const cart = await cartModel.addToCart(cartInfo);
    if (!cart) {
        res.send(functionObj.output(0, "Fail to add product into cart"));
        return;
      } else {
        res.send(
          functionObj.output(1, "Add to cart succesfully", cart)
        );
        return;
      }

    
  
}

async function removeFromCart(req: Request, res: Response) {
  
    let cartModel = new CartModel();
    let functionObj=new Functions()
    const { productId } = req.body;

    const removedProduct = await cartModel.removeFromCart(productId);

    if (!removedProduct) {
        res.send(functionObj.output(0, "Fail to remove prorduct from the cart"));
        return;
      } else {
        res.send(
          functionObj.output(1, "Remove prorduct from the cart succesfully", removedProduct)
        );
        return;
      }
  
  
}

async function updateCart(req: Request, res: Response) {

    let cartModel = new CartModel();
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const { quantity, productId, cartId } = req.body;

    //check if the product's quantity is sufficient or not
    const product = await productModel.getProductById(productId);
    console.log("PRODUCT####", product);
    if (product.quantity < quantity) {
      res.send(functionObj.output(0,"Insufficient quantity"))
    }

    const updatedCart = await cartModel.updateCart(quantity, cartId, productId);
    if (!updatedCart) {
        res.send(functionObj.output(0, "Fail to update cart"));
        return;
      } else {
        res.send(
          functionObj.output(1, "Cart updated succesfully", updatedCart)
        );
        return;
      }
 
}

async function getAllCartItems(req: Request, res: Response) {
  
    let cartModel = new CartModel();
    let functionObj=new Functions()
    const userId = req.user.id;
    console.log("USERID###", userId);

    const allItems = await cartModel.getAllCartItems(userId);
    if(allItems.length===0){
        res.send(functionObj.output(0,"Cart is empty"))
        return
    }
    else{
        res.send(functionObj.output(1, "Cart items fetched succesfully", allItems));
    }
    
}
