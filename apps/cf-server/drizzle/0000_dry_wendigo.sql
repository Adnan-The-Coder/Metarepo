CREATE TABLE `portfolio_consultation_scheduling` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`about` text NOT NULL,
	`goals` text NOT NULL,
	`preferred_date_time` text NOT NULL,
	`timezone` text,
	`scheduled_at` text,
	`meeting_link` text,
	`status` text DEFAULT 'new' NOT NULL,
	`source` text,
	`subscribed` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolio_consultation_scheduling_email_unique` ON `portfolio_consultation_scheduling` (`email`);