import { HttpException, HttpStatus } from '@nestjs/common';
import { ENV } from '../../src/config/appConstants.json';
export default () => {
  let envConfig = {};
  try {
    envConfig = require(`./config.${process.env.NODE_ENV || ENV.DEVELOPMENT}`).default;
    console.log("Enviroment: ", envConfig['environment'], "Server");
  } catch (e) {
    throw new HttpException(e , HttpStatus.BAD_REQUEST);
  }
  return envConfig;
};