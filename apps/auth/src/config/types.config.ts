export const ROLE_NAME = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  SUPPORT: 'support',
} as const;

export type RoleType = typeof ROLE_NAME[keyof typeof ROLE_NAME];


export const PERMISSION = {
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_ASSIGN_ROLE: 'user:assign_role',

  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',

  DOCTOR_READ: 'doctor:read',
  DOCTOR_APPROVE: 'doctor:approve',
  DOCTOR_SUSPEND: 'doctor:suspend',

  AVAILABILITY_CREATE: 'availability:create',
  AVAILABILITY_UPDATE: 'availability:update',
  AVAILABILITY_DELETE: 'availability:delete',
  AVAILABILITY_READ: 'availability:read',

  BOOKING_CREATE: 'booking:create',
  BOOKING_CANCEL: 'booking:cancel',
  BOOKING_READ: 'booking:read',

  CONSULTATION_START: 'consultation:start',
  CONSULTATION_END: 'consultation:end',
  CONSULTATION_READ: 'consultation:read',
  CONSULTATION_UPDATE: 'consultation:update',

  PRESCRIPTION_CREATE: 'prescription:create',
  PRESCRIPTION_READ: 'prescription:read',
  PRESCRIPTION_UPDATE: 'prescription:update',

  PAYMENT_INITIATE: 'payment:initiate',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_READ: 'payment:read',

  SEARCH_DOCTOR: 'search:doctor',
  SEARCH_CONSULTATION: 'search:consultation',

  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  AUDIT_READ: 'audit:read',
} as const;

export type PermissionType = typeof PERMISSION[keyof typeof PERMISSION];


export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export type GenderType = typeof GENDER[keyof typeof GENDER];


export const USER_ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type UserAccountStatusType = typeof USER_ACCOUNT_STATUS[keyof typeof USER_ACCOUNT_STATUS];