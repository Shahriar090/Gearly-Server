import { model, Schema } from 'mongoose';
import {
  IUser,
  IUserName,
  UserGender,
  UserModel,
  UserRoles,
  UserStatus,
} from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

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
      enum: Object.values(UserGender),
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
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.Customer,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
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
  return this.findOne({ email });
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
