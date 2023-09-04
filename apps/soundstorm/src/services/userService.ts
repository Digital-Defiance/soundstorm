// utils/userUtils.ts
import { Document } from 'mongoose';
import validator from 'validator';
import { BaseModel, IUser, ModelName } from '@soundstorm/soundstorm-lib';
import { InvalidEmail } from '../errors/invalidEmail';
import { InvalidPassword } from '../errors/invalidPassword';
import { EmailExistsError } from '../errors/emailExists';
import { UsernameExistsError } from '../errors/usernameExists';
import { managementClient } from '../auth0';
import { environment } from '../environment';

const UserModel = BaseModel.getModel<IUser>(ModelName.User);

export class UserService {
  public static async register(
    email: string,
    username: string,
    password: string,
  ): Promise<Document<unknown, object, IUser>> {
    // Email validation using validator.js
    if (!validator.isEmail(email)) {
      throw new InvalidEmail(email);
    }

    if (await UserModel.findOne({ email: email })) {
      throw new EmailExistsError(email);
    }

    if (await UserModel.findOne({ username: username })) {
      throw new UsernameExistsError(username);
    }

    // Password validation: Here, we'll use validator.js for the email,
    // and keep the previous logic for password. Adjust this logic if needed.
    if (
      !password ||
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[A-Za-z]/.test(password)
    ) {
      throw new InvalidPassword(
        'Password must be at least 8 characters long and contain both letters and numbers',
      );
    }

    try {
      // Register user in Auth0
      const auth0User = await managementClient.createUser({
        connection: environment.auth0.database,
        email: email,
        username: username,
        password: password,
        user_metadata: {
          /* any user metadata */
        },
      });

      // Register user in local MongoDB
      const newUser = await UserModel.create({
        email: email,
        username: auth0User.username,
        auth0Id: auth0User.user_id,
      });

      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  public static async getUserByAuth0Id(
    auth0Id: string,
  ): Promise<Document & IUser> {
    try {
      const user = await UserModel.findOne({ auth0Id: auth0Id });
      if (!user) {
        throw new Error(`User with Auth0 ID ${auth0Id} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error fetching user by Auth0 ID:', error);
      throw error;
    }
  }
}
