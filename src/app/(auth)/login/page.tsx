'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const message = searchParams.get('message');
        const error = searchParams.get('error');
        if (message) {
            setErrorMsg(message);
        } else if (error) {
            setErrorMsg('Authentication failed. Please try again.');
        }
    }, [searchParams]);

    const handleEmailSubmmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || 'Login failed');
                return;
            }

            // Successfully logged in
            const redirectUrl = searchParams.get('redirect') || '/dashboard';
            router.push(redirectUrl);
            router.refresh();
        } catch (error) {
            setErrorMsg('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Enter your email to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errorMsg}
                    </div>
                )}
                <form onSubmit={handleEmailSubmmit}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-slate-500 text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-slate-500" />}>
                <LoginPageContent />
            </Suspense>
        </div>
    );
}
