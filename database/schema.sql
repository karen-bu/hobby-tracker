set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
  "userId" serial,
  "username" text NOT NULL,
  "hashedPassword" text NOT NULL,
  "createdAt" timestamptz(6) NOT NULL default now(),
  primary key ("userId")
);

CREATE TABLE "public"."hobbies" (
  "hobbyId" serial,
  "userId" int,
  "hobbyName" text NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE,
  primary key ("hobbyId")
);

CREATE TABLE "public"."entries" (
  "entryId" serial,
  "userId" int,
  FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE,
  "hobbyName" text NOT NULL,
  "hobbyId" int NOT NULL,
  "hoursSpent" int,
  "rating" int,
  "notes" text,
  "entryDate" timestamp NOT NULL,
  "createdAt" timestamptz(6) NOT NULL default now(),
  "modifiedAt" timestamptz(6) NOT NULL default now(),
  primary key ("entryId")
);

CREATE TABLE "public"."goals" (
  "goalId" serial,
  "hobbyId" int NOT NULL,
  "userId" int,
  FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE,
  "startDate" timestamp NOT NULL,
  "actualHours" int NOT NULL,
  "targetHours" int NOT NULL,
  "createdAt" timestamptz(6) NOT NULL default now(),
  primary key ("goalId")
);
