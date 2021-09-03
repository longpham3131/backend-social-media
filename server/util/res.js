const error500 = (res) => {
  return res.status(500).json({ success: false, message: "Internal server error" });
};

const error400 = (res,msg) => {
  return res.status(400).json({ success: false, message: msg });
};

module.exports={
  error500,
  error400
}

