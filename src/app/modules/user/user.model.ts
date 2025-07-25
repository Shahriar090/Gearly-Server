import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../config';
import {
  Auth_Provider,
  USER_GENDER,
  USER_ROLES,
  USER_STATUS,
} from './user.constant';
import {
  IUser,
  IUserName,
  TAuthProvider,
  TUserGender,
  TUserRole,
  TUserStatus,
  UserModel,
} from './user.interface';

const userNameSchema = new Schema<IUserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
});

const userSchema = new Schema<IUser, UserModel>(
  {
    name: userNameSchema,
    gender: {
      type: String,
      enum: Object.values(USER_GENDER) as TUserGender[],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: Object.values(Auth_Provider) as TAuthProvider[],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES) as TUserRole[],
      default: USER_ROLES.Customer,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS) as TUserStatus[],
      default: USER_STATUS.Active,
    },
    // Meta is for profile related some fields like, profile image, bio, any links etc.
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

// hashing the password before save the doc

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// excluding deleted users (documents) from get operations
userSchema.pre('find', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// removing the password field after save the doc
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// static method to check if the user is already exist or not
userSchema.statics.isUserExists = async function (email: string) {
  // 'this' refers to the user model
  return this.findOne({ email }).select('+password');
};

// static method to check if the plain-text password matches the hashed password.
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  const result = await bcrypt.compare(plainTextPassword, hashedPassword);
  return result;
};

// model
export const User = model<IUser, UserModel>('User', userSchema);
