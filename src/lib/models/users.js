/*import mongoose, { Schema, models } from "mongoose";

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

        }

    },
    { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;*/

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
        // Optional fields to track user's posts and activity
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],
        // You might want to add role-based permissions later
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