import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import Post from "@/lib/models/blog_posts";
import User from "@/lib/models/users";


export const POST = async (request) => {
    try {
        const { postId, userId, content } = await request.json();

        if (!postId || !userId || !content) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

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

        
        if (action === "delete" && commentId && userId) {
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

            
            if (comment.authorId.toString() === userId || post.authorId.toString() === userId) {
                
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

        // Check if the user is the owner of the comment
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