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
            registerServiceWorker();
        }
    }, []);

    const registerServiceWorker = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            if (sub) {
                setSubscription(sub);
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error("Service Worker registration failed:", error);
        }
    };

    const subscribeToPush = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Check current permission
            if (Notification.permission === 'denied') {
                toast({
                    title: "Permission Denied",
                    description: "Please enable notifications in your browser settings.",
                    variant: "destructive"
                });
                return;
            }

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!) as any
            });

            setSubscription(sub);
            setIsSubscribed(true);
            
            // Send subscription to backend
            await saveSubscription(sub);
            
            toast({
                title: "Subscribed!",
                description: "You will now receive notifications about nearby bins and rewards.",
            });
        } catch (error) {
            console.error("Failed to subscribe:", error);
            toast({
                title: "Error",
                description: "Failed to subscribe to notifications.",
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
