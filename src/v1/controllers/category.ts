import { CategoryModel } from "../models/category";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import express from "express";
import { Validation } from "../library/validation";
import { Functions } from "../library/function";

const router = express.Router();

/* routing */
router.post("/create", createCategorySchema, createCategory);
router.post("/update/:categoryId", upadateCategorySchema, updateCategory);
router.delete("/delete/:categoryId", categoryIdSchema, deleteCategory);
router.get("/allcategories", getAllCategory);
router.get("/:categoryId", categoryIdSchema, getCategory);

module.exports = router;

/* Schemas */
function createCategorySchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    // object
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

function upadateCategorySchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    categoryId: Joi.number().required(),
  });
  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

function categoryIdSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    categoryId: Joi.number().required(),
  });
  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

//create category
async function createCategory(req: Request, res: Response) {
  let categoryModel = new CategoryModel();
  let functionObj = new Functions();
  const { name, description } = req.body;

  //create new category
  const categoryInfo = {
    name,
    description,
  };

  console.log("BEFORE CREATION####");
  const newCategory = await categoryModel.createCategory(categoryInfo);
  if (!newCategory) {
    res.send(functionObj.output(0, "Fail to create succesfully"));
    return;
  } else {
    res.send(
      functionObj.output(1, "category created succesfully", newCategory)
    );
    return;
  }
}

//update category
async function updateCategory(req: Request, res: Response) {

    let categoryModel = new CategoryModel();
    let functionObj=new Functions()
    const { name, description } = req.body;
    const categoryId = +req.params.categoryId;
    console.log("BEFORE1 VALIDATION####");
    //  const { error } = await categorySchema.validateAsync(req.body);
    console.log("BEFORE2 VALIDATION####");

    console.log("AFTER VALIDATION####");

    //update category
    const categoryInfo = {
      name,
      description,
    };
    console.log("BEFORE CREATION####");
    const updatedCategory = await categoryModel.updateCategory(
      categoryId,
      categoryInfo
    );

      if(!updatedCategory){
        res.send(functionObj.output(0, "Fail to update succesfully"))
        return;
      }
      else{
        res.send(functionObj.output(1, "category updated succesfully", updatedCategory))
        return
      }
  } 


//getcategory--->Id
async function getCategory(req: Request, res: Response) {
  
    let categoryModel = new CategoryModel();
    let functionObj=new Functions()
    const categoryId = +req.params.categoryId;

    const category = await categoryModel.getCategoryById(categoryId);
     if(!category){
        res.send(functionObj.output(0, "Fail to get category"))
        return
     }
     else{
        res.send(functionObj.output(1, "category found succesfully", category))
        return
     }
 
}

//getAllcategory
async function getAllCategory(req: Request, res: Response) {
 
    let categoryModel = new CategoryModel();
    let functionObj=new Functions()
    const allcategory = await categoryModel.getAllCategories();
     
    if(allcategory.length===0){
        res.send(functionObj.output(0, "No category found"))
        return
    }
    else{
        res.send(functionObj.output(1, "category found succesfully", allcategory))
        return
    }
  } 

//deletCategory
async function deleteCategory(req: Request, res: Response) {

    let categoryModel = new CategoryModel();
    let functionObj=new Functions()
    const categoryId = +req.params.categoryId;

    //delete category
    const categoryDeatails = await categoryModel.deleteCategory(categoryId);
    
    if(!categoryDeatails){
        res.send(functionObj.output(0,"Fail to delete category"))
        return
    }
    else{
        res.send(functionObj.output(1,"Category deleted successfully",categoryDeatails))
        return
    }

}

//getCategory-->name
