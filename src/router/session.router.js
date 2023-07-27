import UserManager from "../dao/userManagerMongo.js";
import { Router } from "express";
import { createHash } from "../utils.js";
import passport from "passport";

const router = Router();

const userManager = new UserManager;

//ruta post para el registerUser
router.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failRegister'}), async (req, res) => {
    return res.status(200).send({status: 'success', message:'Usuario registrado'})
    
})

router.get('/failRegister', async (req, res) => {
    console.log('Fallo en la Estrategia');
    res.send({error:'Fallo'})
})
//ruta login
router.post('/login', passport.authenticate('login', {failureRedirect:'/api/sessions/failLogin'}) , async (req, res) => {
    
    if(!req.user){
        return res.status(400).send({status:'Error', error:'Credenciales Invalidas'})
    }
    
    req.session.user = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        age: req.user.age,
        //rol: req.user.admin            
    }
    
    return res.status(200).send({status:'usuario autenticado', payload: req.user})
    
})

router.get('/failLogin', (req, res) => {    
    res.send({error:'Fallo al Logearse'})
})
//ruta logout elimina la session
router.post('/logout', (req, res) => {
    try {
        req.session.destroy(error =>{
            if(!error) res.status(200).send('Session eliminada');
            else res.status(400).send({status: 'Error al eliminar la session', body: error})
        })
    } catch (error) {
        return res.status(500).json('Se produjo un error al que obtener los datos para eliminar la session', error.message)
    }
    
})
//ruta resetPassword
router.put('/resetPassword', async (req, res) => {
    try {
        const {email, newpassword} = req.body;
        if(!email || !newpassword){
            return res.status(400).send('Email y/o Contraseña no ingresados, son requeridos')
        }
        const user = await userManager.getUser(email); 
        if (!user){
            return res.status(404).send("Usuario incorrectos y/o inexistente")
        };
        //actualizar contraseña en base de datos
        const updatePassword = createHash(newpassword);
        //modificar el manager
        await userManager.updateUser(user._id, {password: updatePassword});

        res.status(200).send('contraseña restaurada exitosamente')
        
    } catch (error) {
        return res.status(500).send('Se produjo un error al que obtener los datos para restaurar la contraseña', error.message)
    }
    
})


export default router