import { Request, Response } from 'express';
import express from 'express';
const app = express();

const authController = {
  async getHome(req: Request, res: Response) {
    res.send('This is home');
  },

  async getUser(req: Request, res: Response) {
    const { user } = req.params;

    res.send(user);
  }
};

export default authController;
