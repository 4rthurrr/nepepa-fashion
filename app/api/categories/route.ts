import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category } from '@/lib/models/index';

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        await dbConnect();

        // Check if category exists
        const existing = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
        if (existing) {
            return NextResponse.json(
                { error: 'Category already exists' },
                { status: 400 }
            );
        }

        const category = await Category.create({ name });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
