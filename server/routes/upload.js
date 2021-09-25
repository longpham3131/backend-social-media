const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();
const {
  singleFileUpload,
  multipleFileUpload,
  getAllFiles,
  getAllMultiFiles,
} = require("../controllers/upload");
const { error500, error400 } = require("../util/res");
router.post("/singleFile", upload.single("file"), singleFileUpload);
router.post("/multipleFile", upload.array("files"), multipleFileUpload);
router.get("/getAllSingleFiles", getAllFiles);
router.get("/getAllMultipleFiles", getAllMultiFiles);
module.exports = {
  routes: router,
};
