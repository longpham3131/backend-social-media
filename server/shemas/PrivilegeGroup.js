const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivilegeGroupSchema = new Schema({
    privilege: {
        type: String,
        default: ""
    }
});
module.exports = mongoose.model("PrivilegeGroup", PrivilegeGroupSchema);
