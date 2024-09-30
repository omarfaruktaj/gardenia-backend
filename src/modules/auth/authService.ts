import crypto from 'crypto';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { Email } from '../../config/email';
import env from '../../config/env';
import AppError from '../../errors/app-error';
import { generateUniqueUsername } from '../../lib/generateUniqueUsername';
import User from '../user/userModel';
import { getAUser } from '../user/userService';
import {
  changePasswordSchemaType,
  forgotPasswordSchemaType,
  resetPasswordSchemaType,
  SignInSchemaType,
  UserType,
} from '../user/userValidation';

export const signupService = async ({
  name,
  email,
  password,
  role,
}: UserType) => {
  const existedUser = await User.findOne({ email });

  if (existedUser) throw new AppError('Use already exit.', httpStatus.CONFLICT);

  const baseUsername = name.split(' ').join('');
  const username = await generateUniqueUsername(baseUsername);

  const user = await User.create({ name, email, password, username, role });

  return user;
};
export const signInService = async ({ email, password }: SignInSchemaType) => {
  const user = await getAUser('email', email).select('+password');

  if (!user || !(await User.correctPassword(password, user.password)))
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);

  return user;
};

export const forgotPasswordService = async ({
  email,
}: forgotPasswordSchemaType) => {
  const user = await getAUser('email', email);

  if (!user) throw new AppError('No user found.', httpStatus.NOT_FOUND);

  const resetToken = user.createPasswordResetToken();

  await user.save();

  const resetURL = `${env.RESET_TOKEN_CLIENT_URL}?token=${resetToken}`;

  try {
    const mailOptions = {
      to: user.email,
      subject: 'Gardenia Password Reset Request',
      html: `<html>
            <head>
              <style>
                body { font-family: 'Arial', sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; color: #333; }
                .container { max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden; border-top: 4px solid #007bff; }
                .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 20px; line-height: 1.6; }
                .button { display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; transition: background-color 0.3s; }
                .button:hover { background-color: #0056b3; }
                .footer { padding: 20px; font-size: 12px; text-align: center; background-color: #f4f4f9; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Password Reset</h1>
                </div>
                <div class="content">
                  <p>Hi ${user.username},</p>
                  <p>We've received a request to reset your password. Click the button below to set a new password:</p>
                  <a href="${resetURL}" class="button">Reset Password</a>
                  <p>This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.</p>                  <p>Thank you for being a valued member of our community!</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>`,
      text: `Hi ${user.username},

      We've received a request to reset your password for your Gardenia account. 
      Click the link below to set a new password:
      
      ${resetURL}

      This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.

      Thank you for being a valued member of our community!

      &copy; ${new Date().getFullYear()} Gardenia. All rights reserved.
     `,
    };

    const email = new Email();

    const sendmail = await email.send(mailOptions);
    console.log(sendmail);

    return { message: 'Token sent to email! Please check you email' };
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save();

    throw new AppError(
      'There was an error sending the email. Try again later!',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const resetPasswordService = async ({
  token,
  password,
}: resetPasswordSchemaType & { token: string }) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user)
    throw new AppError(
      'Token is invalid or has expired',
      httpStatus.BAD_REQUEST
    );

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;

  await user.save();

  return user;
};

export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}: changePasswordSchemaType & { userId: string }) => {
  const user = await User.findById(userId).select('+password');

  if (!user) throw new AppError('No user found.', httpStatus.NOT_FOUND);

  if (!(await User.correctPassword(currentPassword, user?.password as string)))
    throw new AppError(
      'Your current password is wrong.',
      httpStatus.UNAUTHORIZED
    );

  user.password = newPassword;
  await user.save();

  return user;
};
interface DecodedToken {
  userId: string;
}
export const refreshTokenService = async (token: string) => {
  const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as DecodedToken;
  console.log(decoded);
  const user = await User.findById(decoded.userId);

  if (!user) throw new AppError('No user found', httpStatus.NOT_FOUND);

  return user;
};
