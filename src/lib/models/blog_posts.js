import mongoose, { Schema, models } from "mongoose";


const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        authorImage: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorImage: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        comments: [commentSchema],
    },
    { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", postSchema);

export default Post;