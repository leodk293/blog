import Post from "@/lib/models/blog_posts";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

export const GET = async (request, { params }) => {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { message: "Post ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: error.message },
            { status: 500 }
        );
    }
}

export const PUT = async (request, { params }) => {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { message: "Post ID is required" },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const imageFile = formData.get("image");
        const authorId = formData.get("authorId");
        const category = formData.get("category");

        if (!authorId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 401 }
            );
        }

        // Validate fields (optional fields)
        if (title && title.trim() === "") {
            return NextResponse.json(
                { message: "Title cannot be empty" },
                { status: 400 }
            );
        }

        if (description && description.trim() === "") {
            return NextResponse.json(
                { message: "Description cannot be empty" },
                { status: 400 }
            );
        }

        if (category && category.trim() === "") {
            return NextResponse.json(
                { message: "Category cannot be empty" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Find the post first to check ownership
        const existingPost = await Post.findById(id);

        if (!existingPost) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        if (existingPost.authorId.toString() !== authorId) {
            return NextResponse.json(
                { message: "Unauthorized: Only the owner can update this post" },
                { status: 403 }
            );
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category) updateData.category = category;

        // Handle image upload if a new image is provided
        if (imageFile && imageFile.size > 0) {
            const timeStamp = Date.now();
            const imageName = imageFile.name;
            const imageBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(imageBuffer);
            const path = `./public/${timeStamp}_${imageName}`;
            await writeFile(path, buffer);
            const imageUrl = `/${timeStamp}_${imageName}`;

            updateData.imageUrl = imageUrl;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { message: "No update data provided" },
                { status: 400 }
            );
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return NextResponse.json(
            { message: "Post updated successfully", post: updatedPost },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: error.message },
            { status: 500 }
        );
    }
};