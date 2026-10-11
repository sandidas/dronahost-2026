/**
 * Portal roles, stored as numbers on the user record. Use these names everywhere; never write the numbers.
 * ADMIN opens /dashboard and /office, STAFF opens /office, GUEST (every new sign-up) opens neither.
 */
export const ROLES = {
  ADMIN: 1001,
  STAFF: 999,
  GUEST: 888,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES: readonly Role[] = [ROLES.ADMIN, ROLES.STAFF, ROLES.GUEST];

export const isRole = (value: unknown): value is Role => typeof value === "number" && (ROLE_VALUES as readonly number[]).includes(value);

/** A stored value that is not a known role is treated as a guest. */
export const toRole = (value: unknown): Role => (isRole(value) ? value : ROLES.GUEST);
