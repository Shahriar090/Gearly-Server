import { Model } from 'mongoose';

export enum UserRoles {
  Admin = 'Admin',
  Customer = 'Customer',
}

export enum UserGender {
  Male = 'Male',
  Female = 'Female',
  Others = 'Others',
}
export enum UserStatus {
  Active = 'Active',
  Blocked = 'Blocked',
}

export interface IUserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface IUser {
  name: IUserName;
  gender: string;
  age: number;
  contactNo: string;
  address: string;
  email: string;
  password: string;
  profileImage: string;
  role: UserRoles;
  status: UserStatus;
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExists(email: string): Promise<IUser>;
}
