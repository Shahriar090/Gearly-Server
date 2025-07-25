export const USER_ROLES = {
  Admin: 'Admin',
  Customer: 'Customer',
} as const;

export const USER_GENDER = {
  Male: 'Male',
  Female: 'Female',
  Others: 'Others',
} as const;

export const USER_STATUS = {
  Active: 'Active',
  Blocked: 'Blocked',
} as const;

export const Auth_Provider = {
  Local: 'Local',
  Google: 'Google',
  GitHub: 'GitHub',
};
