import { useToast as useInternalToast } from "./toast";

type ToastProps = {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
};

export function useToast() {
    const { showToast } = useInternalToast();

    const toast = ({ title, description, variant }: ToastProps) => {
        const type = variant === "destructive" ? "error" : "success";
        showToast(type, title || "Notification", description);
    };

    return { toast };
}
