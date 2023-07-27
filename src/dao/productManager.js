import productsModel from '../dao/models/product.models.js';

class ProductManager {
    productsModel; 
    constructor() {
        this.productsModel = productsModel        
    }

    //retorna los prod
    async getProducts() {
        try { 
            const data = await this.productsModel.find();                
            return data
        } catch (error) {
            console.log(error.message)                
        }        
    }    
    
    //agrega los prod a products y muestra por consola el code existente
    async addProduct(bodyProduct){        
        try {
            const newProduct = await this.productsModel.create(bodyProduct)
            return newProduct; 
        } catch (error) {
            console.log('error al crear un nuevo producto '+ error)
        }                 
        
    }

    //modificar un producto
    async updateProduct(id, updateBodyProduct) {
        try {
            const updateProduct = await this.productsModel.updateOne({_id:id},updateBodyProduct)
            return updateProduct
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
        
    }

    //busca un prod por su id
    async getProductById(id) {
        try {
            const data = await this.productsModel.findOne({_id:id});            
            if(!data){
                return `No se ha encontrado Productos con este id:(${id}), verifique que los datos ingresados sean los correctos y vuelve a intentarlo`;
            }
            return data;
        } catch (error) {
            throw new Error('Se produjo un error al leer los datos desde el Json')
        }
    }

    //elimina un producto
    async deleteProduct(id) {                
        try {
            const productDelete = await this.productsModel.deleteOne({_id:id});
            return productDelete;
                        
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error}`);
        }
    }

}

export default ProductManager