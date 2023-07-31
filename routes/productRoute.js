import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
  countProductController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  listProductController,
  productCategoryController,
  productFilterController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controller/productController.js";
import formidable from "express-formidable";
const router = express.Router();

//Routes
//Create Product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//Update Product
router.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
  );

//getProducts
router.get("/get-product", getProductController);

//Single Product
router.get("/single-product/:slug", getSingleProductController);

//Get Photo
router.get("/product-photo/:pid", productPhotoController);

//Delete Product
router.delete("/delete-product/:pid", deleteProductController)

//Filter Product
router.post("/filter-product", productFilterController)

//Product Count OR Pagination
router.get("/product-count", countProductController)

//Product Per Page Pagination
router.get("/product-list/:page", listProductController)

//Search product Routes
router.get("/search-product/:keyword", searchProductController)

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);


//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
