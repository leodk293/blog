/*import mongoose, { Schema, models } from "mongoose";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        authorImage: {
            type: String,
            required: true
        },
        authorName: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", postSchema);

export default Post;*/

import mongoose, { Schema, models } from "mongoose";

// Create a separate schema for comments
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
        // No need to add special fields for post owner permissions
        // as the relationship is already established through the post document
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