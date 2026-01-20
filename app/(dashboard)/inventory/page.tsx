'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const router = useRouter();

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (search) query.set('search', search);
            if (categoryFilter) query.set('category', categoryFilter);

            const res = await fetch(`/api/inventory?${query.toString()}`);
            if (res.ok) setItems(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) setCategories(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInventory();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        try {
            await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
            fetchInventory();
        } catch (e) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
                    <p className="text-muted-foreground">Manage your stock and materials.</p>
                </div>
                <Button onClick={() => router.push('/inventory/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, color..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-[200px]">
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="border rounded-md bg-card">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />)}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-6 h-6 opacity-50" />
                        </div>
                        <p>No items found matching your filters.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {/* Header (Desktop only) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                            <div className="col-span-4">Name</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-2 text-right">Quantity</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {items.map((item) => (
                            <div key={item._id} className={cn(
                                "group flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 p-4 items-start md:items-center transition-colors hover:bg-muted/50",
                                item.quantity < 10 && "bg-destructive/5 hover:bg-destructive/10"
                            )}>
                                <div className="col-span-4 min-w-0">
                                    <div className="font-medium truncate">{item.name}</div>
                                    {item.color && (
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-current" style={{ color: item.color.toLowerCase() }}></span>
                                            {item.color}
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-2 flex items-center">
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        {item.category?.name || 'Uncategorized'}
                                    </span>
                                </div>

                                <div className="col-span-2 text-sm text-muted-foreground">
                                    {item.materialType}
                                </div>

                                <div className="col-span-2 flex items-center justify-between md:justify-end gap-2 md:gap-0">
                                    <div className="md:text-right">
                                        <div className={cn("font-medium", item.quantity < 10 ? "text-destructive" : "")}>
                                            {item.quantity} {item.unit}
                                        </div>
                                        {item.quantity < 10 && <div className="text-[10px] text-destructive font-medium uppercase tracking-wider">Low Stock</div>}
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => router.push(`/inventory/${item._id}/edit`)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
