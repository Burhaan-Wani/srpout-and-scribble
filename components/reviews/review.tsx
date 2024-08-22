"use client";
import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Stars from "./stars";
// import Stars from "./stars";

export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
    return (
        <motion.div className="my-2 flex flex-col gap-4">
            {reviews.map((review) => (
                <Card key={review?.id} className="p-4">
                    <div className="flex items-center gap-2">
                        {review.user?.image && (
                            <Image
                                src={review.user.image}
                                alt={review.user.name!}
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                        )}
                        {!review.user.image && (
                            <Avatar>
                                <AvatarFallback className="bg-primary/25">
                                    {review.user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div>
                            <p className="text-sm font-bold">
                                {review.user?.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <Stars rating={review.rating} />
                                <p className="text-bold text-xs text-muted-foreground">
                                    {formatDistance(
                                        subDays(review.created!, 0),
                                        new Date(),
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="py-2 font-medium">{review.comment}</p>
                </Card>
            ))}
        </motion.div>
    );
}
