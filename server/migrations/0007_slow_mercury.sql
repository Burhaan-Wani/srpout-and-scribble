ALTER TABLE "two_factor_token" ADD COLUMN "userID" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_token" ADD CONSTRAINT "two_factor_token_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
