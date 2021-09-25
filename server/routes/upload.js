const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();
const {singleFileUpload,multipleFileUpload,getAllFiles,getAllMultiFiles}= require("../controllers/upload")
const { error500, error400 } = require("../util/res");
const { cloudinary } = require("../util/cloudinary");
router.post("/singleFile",upload.single("file"));
router.post("/multipleFile",upload.array("files"),multipleFileUpload);
router.get("/getAllSingleFiles",getAllFiles)
router.get("/getAllMultipleFiles",getAllMultiFiles)
router.get('file',async(req,res)=>{
    const {resource} = await cloudinary.search.expression('folder:home')
    .sort_by('public_id','desc')
    .max_results(30)
    .execute();
    const publicIds = resource.map(file => file.public_id);
    res.send(publicIds)
})
module.exports = {
    routes:router
}