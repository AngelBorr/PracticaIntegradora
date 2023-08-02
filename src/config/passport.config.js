import passport from 'passport';
import local from 'passport-local';
import UserManager from '../dao/userManager.js';
import { PRIVATE_KEY, cookieExtractor, createHash, generateToken, isValidPassword } from "../utils.js";
import jwt from 'passport-jwt';

const userManager = new UserManager

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            done(error);
        }
    }))

    passport.use('register', new LocalStrategy({
        passReqToCallback:true,
        usernameField:'email'
        }, async(req, username, password, done) => {
            const { first_name, last_name, email, birth_date, role } = req.body;
            try {
                let user = await userManager.getUser(username)
                if(!user){
                    const newUser = { 
                        first_name,
                        last_name,
                        birth_date,
                        email,
                        password: createHash(password),
                        role                        
                    };            
                    user = await userManager.addUser(newUser);
                    if(user){
                        return done(null, user)
                    }else {
                        return done({message: 'Se produjo un error al crear el nuevo usuario: '+ error.message})
                    }
                }else{
                    return done(null, false, {message: 'Ya existe un usuario registrado con ese email'})
                }
            } catch (error) {
                return done({message: 'Se produjo un error al obtener los datos para crear un nuevo usuario: '+ error.message})
            }
        }
    ));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, 
        async (username, password, done) =>{
            try {
                //no incorpora el roll
                const user = await userManager.getUser( username );                
                if (!user){
                    return done(null, false, {message:"Usuario incorrectos y/o inexistente"})
                };                
                if(!isValidPassword(user, password)){
                    return done(null, false, {message: "Contraseña incorrecta, verifique los datos ingresados"})
                };
                const { password: pass, ...userNoPass } = user._doc;
                const jwt = generateToken(userNoPass);
                return done(null, jwt)
            } catch (error) {
                return done({message:'Error al Logearse'})
            }
        })
    );
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userManager.getUser({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Se produjo un error al deserializa el usuario" });
        }
    });    
}

export default initializePassport