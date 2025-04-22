import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import Post from "@/lib/models/blog_posts";
import User from "@/lib/models/users";

// Add a comment to a post
export const POST = async (request) => {
    try {
        const { postId, userId, content } = await request.json();

        // Validate required fields
        if (!postId || !userId || !content) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Find the user to get their name and image
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Find the post and add the comment
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        // Create and add the new comment
        post.comments.push({
            content,
            authorId: userId,
            authorName: user.fullName,
            authorImage: user.image
        });

        await post.save();

        return NextResponse.json(
            { message: "Comment added successfully", comment: post.comments[post.comments.length - 1] },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json(
            { message: "Failed to add comment" },
            { status: 500 }
        );
    }
}

// Get comments for a post or delete a comment
export const GET = async (request) => {
    try {
        const url = new URL(request.url);
        const postId = url.searchParams.get("postId");
        const action = url.searchParams.get("action");
        const commentId = url.searchParams.get("commentId");
        const userId = url.searchParams.get("userId");

        if (!postId) {
            return NextResponse.json(
                { message: "Post ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Handle comment deletion
        if (action === "delete" && commentId && userId) {
            const post = await Post.findById(postId);
            if (!post) {
                return NextResponse.json(
                    { message: "Post not found" },
                    { status: 404 }
                );
            }

            // Find the comment
            const comment = post.comments.id(commentId);
            if (!comment) {
                return NextResponse.json(
                    { message: "Comment not found" },
                    { status: 404 }
                );
            }

            // Check if user is authorized to delete (comment owner or post owner)
            if (comment.authorId.toString() === userId || post.authorId.toString() === userId) {
                // Remove the comment
                post.comments.pull({ _id: commentId });
                await post.save();

                return NextResponse.json(
                    { message: "Comment deleted successfully" },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { message: "Unauthorized to delete this comment" },
                    { status: 403 }
                );
            }
        }

        // Get comments for a post
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { comments: post.comments },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error handling comments:", error);
        return NextResponse.json(
            { message: "Failed to process comment request" },
            { status: 500 }
        );
    }
}

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