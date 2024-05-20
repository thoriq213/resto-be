const knex = require('../database/sql')

const listProduct = async () => {
    try {

        const query = await knex('products').select('*').whereNull('deleted_at');

        if(query.length > 0){
            const data = query.map(value => {
                if(value.image){
                    return value.image = `${process.env.BASE_URL}image/${value.image}`;
                } else {
                    return;
                }
            })
            response = {
                code : 200,
                body : {
                    status : true,
                    msg : null,
                    data : query
                }
            }
        } else {
            response = {
                code : 404,
                body : {
                    status : false,
                    msg : 'data not found',
                    data : null
                }
            }
        }

        return response;
        
    } catch (error) {
        console.log(error);
        response = {
            code : 500,
            body : {
                status : false,
                msg : 'there is something wrong!',
                data : null
            }
        }
        return response;
    }
}

const addProduct = async (body) => {
    const dataInsert = {
        name: body.product_name,
        category_id: body.category_id,
        user_inp: body.user_inp,
        image: body.image,
        price: body.price,
        created_at : new Date()
    }

    try {
        const insertData = await knex.transaction(async (trx) => {
            const result = await trx.insert(dataInsert).into('products');
            return result;
          });
        
          const response = {
            code: 200,
            body: {
              status: true,
              msg: 'Data berhasil disimpan',
              data: null
            }
          };

          return response;
        
    } catch (error) {
        console.log(error);
        const response = {
            code : 500,
            body : {
                status : false,
                msg : 'there is something wrong!',
                data : null
            }
        }
        return response;
    }
}

const getProduct = async (body) => {
    try {
        const productId = body.product_id;
        const query = await knex('products').select('*').where('id', productId).whereNull('deleted_at').first();
        query.image = query.image ? `${process.env.BASE_URL}image/${query.image}` : query.image;
        let response = {};

        if(query){
            response = {
                code : 200,
                body : {
                    status : true,
                    msg : null,
                    data : query
                }
            }
        } else {
            response = {
                code : 404,
                body : {
                    status : false,
                    msg : 'data not found',
                    data : null
                }
            }
        }
        return response;
        
    } catch (error) {
        console.log(error);
        const response = {
            code : 500,
            body : {
                status : false,
                msg : 'there is something wrong!',
                data : null
            }
        }
        return response;
    }
}

const getProductMulti = async (body) => {
    try {
        const productId = body.product_list;
        const query = await knex('products').select('*').whereIn('id', productId).whereNull('deleted_at');
        let response = {};

        if(query){
            response = {
                code : 200,
                body : {
                    status : true,
                    msg : null,
                    data : query
                }
            }
        } else {
            response = {
                code : 404,
                body : {
                    status : false,
                    msg : 'data not found',
                    data : null
                }
            }
        }
        return response;
        
    } catch (error) {
        console.log(error);
        const response = {
            code : 500,
            body : {
                status : false,
                msg : 'there is something wrong!',
                data : null
            }
        }
        return response;
    }
}

const updateProduct = async (body) => {
    const cekProduct = await getProduct(body);

    if(cekProduct.body.data == null){
        const response = {
            code : 404,
            body : {
                status : false,
                msg : 'Data not found',
                data : null
            }
        }

        return response;
    }

    const dataUpdate = {
        name : body.product_name,
        category_id : body.category_id,
        image: body.image,
        price: body.price,
        user_update : body.user_inp,
        updated_at : new Date()

    }

    try {
        const insertData = await knex.transaction(async (trx) => {
            const result = await trx('products').where('id', body.product_id).update(dataUpdate);
            return result;
          });
        
          const response = {
            code: 200,
            body: {
              status: true,
              msg: 'Data berhasil diubah',
              data: null
            }
          };

          return response;
        
    } catch (error) {
        console.log(error);
        const response = {
            code : 500,
            body : {
                status : false,
                msg : 'there is something wrong!',
                data : null
            }
        }
        return response;
    }
}

const deleteProduct = async (body) => {
    const cekProduct = await getProduct(body);
    let response = {};

    if(cekProduct.body.data == null){
        response = {
            code : 404,
            body : {
                status : false,
                msg : 'Data not found',
                data : null
            }
        }
        return response;
    }

    const dataDelete = {
        user_update : body.user_inp,
        deleted_at : new Date()
    }

    try {
        const deleteData = await knex.transaction(async (trx) => {
            const result = await trx('products').where('id', body.product_id).update(dataDelete);
            return result;
          });
        
          response = {
            code: 200,
            body: {
              status: true,
              msg: 'Data berhasil dihapus',
              data: null
            }
          };

          return response;
        
    } catch (error) {
        console.log(error);
        const response = {
            code : 500,
            body : {
                status : false,
                msg : 'there is something wrong!',
                data : null
            }
        }
        return response;
    }
}

module.exports = {
    listProduct,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductMulti
}