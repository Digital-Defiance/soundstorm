import { Router } from 'express';
import { UserService } from '../services/user';

const authRouter = Router();

authRouter.get('/login', (req, res) => {
  res.send({ message: 'Hello API' });
});

authRouter.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    await UserService.register(email, password);
    res.status(201).send({
      message: 'User registered successfully',
      email: email
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ error: 'Error registering user', detail: error.message });
  }
});

export default authRouter;
