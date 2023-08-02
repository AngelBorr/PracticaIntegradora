import userModel from "../dao/models/user.models.js";

class UserManager{
    userModel;
    constructor(){
        this.userModel = userModel
    }
    //trae al usuario por el mail
    async getUser(email){
        try {
            const user = await this.userModel.findOne({email});            
            /* if(!user){
                throw new Error('No existe usuario con este email: ', email)
            } */
            return user;
        } catch (error) {
            throw new Error('Se produjo un error al leer el E-mail ingresado')
        }
    }

    //crea al usuario
    async addUser(bodyUser){
        try {
            const newUser = await this.userModel.create(bodyUser);
            return newUser            
        } catch (error) {
            console.log('se produjo un error al crear un usuario nuevo', error.message)
        }
    }

    //modificar user password
    async updateUser(id, bodyUpdate){
        try {
            const updatePass = await this.userModel.updateOne({_id:id}, bodyUpdate)            
            return updatePass
        } catch (error) {
            throw new Error(`Error al actualizar la contraseña: ${error.message}`);
        }
    }
}

export default UserManager