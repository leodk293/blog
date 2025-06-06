import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],
        
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;