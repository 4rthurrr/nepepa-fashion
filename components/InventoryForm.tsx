'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react';
import { Link } from 'lucide-react';

export default function InventoryForm({ params }: { params: { id?: string } }) {
    const isEdit = !!params?.id;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        materialType: 'Custom',
        quantity: 0,
        unit: 'pcs',
        color: '',
        notes: ''
    });

    useEffect(() => {
        fetch('/api/categories').then(res => res.json()).then(setCategories);

        if (isEdit && params.id) {
            fetch(`/api/inventory/${params.id}`).then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name,
                        category: data.category?._id || data.category,
                        materialType: data.materialType,
                        quantity: data.quantity,
                        unit: data.unit,
                        color: data.color || '',
                        notes: data.notes || ''
                    });
                }
                setFetching(false);
            });
        }
    }, [isEdit, params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/inventory/${params.id}` : '/api/inventory';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');

            router.push('/inventory');
            router.refresh();
        } catch (e) {
            alert('Error saving item');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            <div className="grid gap-2">
                <h2 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Item' : 'New Item'}</h2>
                <p className="text-muted-foreground">
                    {isEdit ? 'Update inventory details below.' : 'Add a new item to your inventory.'}
                </p>
            </div>

            <Card className="border-muted bg-card shadow-sm">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Item Name</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Silk Fabric Roll"
                                className="bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Category</label>
                                {categories.length === 0 ? (
                                    <div className="p-3 border rounded-md bg-amber-50 text-amber-900 text-sm">
                                        No categories found. <a href="/categories" className="underline font-bold">Create one first</a>.
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            required
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Material Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.materialType}
                                    onChange={e => setFormData({ ...formData, materialType: e.target.value })}
                                >
                                    {['Fabric', 'Yarn', 'Color', 'Custom'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50 border space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
                                <Info className="w-4 h-4" /> Stock Details
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Quantity</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <label className="text-sm font-medium leading-none">Unit</label>
                                    <Input
                                        value={formData.unit}
                                        placeholder="pcs"
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <label className="text-sm font-medium leading-none">Color</label>
                                    <Input
                                        value={formData.color}
                                        placeholder="e.g. Red"
                                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Notes (Optional)</label>
                            <Input
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional details..."
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="w-full md:w-auto min-w-[150px]" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
