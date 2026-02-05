"use client";

import NotificationManager from "@/components/NotificationManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            
            <div className="grid gap-6">
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
