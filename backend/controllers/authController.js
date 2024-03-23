import express from 'express';
const app = express();

const authController = {
  async getHome(req, res) {
    res.send('This is home');
  },

  async getUser(req, res) {
    const {user} = req.params;

    res.send(user);
  }
};

export default authController;
