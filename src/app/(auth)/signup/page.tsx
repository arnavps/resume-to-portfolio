'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || 'Registration failed');
                return;
            }

            // Success
            router.push('/dashboard');
        } catch (error: any) {
            setErrorMsg('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleSignup}>
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
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
                                    minLength={6}
                                />
                            </div>
                            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-slate-500 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
