"use client";

import NotificationManager from "@/components/NotificationManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import GoogleTranslate from "@/components/GoogleTranslate";
import { Globe } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <h1 className="text-3xl font-bold">Settings</h1>

            <div className="grid gap-6">
                {/* Language Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Language
                        </CardTitle>
                        <CardDescription>
                            Select your preferred language. Translations are powered by Google.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2 max-w-sm">
                            <Label>Choose Language</Label>
                            <GoogleTranslate />
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Manage your push notification preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="notifications">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive alerts about nearby bins, rewards, and events.
                            </p>
                        </div>
                        <NotificationManager />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
