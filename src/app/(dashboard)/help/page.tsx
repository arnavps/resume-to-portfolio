'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
    const faqs = [
        {
            question: "How do I connect my GitHub account?",
            answer: "Go to the 'Connect' page from the sidebar. You'll find a 'GitHub' card with a 'Connect' button. Click it and authorize Folio.ai to access your public repositories."
        },
        {
            question: "Can I use my own custom domain?",
            answer: "Yes! Once you publish your portfolio, go to 'Settings'. Under the 'Domain' section, you can enter your custom domain and follow the DNS configuration instructions."
        },
        {
            question: "How does the AI generation work?",
            answer: "Our AI analyzes your resume and GitHub profile to generate professional project descriptions, summarize your experience, and highlight your top skills. You can edit any generated content in the 'Customize' tab."
        },
        {
            question: "Is the portfolio mobile-friendly?",
            answer: "Absolutely. All templates are fully responsive and optimized for mobile, tablet, and desktop devices. You can preview your portfolio on different devices in the 'Customize' page."
        },
        {
            question: "How do I update my portfolio content?",
            answer: "You can update your content in two ways: 1) Go to the specific section (Projects, Experience) in the sidebar to add/edit items, or 2) Use the 'Customize' page 'Content' tab for quick edits while previewing."
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
                <p className="text-slate-600 mt-2">Find answers to common questions or get in touch with our team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Frequently Asked Questions</CardTitle>
                        <CardDescription>
                            Quick answers to the most common questions about Folio.ai.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-slate-600">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Support</CardTitle>
                            <CardDescription>
                                Need personalized help? Reach out to us.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start" leftIcon={<MessageCircle className="h-4 w-4" />}>
                                Live Chat
                            </Button>
                            <Button variant="outline" className="w-full justify-start" leftIcon={<Mail className="h-4 w-4" />}>
                                Email Support
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="/docs" className="block">
                                <Button variant="ghost" className="w-full justify-start hover:bg-slate-100" leftIcon={<FileText className="h-4 w-4" />}>
                                    Documentation
                                </Button>
                            </Link>
                            <Link href="/blog" className="block">
                                <Button variant="ghost" className="w-full justify-start hover:bg-slate-100" leftIcon={<ExternalLink className="h-4 w-4" />}>
                                    Video Tutorials
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
