import ProductManager from '../dao/productManager.js';
import CartsManager from '../dao/cartManager.js';
import { Router, json } from 'express';

const manager = new ProductManager;
const cartManager = new CartsManager

const router = Router ();

//ruta register user
/* router.get('/register', async (req, res) => {
    try {
        res.status(200).render('registerUser', {
                style:"index.css",
                styleBoostrap:"bootstrap.min.css",
                title: "RegisterUser"
            }); 
    } catch (error) {
        return res.status(500).render('Error al renderizar el resgistro de usuarios');
    }
}) */
//ruta login user
router.get('/login', async (req, res) => {
    try {
        res.status(200).render('login'/* , {
                style:"index.css",
                styleBoostrap:"bootstrap.min.css",
                title: "login",
                
            } */); 
    } catch (error) {
        return res.status(500).render('Error al renderizar el login');
    }
})



export default router