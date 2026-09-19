CREATE TABLE `siteSettings` (
	`settingKey` varchar(64) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteSettings_settingKey` PRIMARY KEY(`settingKey`)
);
