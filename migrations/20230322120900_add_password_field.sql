
-- add_password_field

ALTER TABLE social_chat.users ADD password varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
