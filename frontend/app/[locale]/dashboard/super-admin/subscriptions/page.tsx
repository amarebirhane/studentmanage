'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Check, Sparkles, Building, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionsPage() {
    const plans = [
        {
            name: "Starter",
            description: "Ideal for small private centers.",
            price: "$99",
            features: ["Up to 100 students", "Basic analytics", "Email support", "Cloud storage (5GB)"],
            icon: Building,
            badge: "Popular for Small Schools",
        },
        {
            name: "Professional",
            description: "Standard for medium-sized schools.",
            price: "$249",
            features: ["Up to 1000 students", "Advanced reporting", "24/7 Phone support", "Cloud storage (50GB)", "Mobile App access"],
            icon: Zap,
            badge: "Best Value",
            highlight: true,
        },
        {
            name: "Enterprise",
            description: "Custom solutions for large institutions.",
            price: "Custom",
            features: ["Unlimited students", "Dedicated account manager", "Custom domain", "Unlimited storage", "SLA guarantees"],
            icon: Sparkles,
            badge: "Institutional",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
                    <p className="text-muted-foreground">Manage tenant plans, billing cycles, and platform tier configurations.</p>
                </div>
                <Button className="glass bg-primary/20 hover:bg-primary/30 text-primary border-primary/20">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing Settings
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`relative glass border-white/10 ${plan.highlight ? 'ring-2 ring-primary' : ''}`}>
                        {plan.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-[10px] font-bold uppercase tracking-widest rounded-full text-primary-foreground shadow-lg">
                                Recommended
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 rounded-xl bg-primary/10">
                                    <plan.icon className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{plan.badge}</span>
                            </div>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-baseline space-x-1">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-sm text-muted-foreground">{plan.price !== 'Custom' ? '/ month' : ''}</span>
                            </div>

                            <div className="space-y-3">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center text-sm">
                                        <Check className="h-4 w-4 text-green-500 mr-3 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button className={`w-full ${plan.highlight ? 'bg-primary text-primary-foreground' : 'glass border-white/10 hover:bg-white/5'}`}>
                                Edit Plan Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
