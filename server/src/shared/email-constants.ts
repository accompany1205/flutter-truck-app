import * as nodemailer from 'nodemailer';
import { config } from '../config';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: config.get('email.address'),
    pass: config.get('email.password'),
  },
});