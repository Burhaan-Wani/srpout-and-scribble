"use client";

import { ReviewsWithUser } from "@/lib/infer-type";
import React, { useCallback } from "react";
import { Card, CardDescription, CardTitle } from "../ui/card";
import Stars from "./stars";
import { getReviewAverage } from "@/lib/review-average";
import { Progress } from "../ui/progress";

const ReviewChart = ({ reviews }: { reviews: ReviewsWithUser[] }) => {
    const totalRating = getReviewAverage(reviews.map((r) => r.rating));

    const getRatingByStars = useCallback((): number[] => {
        const ratingValues = Array.from({ length: 5 }, () => 0);
        const totalReviews = reviews.length;
        reviews.forEach((review) => {
            const starIndex = review.rating - 1;
            if (starIndex >= 0 && starIndex < 5) {
                ratingValues[starIndex]++;
            }
        });
        return ratingValues.map((rating) => (rating / totalReviews) * 100);
    }, [reviews]);

    return (
        <Card className="flex flex-col gap-4 rounded-md p-8">
            <div className="flex flex-col gap-2">
                <CardTitle>Product Rating:</CardTitle>
                <CardDescription className="text-lg font-medium">
                    {totalRating.toFixed(1)} stars
                </CardDescription>
            </div>
            {getRatingByStars().map((rating, index) => (
                <div
                    className="flex items-center justify-between gap-2"
                    key={index}
                >
                    <p className="flex gap-1 text-xs font-medium">
                        {index + 1} <span>stars</span>
                    </p>
                    <Progress value={rating} />
                </div>
            ))}
        </Card>
    );
};

export default ReviewChart;
