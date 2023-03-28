
-- create_users_conversations_relation_table

CREATE TABLE IF NOT EXISTS `users_conversations` (
	`userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`conversationId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (`userId`) REFERENCES users(`id`),
	FOREIGN KEY (`conversationId`) REFERENCES conversations(`id`),
	CONSTRAINT `userId_conversationId_unique` UNIQUE (`userId`, `conversationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
