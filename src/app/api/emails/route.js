import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDB";
import Email from "@/lib/models/emails";

export const POST = async (request) => {
    try {
        await connectMongoDB();
        const { userName, userEmail } = await request.json();
        const isEmailExists = await Email.findOne({ userEmail: userEmail });
        if (isEmailExists) {
            return NextResponse.json({ message: "Email already exists" });
        }
        await Email.create({
            userName,
            userEmail,
        })
        return NextResponse.json({ message: "Email saved successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error saving email" }, { status: 500 });
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