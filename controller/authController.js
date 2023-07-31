//import user UserModel
import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js"
import  {comparePassword, hashPassword}  from "../helpers/authHelper.js";

import JWT from "jsonwebtoken"


export const registerController =async(req, res)=>{
    try {
        const {name, email, password, phone, address, question}= req.body;
        //Validation
        if(!name){
            return res.send({message:"Name is Required"})
        }
        if(!email){
            return res.send({message:"Email is Required"})
        }
        if(!password){
            return res.send({message:"Password is Required"})
        }
        if(!phone){
            return res.send({message:"Phone no is Required"})
        }
        if(!address){
            return res.send({message:"Address is Required"})
        }
        if(!question){
            return res.send({message:"Question is Required"})
        }

        //Check User
        const existingUser = await userModel.findOne({email})
        //Existing User
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"Already Resgister please Login"
            })
        }
        //Register User
        const hashedPassword= await hashPassword(password)

        //Save
        const user = await new userModel({
           name,
           email,
           phone,
           address,
           password:hashedPassword,
           question
        }).save();

        res.status(201).send({
            success:true,
            message:"User Register Sucessfully",
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess:false,
            message:"Error in Registeration",
            error
        })
    }
}
//LOGIN ROUTES
export const loginController=async(req, res)=>{
    try {
        const {email, password}=req.body
        //validation
        if(!email||!password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
        }
        //Check User
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not register"
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                sucess:false,
                message:"Invaliid Password"
            })
        }
        //Token
        const token = await JWT.sign({_id:user._id}, process.env.secretKey, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                name: user.name,
                email: user.email,
                phone: user.email,
                address: user.address,
                role: user.role,
            }, token
            
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
}

//Forget Password Controller
export const forgetPasswordController=async(req,res)=>{
try {
    const {email, question, newPassword}=req.body;
    if(!email){
        res.status(400).send({
            message:"Email is required"
        })
    } 
    if(!question){
        res.status(400).send({
            message:"Question is required"
        })
    } 
    if(!newPassword){
        res.status(400).send({
            message:"New Password is required"
        })
    } 
    //Check Email and Question
    const user = await userModel.findOne({email, question})
//Validation
    if(!user){
        res.status(400).send({
            success:false,
            message:"Wrong Email or Question"
        })
    }
    const hashed= await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id, {password:hashed});
    res.status(200).send({
        success:true,
        message:"Password Reset Successfully",
    })

} catch (error) {
    console.log(error)
    res.status(500).send({
        message:"Something went wrong",
        success:false,
        error
    })
}
}

//Test Controller
export const testController= (req, res)=>{
    try {
        res.send("Protected Routes")
    } catch (error) {
        console.log(error);
        res.send({error})
    }
}


//Update Profile Controller
export const updateProfileController=async(req,res)=>{
    try {
        const {name, email, password, address, phone}=req.body;
        const user= await userModel.findById(req.user._id)
        //Password
        if(password && password.length < 6){
            return res.json({error:'Password is required and 6 character long'})
        }
        const hashedPassword= password ? await hashPassword(password):undefined
        const updatedUser= await userModel.findByIdAndUpdate(req.user._id,{
            name:name||user.name,
            password:hashedPassword||user.password,
            phone:phone||user.phone,
            address:address||user.address,
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile Updated",
            updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error while Update Profile",
            error,
        })
    }
}

//Orders
export const orderController=async(req,res)=>{
    try {
        const orders = await orderModel
          .find({buyer:req.user._id})
          .populate("products", "-photo")
          .populate("buyer", "name")
          .sort({ createdAt: "-1" });
        res.json(orders);
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error WHile Geting Orders",
          error,
        });
      }
}


//ALLorders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };


  //order status
export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };