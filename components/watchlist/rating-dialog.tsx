"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function RatingDialog() {
  const { ratingDialogOpen, ratingDialogEntryId, closeRatingDialog } =
    useUIStore();
  const { watchlist, update } = useWatchlist();
  const { showNotification } = useUIStore();

  const entry = watchlist.find((e) => e.id === ratingDialogEntryId);

  const [rating, setRating] = useState<number>(entry?.rating ?? 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState<string>(entry?.review ?? "");

  function handleSave() {
    if (!entry) return;
    update(
      {
        id: entry.id,
        updates: { rating: rating || null, review: review || null },
      },
      {
        onSuccess: () => {
          showNotification("Rating saved", "success");
          closeRatingDialog();
        },
        onError: () => showNotification("Failed to save rating", "error"),
      },
    );
  }

  return (
    <Dialog open={ratingDialogOpen} onOpenChange={closeRatingDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate &amp; Review</DialogTitle>
          <DialogDescription>
            {entry?.title ?? "Rate this title"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Star rating */}
          <div>
            <Label>Your rating</Label>
            <div
              className="mt-2 flex gap-1"
              role="group"
              aria-label="Star rating">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`Rate ${star} out of 10`}
                  aria-pressed={rating === star}>
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                {rating} / 10
              </p>
            )}
          </div>

          {/* Review */}
          <div>
            <Label htmlFor="review">Review (optional)</Label>
            <Textarea
              id="review"
              className="mt-2"
              placeholder="Write your thoughts..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={1000}
              rows={4}
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {review.length}/1000
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeRatingDialog}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
