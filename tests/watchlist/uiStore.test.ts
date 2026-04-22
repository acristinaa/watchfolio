import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUIStore } from "@/store/uiStore";

beforeEach(() => {
  useUIStore.setState({
    ratingDialogOpen: false,
    ratingDialogEntryId: null,
    notification: null,
  });
});

describe("uiStore", () => {
  it("opens rating dialog with entry id", () => {
    useUIStore.getState().openRatingDialog("entry-123");
    expect(useUIStore.getState().ratingDialogOpen).toBe(true);
    expect(useUIStore.getState().ratingDialogEntryId).toBe("entry-123");
  });

  it("closes rating dialog and clears entry id", () => {
    useUIStore.getState().openRatingDialog("entry-123");
    useUIStore.getState().closeRatingDialog();
    expect(useUIStore.getState().ratingDialogOpen).toBe(false);
    expect(useUIStore.getState().ratingDialogEntryId).toBeNull();
  });

  it("shows a notification", () => {
    vi.useFakeTimers();
    useUIStore.getState().showNotification("Added to watchlist", "success");
    expect(useUIStore.getState().notification).toEqual({
      message: "Added to watchlist",
      type: "success",
    });
    vi.useRealTimers();
  });

  it("clears notification manually", () => {
    useUIStore.getState().showNotification("Test", "error");
    useUIStore.getState().clearNotification();
    expect(useUIStore.getState().notification).toBeNull();
  });
});
