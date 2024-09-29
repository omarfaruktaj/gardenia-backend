import User from '../modules/user/userModel';
import { generateRandomString } from '../utils/generateRandomString';

export const generateUniqueUsername = async (
  baseUsername: string
): Promise<string> => {
  const username = baseUsername.toLowerCase();

  const randomSuffix = generateRandomString(4);
  const finalUsername = `${username}_${randomSuffix}`;

  const existingUser = await User.findOne({ username: finalUsername });
  if (existingUser) {
    return generateUniqueUsername(baseUsername);
  }

  return finalUsername;
};
