import { pgEnum } from "drizzle-orm/pg-core";

export const roleNameEnum = pgEnum('role_name', [
  'admin',
  'doctor',
  'patient',
  'support'
]);

export const permissionNameEnum = pgEnum('permission_name', [

  // ===== AUTH / USER =====
  'user:create',
  'user:read',
  'user:update',
  'user:delete',
  'user:assign_role',

  // ===== PROFILE =====
  'profile:read',
  'profile:update',

  // ===== DOCTOR =====
  'doctor:read',
  'doctor:approve',
  'doctor:suspend',

  // ===== AVAILABILITY =====
  'availability:create',
  'availability:update',
  'availability:delete',
  'availability:read',

  // ===== BOOKING =====
  'booking:create',
  'booking:cancel',
  'booking:read',

  // ===== CONSULTATION =====
  'consultation:start',
  'consultation:end',
  'consultation:read',
  'consultation:update',

  // ===== PRESCRIPTION =====
  'prescription:create',
  'prescription:read',
  'prescription:update',

  // ===== PAYMENT =====
  'payment:initiate',
  'payment:refund',
  'payment:read',

  // ===== SEARCH =====
  'search:doctor',
  'search:consultation',

  // ===== ANALYTICS =====
  'analytics:view',
  'analytics:export',

  // ===== AUDIT =====
  'audit:read',

]);

export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

export const userStatusEnum = pgEnum('user_account_status', ['active', 'inactive', 'suspended']);
