const knex = require('../database/sql')

const addCategory = async (body) => {
    const dataInsert = {
        name : body.category_name,
        user_inp : body.user_inp,
        created_at : new Date()
    }

    let response = {};

    try {
        const insertData = await knex.transaction(async (trx) => {
            const result = await trx.insert(dataInsert).into('categories');
            return result;
          });
        
          response = {
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

const editCategory = async (body) => {

    const cekCategory = await getCategory(body);
    
    if(cekCategory.body.data == null){
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
        name : body.category_name,
        user_update : body.user_inp,
        updated_at : new Date()
    }

    let response = {};

    try {
        const insertData = await knex.transaction(async (trx) => {
            const result = await trx('categories').where('id', body.category_id).update(dataUpdate);
            return result;
          });
        
          response = {
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

const getCategory = async (body) => {
    try {

        const query = await knex('categories').select('*').where('id', body.category_id).whereNull('deleted_at').first();

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

const listCategory = async () => {
    try {

        const query = await knex('categories').select('*').whereNull('deleted_at');

        if(query.length > 0){
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

const deleteCategory = async (body) => {

    const cekCategory = await getCategory(body);
    
    if(cekCategory.body.data == null){
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
    
    const dataDelete = {
        user_update : body.user_inp,
        deleted_at : new Date()
    }

    let response = {};

    try {
        const deleteData = await knex.transaction(async (trx) => {
            const result = await trx('categories').where('id', body.category_id).update(dataDelete);
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

module.exports = {
    addCategory,
    editCategory,
    getCategory,
    listCategory,
    deleteCategory
}