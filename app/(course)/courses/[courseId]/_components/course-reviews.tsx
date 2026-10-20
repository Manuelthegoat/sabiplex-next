"use client";

import axios from "axios";
import { Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface CourseReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface CourseReviewsProps {
  courseId: string;
  reviews: CourseReviewItem[];
  ownReview: CourseReviewItem | null;
  canReview: boolean;
}

export function CourseReviews({ courseId, reviews: initialReviews, ownReview: initialOwnReview, canReview }: CourseReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [ownReview, setOwnReview] = useState(initialOwnReview);
  const [rating, setRating] = useState(initialOwnReview?.rating ?? 0);
  const [comment, setComment] = useState(initialOwnReview?.comment ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) return toast.error("Choose a star rating first.");

    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/courses/${courseId}/reviews`, { rating, comment });
      const savedReview: CourseReviewItem = {
        ...response.data,
        createdAt: new Date(response.data.createdAt).toISOString(),
      };
      setReviews((current) => [savedReview, ...current.filter((review) => review.id !== savedReview.id)]);
      setOwnReview(savedReview);
      toast.success("Your review was saved.");
    } catch (error) {
      const message = axios.isAxiosError(error) && typeof error.response?.data === "string"
        ? error.response.data
        : "Could not save your review. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Learner feedback</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">Reviews</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-500" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} className={`h-5 w-5 ${index < Math.round(averageRating) ? "fill-current" : ""}`} />
            ))}
          </div>
          <span className="text-sm font-semibold text-slate-700">
            {reviews.length ? `${averageRating.toFixed(1)} (${reviews.length} ${reviews.length === 1 ? "review" : "reviews"})` : "No reviews yet"}
          </span>
        </div>
      </div>

      {canReview ? (
        <form onSubmit={submitReview} className="mt-7 rounded-2xl bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">{ownReview ? "Update your review" : "Share your experience"}</h3>
          <div className="mt-3 flex items-center gap-1" role="group" aria-label="Choose a rating">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              return (
                <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`} aria-pressed={rating === value} className="rounded p-1 text-amber-500 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500">
                  <Star className={`h-7 w-7 ${value <= rating ? "fill-current" : ""}`} />
                </button>
              );
            })}
            <span className="ml-2 text-sm text-slate-500">{rating ? `${rating} out of 5` : "Select a rating"}</span>
          </div>
          <Textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} placeholder="What did you think of the course? (optional)" className="mt-4 min-h-24 resize-y rounded-xl bg-white" />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Only enrolled students can review.</span>
            <Button type="submit" disabled={isSubmitting || !rating}>{isSubmitting ? "Saving..." : ownReview ? "Update review" : "Submit review"}</Button>
          </div>
        </form>
      ) : (
        <p className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600">Enroll in this course to leave a verified review.</p>
      )}

      <div className="mt-6 divide-y divide-slate-100">
        {reviews.map((review) => (
          <article key={review.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">Verified learner</p>
                <div className="mt-1 flex gap-0.5 text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-current" : ""}`} />)}
                </div>
              </div>
              <time className="text-xs text-slate-500" dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
            </div>
            {review.comment && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{review.comment}</p>}
          </article>
        ))}
        {!reviews.length && <p className="py-6 text-sm text-slate-500">Be the first enrolled student to review this course.</p>}
      </div>
    </section>
  );
}
