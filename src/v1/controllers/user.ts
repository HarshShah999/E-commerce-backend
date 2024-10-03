import express from "express";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user";
import otpGenerator from "otp-generator";
import { OtpModel } from "../models/otp";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";

import { auth } from "../middlewares/Auth";
import { Validation } from "../library/validation";
import { Functions } from "../library/function";

dotenv.config();
const router = express.Router();

/* Routes  */
router.post("/sendotp", otpSchema, sendOtp);
router.post("/signup", signupShema, signup);
router.post("/login", loginSchema, login);
router.post("/updateprofile", auth, updateProfile);
router.delete("/logout", auth, logout);
router.delete("/deleteaccount", auth, deleteUser);

//export {router}
module.exports = router;

/* schemas */
function otpSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    email: Joi.string().email().required(),
  });


  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
   
  
}

function signupShema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.required(),
    confirmPassword: Joi.required().valid(Joi.ref("password")),
    phone: Joi.string().length(10).required(),
    address: Joi.string().required(),
    dob: Joi.date().required(),
    gender: Joi.string().required(),
    otp: Joi.string().length(5).required(),
  });

  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

function loginSchema(req: Request, res: Response, next: NextFunction) {
  let schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.required(),
  });

  let validationObj = new Validation();
  validationObj.validateRequest(req, res, next, schema);
}

/* ------------------------------------- HANDLER---------------------------------------------------------------------------------------------------- */

//sendotp
async function sendOtp(req: Request, res: Response) {
  let userModel = new UserModel();
  let otpModel = new OtpModel();
  const { email } = req.body;
  //email validation

  const user = await userModel.findUserByEmail(email);
  console.log("USER################", user);
  let functionObj = new Functions();
  if (user) {
    res.send(functionObj.output(0, "User already exists"));
    return;
  }

  //generate otp
  var otp: string = otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // const result = await otpModel.findOtp(otp);

  // while(result){
  //     otp = otpGenerator.generate(5,{
  //         upperCaseAlphabets:false,
  //         lowerCaseAlphabets:false,
  //         specialChars:false
  //     })
  // }

  const otpInfo = {
    otp: otp,
    email: email,
  };

  const otpBody = await otpModel.createOtp(otpInfo);
  //send otp via sms

  if (!otpBody) {
    console.log("Inside If block-2");
    res.send(functionObj.output(0, "Failed to send otp"));
  }

  console.log("OTPBODY###", otpBody);

  res.send(functionObj.output(1, "Otp sent successfully", otpBody));
  return;
}
//signup
async function signup(req: Request, res: Response) {
  let userModel = new UserModel();
  let otpModel = new OtpModel();
  let functionObj = new Functions();
  const {
    firstname,
    lastname,
    password,
    confirmPassword,
    email,
    gender,
    phone,
    address,
    dob,
    otp,
  } = req.body;

  //validation

  //check if user already exist
  const existUser = await userModel.findUserByEmail(email);
  if (existUser) {
    res.send(functionObj.output(0, "User already exists"));
    return;
  }

  //otp validation
  // check otp with given email
  console.log("Before fetching otp####");
  const response = await otpModel.findRecentOtp(email);
  console.log("RESPONSE###", response);

  if (response.length === 0 || response[0].otp !== otp) {
    res.send(functionObj.output(0, "The OTP is not valid"));
    return;
  }
  // delete used otp
  await otpModel.deleteOtp(otp);

  //password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  //create user
  const userInfo: object = {
    firstname,
    lastname,
    password: hashedPassword,
    email,
    gender,
    phone,
    address,
    dob,
  };

  const user = await userModel.createUser(userInfo);

  console.log("New user", user);
  if (!user) {
    res.send(functionObj.output(0, "Failed to create user"));
    return;
  } else {
    res.send(functionObj.output(1, "Account created successfully", user));
    return;
  }
}

//login
async function login(req: Request, res: Response) {
  // write login logic in user model not in controller

  let userModel = new UserModel();
  let functionObj = new Functions();
  const { email, password } = req.body;

  const user = await userModel.findUserByEmail(email);
  

  if (!user) {
    res.send(functionObj.output(0, "User not found.pls create an account!!"));
    return;
  }

  //password checking
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.send(functionObj.output(0, "Invalid Password!!!"));
    return;
  }

  //generate jwt token
  const payload = {
    id: user.u_id,
    email: user.email,
    phone: user.phone,
  };
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secret, {
    expiresIn: "24h",
  });

  user.token = token;

  user.password = undefined;

  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    })
    .send(functionObj.output(1, "Login Successful", { token, user }));
  return;
}

//profileUpadte
async function updateProfile(req: Request, res: Response) {
  let functionObj = new Functions();
  let userModel = new UserModel();
  const userId = req.user.id;
  const updatedInfo = req.body.updatedInfo;
  console.log("USERID==", userId);
  console.log("UPDATE INFO##", updatedInfo);

  //upadate user in DB
  const updatedUser = await userModel.updateUser(userId, updatedInfo);
  console.log(updateProfile);
  if (!updatedUser) {
    res.send(functionObj.output(0, "Failed to update profile"));
    return;
  }
  res.send(functionObj.output(1, "Profile updated successfully", updatedUser));
  return;
}

//logout
async function logout(req: Request, res: Response) {
  let functionObj = new Functions();
  res.removeHeader("authorization");

  // Clear the JWT token stored in the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.send(functionObj.output(1, "Logged out successfully!"));
  return;
}

//delete user ---> account deletion
async function deleteUser(req: Request, res: Response) {
  let functionObj = new Functions();
  let userModel = new UserModel();

  const userId = req.user.id;
  const deletedUser = await userModel.deleteUser(userId);

  if (!deletedUser) {
    res.send(functionObj.output(0, "Failed to delete user"));
    return;
  }

  res.send(functionObj.output(1, "User deleted successfully", deletedUser));
  return;
}
