import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"
export const createCategoryController=async(req,res)=>{
    try {
       const {name}= req.body
       if(!name){
        return res.status(500).send({
            message:"Name is required"
        })
        }
        const existingCategory= await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                message:"Category already exist"
            })
       } 
       const category= await new categoryModel({name, slug:slugify(name)}).save()
       res.status(200).send({
        success:true,
        message:"New Category Created",
        category,
       })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in Category"
        })
    }
}


//Update Category Controller
export const updateCategoryController=async(req,res)=>{
    try {
        const {name}= req.body
        const {id}= req.params
        const category= await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new:true})
        res.status(200).send({
            success:true,
            message:"Category updated Sucessfully",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while Updating",
            error,
        })
    }
}

//Get All Catergory
export const categoryController=async(req,res)=>{
    try {
        const category= await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Category list",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting all Category",
            error
        })
    }
}

//Single Search Category
export const singleCategoryController=async(req,res)=>{
    try {
       
        const category= await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Get Single Category Successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting single Category",
            error,
        })
    }
}


//Delete Category Single
export const deleteCategoryController=async(req,res)=>{
    try {
       const {id}= req.params;
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Deleted Category Successfully",

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while Delete Category",
            error
        })
    }
}