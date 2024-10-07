import {Router} from 'express';
const router = Router();
import * as helper from '../helpers.js';

router
  .route('/')
  .get(async (req, res) => {
}).post(async (req, res) => {
  const { username, password } = req.body;
  console.log('Username:', username);
  console.log('Password:', password);
  return res.status(200).json({ message: 'Success' });
})

router
  .route('/:id')
    .get(async (req, res) => {
    })
    .put(async (req, res) => {
    })
    .patch(async (req, res) => {
    })

export default router;