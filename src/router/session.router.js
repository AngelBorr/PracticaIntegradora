import UserManager from "../dao/userManager.js";
import { Router } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";

const router = Router();
router.use(cookieParser());

const userManager = new UserManager;

//ruta post para el registerUser
router.post('/register', passport.authenticate('register'), async (req, res) => {
    return res.status(200).send({status: 'success', message:'Usuario registrado'})
    
})

router.get('/failRegister', async (req, res) => {
    console.log('Fallo en la Estrategia');
    res.send({error:'Fallo'})
})
//ruta login
router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
    
    if(!req.user){
        return res.status(400).send({status:'Error', error:'Credenciales Invalidas'})
    }
    return res.cookie('cookieToken', req.user, { httpOnly: true }).send({status:'usuario autenticado', message: 'cookie set'})
    
})

//ruta current
router.get('/current', passport.authenticate ('current', { session: false }), async (req, res) => {
    res.send(req.user);    
})

export default router