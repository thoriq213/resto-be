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
    } finally {
        await knex.destroy();
    }
}

module.exports = {
    addCategory
}