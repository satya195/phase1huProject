import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique :true,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const UserList = mongoose.model("UserList", userSchema);
export default UserList;
