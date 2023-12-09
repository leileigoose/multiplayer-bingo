DROP TABLE IF EXISTS "player" CASCADE;
DROP TABLE IF EXISTS "game" CASCADE;
DROP TABLE IF EXISTS "gamechat" CASCADE;
DROP TABLE IF EXISTS "player_card" CASCADE;
DROP TABLE IF EXISTS "pulled_balls" CASCADE;
DROP TABLE IF EXISTS "card_spot" CASCADE;
DROP TABLE IF EXISTS "bingo_ball" CASCADE;
DROP TABLE IF EXISTS "player_gamechat" CASCADE;

CREATE TABLE "player" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL
);

CREATE TABLE "game" (
  "id" SERIAL PRIMARY KEY,
  "game_code" VARCHAR(255),
  "game_name" varchar(255),
  "max_players" SMALLINT,
  "password" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "started_at" timestamp
);

CREATE TABLE "gamechat" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "game_id" int NOT NULL,
  "message" text NOT NULL,
  "time_sent" timestamp NOT NULL
);

CREATE TABLE "player_card" (
  "id" SERIAL PRIMARY KEY,
  "game_id" int NOT NULL,
  "player_id" int NOT NULL,
  "is_checked_in" boolean,
  "is_winner" boolean
);

CREATE TABLE "pulled_balls" (
  "game_id" int NOT NULL,
  "bingo_ball_id" int NOT NULL
);

CREATE TABLE "card_spot" (
  "spot_id" SMALLINT,
  "bingo_ball_id" int NOT NULL,
  "player_card_id" int NOT NULL,
  "is_stamp" boolean,
  PRIMARY KEY ("spot_id", "bingo_ball_id", "player_card_id")
);

CREATE TABLE "bingo_ball" (
  "id" SERIAL PRIMARY KEY,
  "letter" varchar(1) NOT NULL,
  "number" int NOT NULL
);

CREATE UNIQUE INDEX ON "player_card" ("game_id", "player_id");

CREATE UNIQUE INDEX ON "pulled_balls" ("game_id", "bingo_ball_id");

CREATE TABLE "player_gamechat" (
  "player_id" int,
  "gamechat_id" int,
  PRIMARY KEY ("player_id", "gamechat_id"),
  FOREIGN KEY ("player_id") REFERENCES "player" ("id"),
  FOREIGN KEY ("gamechat_id") REFERENCES "gamechat" ("id")
);

ALTER TABLE "gamechat" ADD FOREIGN KEY ("game_id") REFERENCES "game" ("id");

ALTER TABLE "player_card" ADD FOREIGN KEY ("game_id") REFERENCES "game" ("id");

ALTER TABLE "player_card" ADD FOREIGN KEY ("player_id") REFERENCES "player" ("id");

ALTER TABLE "pulled_balls" ADD FOREIGN KEY ("game_id") REFERENCES "game" ("id");

ALTER TABLE "pulled_balls" ADD FOREIGN KEY ("bingo_ball_id") REFERENCES "bingo_ball" ("id");

ALTER TABLE "card_spot" ADD FOREIGN KEY ("bingo_ball_id") REFERENCES "bingo_ball" ("id");

ALTER TABLE "card_spot" ADD FOREIGN KEY ("player_card_id") REFERENCES "player_card" ("id");
