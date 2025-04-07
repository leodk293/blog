import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import Post from "@/lib/models/blog_posts";
import User from "@/lib/models/users";
import { writeFile } from "fs/promises";


export const POST = async (request) => {
    try {
        await connectMongoDB();

        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const image = formData.get("image");
        const authorId = formData.get("authorId");
        const authorImage = formData.get("authorImage");
        const authorName = formData.get("authorName");
        const category = formData.get("category");

        if (!title || !description || !image || !authorId || !authorImage || !authorName || !category) {
            return NextResponse.json(
                { message: "Some infos are missing" },
                { status: 400 }
            );
        }

        const userExists = await User.findById(authorId);
        if (!userExists) {
            return NextResponse.json(
                { message: "Author not found" },
                { status: 404 }
            );
        }

        const imageType = image.type;
        const imageName = image.name;
        const timeStamp = Date.now();

        const imageBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);
        const path = `./public/${timeStamp}_${imageName}`;
        await writeFile(path, buffer);
        const imageUrl = `/${timeStamp}_${imageName}`;
        console.log(imageUrl);

        const newPost = await Post.create({
            title,
            description,
            imageUrl,
            authorId,
            authorImage,
            authorName,
            category
        });

        return NextResponse.json(
            {
                message: 'Post created successfully',
                newPost
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    try {
        await connectMongoDB();
        const posts = await Post.find()
        return NextResponse.json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}


export const DELETE = async (request) => {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        const userId = url.searchParams.get("userId");

        if (!id) {
            return NextResponse.json(
                { message: "Post ID not found" },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { message: "User ID required" },
                { status: 401 }
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

        if (post.authorId.toString() !== userId) {
            return NextResponse.json(
                { message: "Unauthorized: Only the owner can delete this post" },
                { status: 403 }
            );
        }

        await Post.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}