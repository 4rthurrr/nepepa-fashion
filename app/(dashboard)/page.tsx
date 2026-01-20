'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Tags, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn exists

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalItems: 0,
        totalCategories: 0,
        lowStock: 0,
        totalValue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [itemsRes, catsRes] = await Promise.all([
                    fetch('/api/inventory?limit=1000'),
                    fetch('/api/categories')
                ]);

                const items = await itemsRes.json();
                const categories = await catsRes.json();

                if (Array.isArray(items) && Array.isArray(categories)) {
                    const lowStockCount = items.filter((i: any) => i.quantity < 10).length;

                    setStats({
                        totalItems: items.length,
                        totalCategories: categories.length,
                        lowStock: lowStockCount,
                        totalValue: 0
                    });
                }
            } catch (e) {
                console.error("Failed to load stats", e);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 rounded-lg bg-muted/50 animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">Welcome back to your inventory dashboard.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalItems}</div>
                        <p className="text-xs text-muted-foreground">+20% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <Tags className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCategories}</div>
                        <p className="text-xs text-muted-foreground">Active categories</p>
                    </CardContent>
                </Card>

                <Card className={cn("hover:shadow-md transition-shadow border-l-4", stats.lowStock > 0 ? "border-l-amber-500" : "border-l-transparent")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <AlertTriangle className={cn("h-4 w-4", stats.lowStock > 0 ? "text-amber-500" : "text-muted-foreground")} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.lowStock}</div>
                        <p className="text-xs text-muted-foreground">Items require attention</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">Operational</div>
                        <p className="text-xs text-muted-foreground">All systems normal</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Activity logs will appear here.
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div className="p-3 bg-muted rounded-md text-sm font-medium">Add New Item</div>
                        <div className="p-3 bg-muted rounded-md text-sm font-medium">Create Category</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
