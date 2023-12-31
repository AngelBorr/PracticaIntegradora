import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { error } from 'console';
import env from './config.js';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

//configuracion JWT

export const PRIVATE_KEY = env.keyPrivate; //luego exportar desde .env

export const generateToken = (user) => {
    const token = jwt.sign({user}, `${PRIVATE_KEY}`, {expiresIn: '24h'})
    return token
}

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['cookieToken'];
        return token
    }
    return token;
};

