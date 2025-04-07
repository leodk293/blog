import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import Email from "@/lib/models/emails";

export const POST = async (request) => {
    try {
        await connectMongoDB();
        const { userName, userEmail } = await request.json();
        await Email.create({
            userName,
            userEmail,
        })
        return NextResponse.json({ message: "Email saved successfully" });
    } catch (error) {
        return NextResponse.status(500).json({ message: "Error saving email" });
    }
}

export const GET = async (request) => {
    try {
        await connectMongoDB();
        const emails = await Email.find();
        return NextResponse.json(emails);
    } catch (error) {
        return NextResponse.status(500).json({ message: "Error fetching emails" });
    }
}