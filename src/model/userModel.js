const knex = require('../database/sql')
const bcrypt = require('bcrypt');

const addUser = async (body) => {
    const password = await bcrypt.hash(`${body.username}#_2024`, 10);
    const dataInsert = {
        username : body.username,
        password : password,
        role_id : body.role_id,
        user_inp : body.user_inp,
        created_at : new Date()
    }

    let response = {};

    try {
        const insertData = await knex.transaction(async (trx) => {
            const result = await trx.insert(dataInsert).into('users');
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

const getRole = async (body) => {
    try {
        const query = await knex('roles')
        .select('*')
        .whereNull('deleted_at')
        .modify((queryBuilder) => {
            if(body.role_id){
                queryBuilder.where('id', body.role_id);
            }
        });

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

const getUser = async (body) => {
    try {
        const query = await knex('users')
        .select('*')
        .whereNull('deleted_at')
        .where('username', body.username)
        .first();

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

const listUser = async () => {
    try {
        const query = await knex('users')
        .select('id', 'username', 'role_id', 'user_inp', 'created_at')
        .whereNull('deleted_at');

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
};

const deleteUser = async (body) => {
    const getData = await getUser(body);
    let response = {};

    if(getData.body.data == null){
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
            const result = await trx('users').where('username', body.username).update(dataDelete);
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
    addUser,
    getRole,
    getUser,
    listUser,
    deleteUser
}