import  express  from "express";
import  {registerController, loginController, testController, forgetPasswordController, updateProfileController, orderController, getAllOrdersController, orderStatusController } from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
//Router objects
const router = express.Router();
//routing
//REGISTER || METHOD POST
router.post("/register", registerController)


//LOGIN || POST
router.post("/login", loginController)

//Forget Password
router.post('/forgot-password', forgetPasswordController);

//test Routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
router.get('/user-auth', requireSignIn, (req,res)=>{
    res.status(200).send({ok:true});
})

//protected route for Admin
router.get('/admin-auth', requireSignIn, isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
})

//Update Profile
router.put('/profile', requireSignIn, updateProfileController)

//Orders
router.get('/orders' , requireSignIn, orderController)

//All Orders
router.get('/all-orders' , requireSignIn, getAllOrdersController)


// order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);


export default router;