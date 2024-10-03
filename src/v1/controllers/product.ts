import { ProductModel } from "../models/product";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import express from "express";
import { Validation } from "../library/validation";
import { Functions } from "../library/function";

const router = express.Router();

/* routing */
router.post("/create", productSchema, createProduct);
router.post(
  "/update/:productId",
  productSchema,
  productIdSchema,
  updateProduct
);
router.delete("/delete/:productId", productIdSchema, deleteProduct);
// router.get("/allproducts", getAllProduct);
router.get("/:productId", productIdSchema, getProduct);
router.post("/filterbyprice", filterProductSchema, filterProducts);
router.post("/searchbyname", filterProductSchema, getProductByName);

module.exports = router;

/* Schemas */
function productSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    cat_id: Joi.number().required(),
    quantity: Joi.number().min(1).default(1),
  });
 
  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

function productIdSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    productId: Joi.number().required(),
  });
  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
  
}

function filterProductSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    productName: Joi.string().required(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number(),
    //limit: Joi.number().required().max(50),
    page: Joi.number().integer().required().default(1),
    order: Joi.string().valid("asc", "desc").default("asc"),
    orderby: Joi.string().valid("price", "name", "rating").default("name"),
  });

  

  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

/* -------------------------------------------HANDLER---------------------------------------------- */

//createProduct
async function createProduct(req: Request, res: Response) {
 
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const { name, description, price, cat_id } = req.body;

    //create an new product
    const productInfo = {
      name,
      description,
      price,
      cat_id,
    };
    const product = await productModel.createProduct(productInfo);
    if (!product) {
        res.send(functionObj.output(0, "Fail to create product"));
        return;
      } else {
        res.send(
          functionObj.output(1, "product created succesfully", product)
        );
        return;
      }

}

//updateproduct
async function updateProduct(req: Request, res: Response) {
  
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const { name, description, price, cat_id, quantity } = req.body;
    const productId = +req.params.productId;

    //update product
    const productInfo = {
      name: name,
      description: description,
      price: price,
      cat_id: cat_id,
      quantity: quantity,
    };

    const updatedProduct = await productModel.updateProduct(
      productId,
      productInfo
    );
    if (!updatedProduct) {
        res.send(functionObj.output(0, "Fail to update product"));
        return;
      } else {
        res.send(
          functionObj.output(1, "updation of ptoduct succesfully", updatedProduct)
        );
        return;
      }
   

}

//getProuct --->Id
async function getProduct(req: Request, res: Response) {
  
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const productId = +req.params.productId;

    const productDetails = await productModel.getProductById(productId);
    if (!productDetails) {
        res.send(functionObj.output(0, "Fail to get product"));
        return;
      } else {
        res.send(
          functionObj.output(1, "getting product succesfully", productDetails)
        );
        return;
      }
   

}




//delectProduct
async function deleteProduct(req: Request, res: Response) {
  
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const productId = +req.params.productId;

    //delete product
    const productDeatails = await productModel.deleteProduct(productId);
    if (!productDeatails) {
        res.send(functionObj.output(0, "Fail to delete product"));
        return;
      } else {
        res.send(
          functionObj.output(1, "product deleted succesfully", productDeatails)
        );
        return;
      }
  
}

//feltering produts -->bases on price
async function filterProducts(req: Request, res: Response) {
 
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const { productName, minPrice, maxPrice, order, orderby, page } =
      req.body;
    console.log("Parameters:", {
      productName,
      minPrice,
      maxPrice,
      order,
      orderby,
      
      page,
    });

    // const { error } = await priceSchema.validateAsync({ minPrice, maxPrice });

    //filtering product

    const products = await productModel.filterProduct(
      productName,
      minPrice,
      maxPrice,
      order,
      orderby,
      page,
      
    );
    if (products.length===0) {
        res.send(functionObj.output(0, "Fail"));
        return;
      } else {
        res.send(
          functionObj.output(1, "Filtering is successfully ", products)
        );
        return;
      }

  
}

// //getProductByName
async function getProductByName(req: Request, res: Response) {
  
    let productModel = new ProductModel();
    let functionObj=new Functions()
    const { productName, limit, page } = req.body;

    console.log("NAME###", productName);

    //get product
    const products = await productModel.getProductByName(
      productName,
      page
    );
    if (products.length===0) {
        res.send(functionObj.output(0, "Fail"));
        return;
      } else {
        res.send(
          functionObj.output(1, "getting is successfully ", products)
        );
        return;
      }
    
}
