import { Types } from 'mongoose';

export type TAdminName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export enum AdminGender {
  Male = 'Male',
  Female = 'Female',
  Others = 'Others',
}

export type TAdmin = {
  user: Types.ObjectId;
  name: TAdminName;
  gender: AdminGender;
  age: number;
  contactNo: string;
  address: string;
  isDeleted: boolean;
  profileImage: string;
};
