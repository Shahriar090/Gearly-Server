import { z } from 'zod';

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email Is Required' })
      .email('Invalid Email Format')
      .trim(),
    password: z.string({ required_error: 'Password Is Required' }),
  }),
});

// refresh token validation schema
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token Is Required' }),
  }),
});

export const authValidations = {
  loginUserValidationSchema,
  refreshTokenValidationSchema,
};
