import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category, Item } from '@/lib/models/index';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        // Prevent deleting if items exist in this category
        const itemsCount = await Item.countDocuments({ category: id, isDeleted: false });
        if (itemsCount > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with active items' },
                { status: 400 }
            );
        }

        await Category.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Category deleted' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
