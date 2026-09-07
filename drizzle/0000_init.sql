CREATE TABLE `action_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`target_type` text,
	`target_id` text,
	`ip` text NOT NULL,
	`user_agent` text,
	`country` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `action_logs_ip` ON `action_logs` (`ip`,`created_at`);--> statement-breakpoint
CREATE INDEX `action_logs_user` ON `action_logs` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `action_logs_created` ON `action_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `comment_reactions` (
	`comment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`emoji` text NOT NULL,
	`ip` text,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`comment_id`, `user_id`, `emoji`),
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comment_reactions_comment` ON `comment_reactions` (`comment_id`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text NOT NULL,
	`user_id` text,
	`parent_id` text,
	`author_label` text NOT NULL,
	`stance` text NOT NULL,
	`body` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`status` text DEFAULT 'visible' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `comments_entry` ON `comments` (`entry_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `comments_parent` ON `comments` (`parent_id`);--> statement-breakpoint
CREATE INDEX `comments_recent` ON `comments` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`image_url` text,
	`suki_count` integer DEFAULT 0 NOT NULL,
	`kirai_count` integer DEFAULT 0 NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`total_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'visible' NOT NULL,
	`created_by` text,
	`created_ip` text,
	`created_ua` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entries_slug_unique` ON `entries` (`slug`);--> statement-breakpoint
CREATE INDEX `entries_ranking` ON `entries` (`status`,`total_count`);--> statement-breakpoint
CREATE INDEX `entries_category_ranking` ON `entries` (`status`,`category`,`total_count`);--> statement-breakpoint
CREATE INDEX `entries_updated` ON `entries` (`status`,`updated_at`);--> statement-breakpoint
CREATE TABLE `entry_sources` (
	`entry_id` text NOT NULL,
	`source` text NOT NULL,
	`source_id` text NOT NULL,
	`source_url` text NOT NULL,
	PRIMARY KEY(`source`, `source_id`),
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `entry_sources_entry` ON `entry_sources` (`entry_id`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`reporter_id` text,
	`reason` text NOT NULL,
	`detail` text,
	`contact` text,
	`ip` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`reporter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `reports_status` ON `reports` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `votes` (
	`entry_id` text NOT NULL,
	`user_id` text NOT NULL,
	`stance` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`entry_id`, `user_id`),
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`id_token` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`banned` integer DEFAULT false NOT NULL,
	`ban_reason` text,
	`ban_expires` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
