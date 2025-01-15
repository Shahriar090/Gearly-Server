import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { TUser, UserRoles } from './user.interface';
import { User } from './user.model';

// create a admin
const createAdminIntoDb = async (
  adminData: Omit<TAdmin, 'user'> & { email: string; password: string },
) => {
  // creating a user first
  const userData: Partial<TUser> = {
    email: adminData.email,
    password: adminData.password,
    role: UserRoles.Admin,
    isDeleted: adminData.isDeleted || false,
  };

  const newUser = await User.create(userData);

  // creating admin after successfully created a user
  if (newUser) {
    const adminInfo: TAdmin = {
      user: newUser._id,
      name: adminData.name,
      gender: adminData.gender,
      age: adminData.age,
      contactNo: adminData.contactNo,
      address: adminData.address,
      isDeleted: adminData.isDeleted,
      profileImage: adminData.profileImage,
    };

    const newAdmin = await Admin.create(adminInfo);
    return newAdmin;
  }
};

export const userServices = { createAdminIntoDb };
