const moment = require('moment');;
const knex = require('../database/sql');
const productModel = require('./productModel');

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

    if(getTotalTransToday.total > 0){
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
        user_inp: body.user_inp,
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
                    user_inp: body.user_inp
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

const editProduct = async (body) => {
    const productList = body.product_list;
    const product_id_list = productList.map(item => item.product_id);

    const bodyGetProduct = {
        product_list : product_id_list
    }

    const getProduct = await productModel.getProductMulti(bodyGetProduct);
    let response = {};

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

    const getTransaction = await getTransactionByInvoice(body);

    if(getTransaction.body.data == null){
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

    if (getTransaction.body.data.status == 3 || getTransaction.body.data.status == 2){
        response = {
            code : 400,
            body : {
                status : false,
                msg : 'Status Transaksi sudah selesai dimasak atau dibayarkan',
                data : null
            }
        }

        return response;
    }

    let listProduct = [];
    let totalPrice = 0;

    if(getProduct.body.data == null){
        response = {
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

    const transactionDetail = getTransaction.body.data;
    const detailTransaction = transactionDetail.detail;

    const transactionUpdate = {
        total_price: totalPrice,
        user_update: body.user_update,
        updated_at: new Date()
    }

    try {
        const insertData = await knex.transaction(async (trx) => {
            console.log(body.user_update);
            const transaction = await trx('transactions').where('id', transactionDetail.id).update(transactionUpdate);
        
            const promises = listProduct.map(async element => {
                const getQty = productList.find(list => list.product_id == element.id);
                const getTransactionDetail = detailTransaction.find(list => list.product_id == element.id);
                const detailTrans = {
                    transaction_id: transactionDetail.id,
                    product_id: element.id,
                    status: 1,
                    qty: getQty.qty,
                    user_inp: body.user_update
                };

                if(getTransactionDetail){
                    return await trx('transactions_detail').where('transaction_id', transactionDetail.id).where('product_id', element.id).update(detailTrans)
                } else {
                    return await trx.insert(detailTrans).into('transactions_detail');
                }
            });

            const promisesCekDifferentProduct = detailTransaction.map(async element => {
                const cekDifferent = productList.find(list => list.product_id == element.product_id);

                if(!cekDifferent) {
                    const deleteProduct = {
                        status : 4
                    }
                    return trx('transactions_detail').where('transaction_id', transactionDetail.id).where('product_id', element.product_id).update(deleteProduct);
                } else {
                    return;
                }
            })
        
            await Promise.all([promises, promisesCekDifferentProduct]); // Tunggu semua operasi async selesai
            return transaction;
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

const getTransaction = async (body) => {
    const id = body.transaction_id;
    let response = {};

    const getTransaction = await knex('transactions').select('*').where('id', id).whereNull('deleted_at').first();
    const getTransactionDetail = await knex('transactions_detail as a')
    .select('b.name', 'a.qty', 'b.price', 'a.transaction_id', knex.raw('b.price * a.qty as total_price'), 'a.product_id')
    .join('products as b', 'b.id', 'a.product_id')
    .where('a.transaction_id', id)
    .whereNot('status', 4);

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

const getTransactionByInvoice = async (body) => {
    const invoiceNo = body.invoice_no;
    let response = {};

    const getTransaction = await knex('transactions').select('*').where('invoice_no', invoiceNo).whereNull('deleted_at').first();
    if(getTransaction == null){
        response = {
            code : 404,
            body : {
                status : false,
                msg : 'data not found',
                data : null
            }
        }
        return response;
    }

    const getTransactionDetail = await knex('transactions_detail as a')
    .select('b.name', 'a.qty', 'b.price', knex.raw('b.price * a.qty as total_price'), 'a.transaction_id', 'a.product_id')
    .join('products as b', 'b.id', 'a.product_id')
    .where('a.transaction_id', getTransaction.id)
    .whereNot('status', 4);

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

const voidTransaction = async (body) => {
    const invoiceNo = body.invoice_no;
    const getTrans = await getTransactionByInvoice(body);
    let response = {};

    if(getTrans.body.data == null){
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

    if(getTrans.body.data.status == 3){
        response = {
            code : 400,
            body : {
                status : false,
                msg : 'Transaksi sudah diakhiri',
                data : null
            }
        }
        return response;
    }

    const invoiceId = getTrans.body.data.id;

    try {
        const dataDelete = {
            user_update : body.user_inp,
            deleted_at : new Date()
        }

        const updateDetail = {
            status: 4
        }

        const deleteData = await knex.transaction(async (trx) => {
            const result = await trx('transactions').where('id', invoiceId).update(dataDelete);
            const resultTransaction = await trx('transactions_detail').where('transaction_id', invoiceId).update(updateDetail);
            return true;
          });

        response = {
          code: 200,
          body: {
            status: true,
            msg: 'Transaksi Berhasil di void',
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

const listTransaction = async (body) => {
    let response = {};
    try {
        const getTransaction = await knex('transactions')
        .select('*')
        .whereNull('deleted_at')
        .modify(queryBuilder => {
            if (body.from_date && body.to_date) {
              const fromDate = moment(body.from_date).format('YYYY-MM-DD');
              const toDate = moment(body.to_date).format('YYYY-MM-DD');
              queryBuilder.whereRaw('DATE(created_at) between ? and ?', [fromDate, toDate]);
            }
        });

        const addDetail = await Promise.all(
            getTransaction.map(async value => {
                const getTransactionDetail = await knex('transactions_detail as a')
                .select('b.name', 'a.qty', 'b.price', 'a.transaction_id', knex.raw('b.price * a.qty as total_price'), 'a.product_id')
                .join('products as b', 'b.id', 'a.product_id')
                .where('a.transaction_id', value.id)
                .whereNot('status', 4);

                return {
                    ...value,
                    detail: getTransactionDetail
                }
            })
        );

        response = {
            code: 200,
            body: {
              status: true,
              msg: null,
              data: addDetail
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

const finishCook = async (body) => {
    const invoiceNo = body.invoice_no;
    const getTrans = await getTransactionByInvoice(body);
    let response = {};

    if(getTrans.body.data == null){
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

    if(getTrans.body.data.status == 3){
        response = {
            code : 400,
            body : {
                status : false,
                msg : 'Transaksi sudah diakhiri',
                data : null
            }
        }
        return response;
    }

    const invoiceId = getTrans.body.data.id;

    try {
        const dataUpdate = {
            status: 2,
            user_update : body.user_inp,
            updated_at : new Date()
        }

        const updateDetail = {
            status: 3
        }

        const updateData = await knex.transaction(async (trx) => {
            const result = await trx('transactions').where('id', invoiceId).update(dataUpdate);
            const resultTransaction = await trx('transactions_detail').where('transaction_id', invoiceId).update(updateDetail);
            return true;
          });

        response = {
          code: 200,
          body: {
            status: true,
            msg: 'Transaksi Berhasil diselesaikan',
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

const paid = async (body) => {
    const invoiceNo = body.invoice_no;
    const getTrans = await getTransactionByInvoice(body);
    let response = {};

    if(getTrans.body.data == null){
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

    const invoiceId = getTrans.body.data.id;

    try {
        const dataUpdate = {
            status: 3,
            user_update : body.user_inp,
            updated_at : new Date()
        }

        const updateData = await knex.transaction(async (trx) => {
            const result = await trx('transactions').where('id', invoiceId).update(dataUpdate);
            return true;
          });

        response = {
          code: 200,
          body: {
            status: true,
            msg: 'Transaksi Berhasil dibayarkan',
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
    addTransaction,
    getTransaction,
    editProduct,
    voidTransaction,
    getTransactionByInvoice,
    listTransaction,
    finishCook,
    paid
}