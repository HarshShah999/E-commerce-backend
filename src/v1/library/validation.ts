import { Functions } from "./function";
import { Request, Response, NextFunction } from "express";

export class Validation {
  constructor() {}

  validateRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    schema: any
  ) {
    const options = {
      abortEarly: true, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: false, // remove unknown props
    };
    let obj = {
      ...req.body,
      ...req.params,
    };
    const { error } = schema.validate(obj, options);
    if (error) {
      console.log("Inside Validation error###");
      let functionObj = new Functions();
      return res.send(functionObj.output(0, error.message));
    }
    console.log("Outside Validation error###");

    next();
  }
}
