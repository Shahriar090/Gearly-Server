import { Model } from 'mongoose';
import { USER_GENDER, USER_ROLES, USER_STATUS } from './user.constant';

// interface for user name
export interface IUserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

// Using typeof allows TypeScript to extract the type of the values from these constants.
// keyof is a TypeScript operator that returns the union of all keys of a type.

export type TUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type TUserGender = (typeof USER_GENDER)[keyof typeof USER_GENDER];
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface IUser {
  _id: string;
  name: IUserName;
  gender: TUserGender;
  age: number;
  contactNo: string;
  address: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: TUserRole;
  status: TUserStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: any;
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExists(email: string): Promise<IUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
