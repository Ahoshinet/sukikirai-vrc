CREATE TABLE `kv_store` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer
);
--> statement-breakpoint
CREATE INDEX `kv_store_expires` ON `kv_store` (`expires_at`);