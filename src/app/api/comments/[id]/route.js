import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import Post from "@/lib/models/blog_posts";
import User from "@/lib/models/users";

export const PUT = async (request, { params }) => {
    try {
        // Parse the request body to get the updated comment data
        const { userId, commentId, content } = await request.json();
        //const postId = params.postId; // Assuming the route is like /api/posts/[postId]/comments
        const url = new URL(request.url);
        const postId = url.searchParams.get("postId");
    
        
        //const userId = url.searchParams.get("userId");

        // Validate required fields
        if (!postId || !userId || !commentId || !content) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Find the post containing the comment
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        // Find the comment in the post's comments array
        const comment = post.comments.id(commentId);
        if (!comment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        // Check if the user is the owner of the comment
        if (comment.authorId.toString() !== userId) {
            return NextResponse.json(
                { message: "Unauthorized: Only the comment owner can edit this comment" },
                { status: 403 }
            );
        }

        // Update the comment content
        comment.content = content;

        // Save the updated post (which contains the updated comment)
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