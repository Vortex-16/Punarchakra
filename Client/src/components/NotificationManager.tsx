"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { urlBase64ToUint8Array } from "@/utils/push";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function NotificationManager() {
    const { data: session } = useSession();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isSupported, setIsSupported] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            // Register our custom service worker
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                    registerServiceWorker();
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    const registerServiceWorker = async () => {
        try {
            // Wait for next-pwa to register the service worker
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            if (sub) {
                setSubscription(sub);
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error("Service Worker check failed:", error);
        }
    };

    const subscribeToPush = async () => {
        try {
            toast({ title: "Status", description: "Starting subscription process..." });

            if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
                throw new Error("VAPID public key is missing.");
            }

            // 1. Request Permission
            if (Notification.permission === 'default') {
                toast({ title: "Permission", description: "Requesting notification permission..." });
                const permission = await Notification.requestPermission();
                if (permission === 'denied') {
                    throw new Error("Permission denied by user.");
                }
            } else if (Notification.permission === 'denied') {
                throw new Error("Notifications are blocked. Please enable them in browser settings.");
            }

            // 2. Service Worker Registration (handled by next-pwa)
            toast({ title: "Status", description: "Waiting for Service Worker..." });
            const registration = await navigator.serviceWorker.ready;

            // 3. Subscribe
            toast({ title: "Status", description: "Subscribing to Push Service..." });
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!) as any
            });

            console.log("Push Subscription successful:", sub);
            setSubscription(sub);
            setIsSubscribed(true);
            
            // 4. Save to Backend
            toast({ title: "Status", description: "Saving subscription to server..." });
            await saveSubscription(sub);
            
            toast({
                title: "Success! 🎉",
                description: "You are now subscribed to notifications.",
            });
        } catch (error) {
            console.error("Failed to subscribe:", error);
            let errorMessage = "Failed to subscribe.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    const saveSubscription = async (sub: PushSubscription) => {
        if (!session?.user?.email) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: session.user.email,
                    subscription: sub,
                }),
            });
        } catch (error) {
            console.error("Failed to save subscription to server:", error);
        }
    };

    if (!isSupported) {
        return null; 
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={subscribeToPush}
            disabled={isSubscribed}
            title={isSubscribed ? "Notifications Enabled" : "Enable Notifications"}
        >
            {isSubscribed ? <Bell className="h-5 w-5 text-primary" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
        </Button>
    );
}
