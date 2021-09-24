const SingleFile = require("../models/SingleFile");
const MultipleFile = require("../models/MultipleFile");
const { error500, error400 } = require("../util/res");
const singleFileUpload = async (req, res, next) => {
  try {
    console.log(req.file);
    const file = new SingleFile({
      fileName: req.file.originalname,
      filePath: (req.file.path.split('\\')[1]).replace(/\s/g,''),
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2), // 0.00
    });
    await file.save();
    console.log(file);
    res.status(200).send({ message: "File upload successfully", data: file });
  } catch (er) {
    console.log(er);
    res.status(400).send({ message: "error upload" });
  }
};

const multipleFileUpload = async (req, res, next) => {
  try {
    let filesArray = [];
    for (let i = 0; i < req.files.length; i++) {
      const element = req.files[i];
      const file = new SingleFile({
        fileName: element.originalname,
        filePath: (element.path.split('\\')[1]).replace(/\s/g,''),
        fileType: element.mimetype,
        fileSize: fileSizeFormatter(element.size, 2), // 0.00
      });
      await file.save();
      filesArray.push(file._id);
    }
    const multipleFiles = new MultipleFile({
      title: req.body.title,
      files: filesArray,
    });
    await multipleFiles.save();
    res
    .status(200)
    .send({ message: "Files upload successfully", data: multipleFiles });
  } catch (er) {
    error400("upload error");
  }
};

const getAllFiles = async (req, res, next) => {
  try {
    const files = await SingleFile.find();
    res.json({
      message: "success",
      data: files,
    });
  } catch (er) {
    error400("get file error");
  }
};
const getAllMultiFiles = async (req, res, next) => {
  try {
    const files = await MultipleFile.find().populate('files');
    console.log(files[0])
    res.json({
      message: "success",
      data: files,
    });
  } catch (er) {
    error400("get file error");
  }
};

const fileSizeFormatter = (byte, decimal) => {
  if (byte === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(byte) / Math.log(1000));
  return (
    parseFloat((byte / Math.pow(1000, index)).toFixed(dm)) + "-" + sizes[index]
  );
};

module.exports = {
  singleFileUpload,
  multipleFileUpload,
  getAllFiles,
  getAllMultiFiles,
};
