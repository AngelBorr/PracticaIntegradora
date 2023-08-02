import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    birth_date:{
        type: Date,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    cart:{
        type: Schema.Types.ObjectId, //referencias al modelo de Carrito (Carts), en este
        ref:'Cart',
        require:false        
    }, 
    role:{
        type: String,
        required: false //default user
    }
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel