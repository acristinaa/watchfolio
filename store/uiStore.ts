import { create } from "zustand";

interface UIStore {
  // Rating dialog
  ratingDialogOpen: boolean;
  ratingDialogEntryId: string | null;
  openRatingDialog: (entryId: string) => void;
  closeRatingDialog: () => void;

  // Toast-like notifications
  notification: { message: string; type: "success" | "error" } | null;
  showNotification: (message: string, type: "success" | "error") => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  ratingDialogOpen: false,
  ratingDialogEntryId: null,
  openRatingDialog: (entryId) =>
    set({ ratingDialogOpen: true, ratingDialogEntryId: entryId }),
  closeRatingDialog: () =>
    set({ ratingDialogOpen: false, ratingDialogEntryId: null }),

  notification: null,
  showNotification: (message, type) => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3500);
  },
  clearNotification: () => set({ notification: null }),
}));
