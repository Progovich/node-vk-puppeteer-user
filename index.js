const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const start = require('./src');

const login = process.env.LOGIN;
const password = process.env.PASSWORD;
const count = process.env.COUNT;
const public = process.env.GROUP;

start(login, password, count, public);
