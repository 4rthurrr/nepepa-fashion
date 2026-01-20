'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Shirt } from 'lucide-react';

export default function LoginPage() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pin }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 rounded-full bg-primary text-primary-foreground">
                        <Shirt className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Yasith Inventory</h1>
                    <p className="text-sm text-muted-foreground">Enter your secure PIN to access the system.</p>
                </div>

                <Card className="border-muted shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl">Authentication</CardTitle>
                        <CardDescription>Enter admin PIN</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="• • • • • •"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    maxLength={6}
                                    className="text-center text-3xl tracking-[1em] h-16 font-mono"
                                    autoFocus
                                />
                                {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}
                            </div>
                            <Button type="submit" size="lg" className="w-full" disabled={loading || pin.length < 4}>
                                {loading ? 'Verifying...' : 'Access System'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
