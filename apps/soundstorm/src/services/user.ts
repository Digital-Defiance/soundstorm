import { Document } from 'mongoose';
import validator from 'validator';
import { IUser } from '../interfaces/user';
import { User } from '../models/user';
import { InvalidEmail } from '../errors/invalidEmail';
import { InvalidPassword } from '../errors/invalidPassword';
import { managementClient } from '../auth0';
import { environment } from '../environment';
import { EmailExistsError } from '../errors/emailExists';

export class UserService {
  public static async register(
    email: string,
    password: string
  ): Promise<Document<unknown, object, IUser>> {
    // Email validation using validator.js
    if (!validator.isEmail(email)) {
      throw new InvalidEmail(email);
    }

    if (await User.findOne({ email: email })) {
        throw new EmailExistsError(email);
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
        'Password must be at least 8 characters long and contain both letters and numbers'
      );
    }

    try {
      // Register user in Auth0
      const auth0User = await managementClient.createUser({
        connection: environment.auth0.database,
        email: email,
        password: password,
        user_metadata: {
          /* any user metadata */
        },
      });

      // Register user in local MongoDB
      const newUser = new User({
        email: auth0User.email,
        auth0Id: auth0User.user_id,
      });
      return await newUser.save();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
