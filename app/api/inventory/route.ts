import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Item } from '@/lib/models/index';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');

        await dbConnect();

        const query: any = { isDeleted: false };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { color: { $regex: search, $options: 'i' } },
            ];
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        const items = await Item.find(query)
            .populate('category', 'name')
            .sort({ updatedAt: -1 });

        return NextResponse.json(items);
    } catch (error) {
        console.error('Inventory GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inventory' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        // Validate Category ID format
        if (!data.category || !data.category.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                { error: 'Invalid or missing Category' },
                { status: 400 }
            );
        }

        const item = await Item.create(data);
        return NextResponse.json(item, { status: 201 });
    } catch (error: any) {
        console.error('Inventory POST error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Failed to create item' },
            { status: 500 }
        );
    }
}
