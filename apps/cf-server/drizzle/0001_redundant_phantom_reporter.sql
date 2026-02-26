CREATE TABLE `osmania_university_results_storage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rollnumber` text NOT NULL,
	`html_response` text NOT NULL,
	`result_release_month_year` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `osmania_university_results_storage_html_response_unique` ON `osmania_university_results_storage` (`html_response`);