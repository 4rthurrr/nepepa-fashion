'use client';

import InventoryForm from '@/components/InventoryForm';
import { use } from 'react';

// Next.js 15+ allows params to be a Promise? 
// Actually in Next.js 14 params is an object. In recent versions it might be a Promise.
// But the component is 'use client'.
// The params prop in a page is passed by default.
// However, since it is a client component, I need to be careful.
// Recommended pattern for client pages with params:
// export default function Page({ params }: { params: { id: string } }) { ... }
// But wait, in Next 15 params IS a promise. 
// "params" should be awaited if accessing properties in Server Components.
// In Client Components, it is passed as a prop but... 
// actually let's use a Server Component wrapper to unwrap params if needed, OR just type it as any for safety or `Promise<{ id: string }>`.

// BUT, `create-next-app` usually sets up Next 15.
// Let's assume standard behavior:
// If I make it async function Page({ params }) ... it is a Server Component.
// But I need 'use client' for the form.
// SO: Page is Server Component, wraps Client Form.

// Correct Implementation:
// app/(dashboard)/inventory/[id]/edit/page.tsx (Server Component)

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <InventoryForm params={{ id }} />;
}
