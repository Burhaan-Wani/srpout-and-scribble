ALTER TABLE "productVariants" RENAME COLUMN "updatedAt" TO "updated";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "createdAt" TO "created";--> statement-breakpoint
ALTER TABLE "variantImages" ALTER COLUMN "size" SET DATA TYPE real;