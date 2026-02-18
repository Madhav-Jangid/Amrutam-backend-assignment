CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."permission_name" AS ENUM('user:create', 'user:read', 'user:update', 'user:delete', 'user:assign_role', 'profile:read', 'profile:update', 'doctor:read', 'doctor:approve', 'doctor:suspend', 'availability:create', 'availability:update', 'availability:delete', 'availability:read', 'booking:create', 'booking:cancel', 'booking:read', 'consultation:start', 'consultation:end', 'consultation:read', 'consultation:update', 'prescription:create', 'prescription:read', 'prescription:update', 'payment:initiate', 'payment:refund', 'payment:read', 'search:doctor', 'search:consultation', 'analytics:view', 'analytics:export', 'audit:read');--> statement-breakpoint
CREATE TYPE "public"."role_name" AS ENUM('admin', 'doctor', 'patient', 'support');--> statement-breakpoint
CREATE TYPE "public"."user_account_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"name" "role_name",
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"name" "permission_name",
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "permissions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid,
	"permission_id" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"password_hash" text NOT NULL,
	"status" "user_account_status" DEFAULT 'active',
	"email_verified" boolean DEFAULT false NOT NULL,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"token_version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_by" uuid,
	"assigned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "mfa_secrets" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"secret_encrypted" text NOT NULL,
	"backup_codes_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"avatar_url" text,
	"date_of_birth" timestamp,
	"gender" "gender",
	"address_line1" text,
	"address_line2" text,
	"city" text,
	"state" text,
	"country" text,
	"postal_code" text,
	"timezone" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone DEFAULT now(),
	"revoked" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"revoked_at" timestamp with time zone DEFAULT now(),
	"ip_address" text,
	"user_agent" text,
	CONSTRAINT "refresh_tokens_id_unique" UNIQUE("id"),
	CONSTRAINT "refresh_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"device_info" text,
	"ip_address" text,
	"revoked" boolean DEFAULT false,
	"Last_active_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "sessions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "otps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"otp" integer NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone DEFAULT NOW() + INTERVAL '10 minutes' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mfa_secrets" ADD CONSTRAINT "mfa_secrets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "otp_id_idx" ON "otps" USING btree ("id");