import * as process from 'process';

export const getConfiguration = () => ({
  BlABLA: process.env.BLABLA,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
});
