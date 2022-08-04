const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleGroupSchema = new Schema({
    roleName: {
        type: String,
        default: ""
    },
    privilege: [{
        type: Schema.Types.ObjectId,
<<<<<<< HEAD
        ref: "Privilege",
=======
        ref: "PrivilegeGroup",
>>>>>>> refactor-FE
    }],
});
module.exports = mongoose.model("RoleGroup", RoleGroupSchema);
