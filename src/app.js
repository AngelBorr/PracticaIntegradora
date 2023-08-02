import express from 'express';
import productsRouter from './router/product.router.js';
import cartsRouter from './router/cart.router.js';
import __dirname from './utils.js'
import mongoose from 'mongoose';
import displayRoutes from "express-routemap";
import sessionsRouter from './router/session.router.js'
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import handlerbars from 'express-handlebars';
import viewsRouter from './router/views.router.js'
import env from './config.js';


const app = express();

//data MONGODB
const PORT = env.port; 
const USER_MONGO = env.userMongo;
const PASS_MONGO = env.passMongo;
const DB_NAME = env.dbColecction;

const rutaMongo = `mongodb+srv://${USER_MONGO}:${PASS_MONGO}@cluster0.wd5qrnn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

//configuracion plantillas y handlebars
app.engine('handlebars', handlerbars.engine()); 
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//configuracion Session 
app.use(session({
    store: new MongoStore({
        mongoUrl: rutaMongo,
        ttl: 3600
    }),
    secret: "sessionSecret",
    resave: false,
    saveUninitialized: false 
}))
//configuracion passport
initializePassport();
app.use(passport.initialize());

//configuracion express
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

//server en puerto 8080
const httpServer = app.listen(`${PORT}`, () => {
    displayRoutes(app);
    console.log('servidor escuchando en el puerto 8080')
})

//conection a mongoose server
mongoose.connect(rutaMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('conectado a mongo')).catch((err) => {console.error(err)});

