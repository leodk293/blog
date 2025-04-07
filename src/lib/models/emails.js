import mongoose, { Schema, models } from "mongoose";

const emailSchema = new Schema(
    {
        userName:{
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
            unique: true
        },
    },
    { timestamps: true }
);

const Email = models.Email || mongoose.model("Email", emailSchema);

export default Email;