export enum UserRoles {
  Admin = 'Admin',
  Seller = 'Seller',
  Customer = 'Customer',
}

export enum UserStatus {
  Active = 'Active',
  Blocked = 'Blocked',
}

export type TUser = {
  email: string;
  password: string;
  role: UserRoles;
  status: UserStatus;
  isDeleted: boolean;
};
