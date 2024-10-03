import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Express, Request, Response, NextFunction } from "express";
import { Functions } from "../library/function";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with a more specific type if possible
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  let functionObj = new Functions();
  const token =
    req.cookies["token"] ||
    req.headers["authorization"]?.split("Bearer ")[1] ||
    req.body.token;

  if (!token || token === undefined) {
    functionObj.output(0, "token not found");
  }

  //verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  console.log("TOKEN PAYLOAD##", decoded);

  if (!decoded) {
    functionObj.output(0, "Invalid token");
  }

  req.user = decoded;

  next();
};
