import { z } from 'zod';
import { USER_GENDER, USER_ROLES, USER_STATUS } from './user.constant';

// create user name validations
const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1, 'First Name Is Required').trim(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name Is Required').trim(),
});
// update user name validations
const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1, 'First Name Is Required').trim().optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name Is Required').trim().optional(),
});

// create user validation schema
const createUserValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum([
        USER_GENDER.Male,
        USER_GENDER.Female,
        USER_GENDER.Others,
      ]),
      age: z.number().int().min(18, 'Age Must Be At Least 18'),
      contactNo: z.string().min(1, 'Contact Number Is Required').trim(),
      address: z.string().min(1, 'Address Is Required').trim(),
      email: z
        .string()
        .email('Invalid Email Format')
        .min(1, 'Email Is Required')
        .trim(),
      password: z
        .string()
        .min(6, 'Password Must Be At Least 6 Characters Long'),
      profileImage: z.string().optional(),
      role: z
        .enum([USER_ROLES.Admin, USER_ROLES.Customer])
        .optional()
        .default(USER_ROLES.Customer),
      status: z
        .enum([USER_STATUS.Active, USER_STATUS.Blocked])
        .optional()
        .default(USER_STATUS.Active),
      isDeleted: z
        .boolean()
        .optional()
        .default(false)
        .optional()
        .default(false),
    }),
  }),
});

// update user validation schema-----------------------------------------
const updateUserValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z
        .enum([USER_GENDER.Male, USER_GENDER.Female, USER_GENDER.Others])
        .optional(),
      age: z.number().int().min(18, 'Age Must Be At Least 18').optional(),
      contactNo: z
        .string()
        .min(1, 'Contact Number Is Required')
        .trim()
        .optional(),
      address: z.string().min(1, 'Address Is Required').trim().optional(),
      email: z
        .string()
        .email('Invalid Email Format')
        .min(1, 'Email Is Required')
        .trim()
        .optional(),
      password: z
        .string()
        .min(6, 'Password Must Be At Least 6 Characters Long')
        .optional(),
      profileImage: z.string().optional(),
      role: z.enum([USER_ROLES.Admin, USER_ROLES.Customer]).optional(),
      status: z.enum([USER_STATUS.Active, USER_STATUS.Blocked]).optional(),
      isDeleted: z.boolean().optional().default(false).optional(),
    }),
  }),
});

export const userValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
