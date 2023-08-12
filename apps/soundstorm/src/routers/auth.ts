import { Router } from 'express';
import validator from 'validator';
import { User } from '../models/user';
import { auth0 } from '../auth0';
import { environment } from '../environment';

const authRouter = Router();

authRouter.get('/login', (req, res) => {
    res.send({ message: 'Hello API' });
});

authRouter.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Email validation using validator.js
    if (!validator.isEmail(email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    // Password validation: Here, we'll use validator.js for the email,
    // and keep the previous logic for password. Adjust this logic if needed.
    if (!password || password.length < 8 || !/\d/.test(password) || !/[A-Za-z]/.test(password)) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long and contain both letters and numbers' });
    }
    
    try {
      // Register user in Auth0
      const auth0User = await auth0.createUser({
        connection: environment.auth0.database,
        email: email,
        password: password,
        user_metadata: { /* any user metadata */ }
      });
  
      // Register user in local MongoDB
      const newUser = new User({
        email: auth0User.email,
        auth0Id: auth0User.user_id,
        // other fields
      });
      await newUser.save();
  
      res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send({ message: 'Error registering user' });
    }
  });

export default authRouter;