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

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TUser = {
  name: TUserName;
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
};
