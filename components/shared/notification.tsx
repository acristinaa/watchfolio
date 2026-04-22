"use client";

import { CheckCircle, XCircle, X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function Notification() {
  const { notification, clearNotification } = useUIStore();

  if (!notification) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
        "animate-in slide-in-from-bottom-2 duration-300",
        notification.type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800",
      )}>
      {notification.type === "success" ? (
        <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <p className="text-sm font-medium">{notification.message}</p>
      <button
        onClick={clearNotification}
        className="ml-2 rounded hover:opacity-70"
        aria-label="Dismiss notification">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
