import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import Post from "@/lib/models/blog_posts";
import User from "@/lib/models/users";

export const PUT = async (request, { params }) => {
    try {
       
        const { userId, commentId, content } = await request.json();
        const url = new URL(request.url);
        const postId = url.searchParams.get("postId");
    

        if (!postId || !userId || !commentId || !content) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.authorId.toString() !== userId) {
            return NextResponse.json(
                { message: "Unauthorized: Only the comment owner can edit this comment" },
                { status: 403 }
            );
        }

        comment.content = content;

        await post.save();

        return NextResponse.json(
            {
                message: "Comment updated successfully",
                comment
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json(
            { message: "Failed to update comment" },
            { status: 500 }
        );
    }
};