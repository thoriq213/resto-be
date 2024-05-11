const knex = require('../database/sql')
const productModel = require('./productModel')

const addTransaction = async (body) => {
    const productList = body.product_list;
    const product_id_list = productList.map(item => item.product_id);

    const bodyGetProduct = {
        product_list : product_id_list
    }

    const getTotalTransToday = await totalTransaction();
    const getProduct = await productModel.getProductMulti(bodyGetProduct);

    let listProduct = [];

    let response = {};
    
    let numberInvoice = 0;
    let totalPrice = 0;

    if(getTotalTransToday){
        numberInvoice = parseInt(getTotalTransToday.total) + 1;
    } else {
        numberInvoice = 1;
    }

    if(getProduct.body.data == null){
        const response = {
            code : 404,
            body : {
                status : false,
                msg : 'Data not found',
                data : null
            }
        }

        return response;
    } else {
        listProduct = getProduct.body.data;
        const getPrice = listProduct.map(product => {
            const getQty = productList.find(list => list.product_id == product.id);
            return product.price * getQty.qty
        })
        totalPrice = getPrice.reduce((total, price) => total + price, 0);
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');


    const transactionInsert = {
        invoice_no : `INV${year}${month}${day}${numberInvoice}`,
        table_no : body.table_no,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        total_price: totalPrice,
        user_inp: 'USER',
        created_at: new Date()
    }

    try {
        const insertData = await knex.transaction(async (trx) => {
            const transaction = await trx.insert(transactionInsert).into('transactions');
        
            const promises = listProduct.map(async element => {
                const getQty = productList.find(list => list.product_id == element.id);
                const insertDetailTrans = {
                    transaction_id: transaction[0],
                    product_id: element.id,
                    status: 1,
                    qty: getQty.qty,
                    user_inp: 'USER'
                };
        
                return trx.insert(insertDetailTrans).into('transactions_detail');
            });
        
            await Promise.all(promises); // Tunggu semua operasi async selesai
            return transaction;
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

const addProduct = async (body) => {
    const getProduct = productModel.getProductMulti(body);

    if(getProduct.body.data == null){
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

}

const getTransaction = async (body) => {
    const id = body.transaction_id;
    let response = {};

    const getTransaction = await knex('transactions').select('*').where('id', id).whereNull('deleted_at').first();
    const getTransactionDetail = await knex('transactions_detail as a')
    .select('b.name', 'a.qty', 'b.price', knex.raw('b.price * a.qty as total_price'))
    .join('products as b', 'b.id', 'a.product_id')
    .where('a.transaction_id', id);

    if(getTransaction && getTransactionDetail){
        getTransaction.detail = getTransactionDetail;
        response = {
            code : 200,
            body : {
                status : true,
                msg : null,
                data : getTransaction
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
}

const totalTransaction = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const query = await knex('transactions').sum('id as total').whereRaw('DATE(created_at) = ?', today).first();
    return query;
} 

module.exports = {
    addTransaction,
    getTransaction
}