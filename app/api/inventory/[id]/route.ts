import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Item } from '@/lib/models/index';

// Get Single Item
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const item = await Item.findById(id).populate('category', 'name');

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch item' },
            { status: 500 }
        );
    }
}

// Update Item
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const updateData = await request.json();
        await dbConnect();

        const item = await Item.findByIdAndUpdate(
            id,
            { ...updateData, lastUpdated: new Date() },
            { new: true, runValidators: true }
        );

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update item' },
            { status: 500 }
        );
    }
}

// Soft Delete Item
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        // Soft delete
        const item = await Item.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item deleted' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete item' },
            { status: 500 }
        );
    }
}
