CREATE TABLE `vote_events` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text NOT NULL,
	`stance` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `vote_events_entry_created` ON `vote_events` (`entry_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `vote_events_created` ON `vote_events` (`created_at`);--> statement-breakpoint
INSERT INTO `vote_events` (`id`, `entry_id`, `stance`, `created_at`)
SELECT lower(hex(randomblob(16))), `entry_id`, `stance`, `created_at`
FROM `votes`;--> statement-breakpoint
UPDATE `entries`
SET
  `suki_count` = (SELECT count(*) FROM `votes` WHERE `votes`.`entry_id` = `entries`.`id` AND `votes`.`stance` = 'suki'),
  `kirai_count` = (SELECT count(*) FROM `votes` WHERE `votes`.`entry_id` = `entries`.`id` AND `votes`.`stance` = 'kirai'),
  `total_count` = (SELECT count(*) FROM `votes` WHERE `votes`.`entry_id` = `entries`.`id`),
  `comment_count` = (SELECT count(*) FROM `comments` WHERE `comments`.`entry_id` = `entries`.`id` AND `comments`.`status` = 'visible');
