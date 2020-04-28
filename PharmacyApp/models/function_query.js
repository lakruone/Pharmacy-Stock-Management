const pool = require('../config/database');
// const bcrypt = require('bcryptjs');


//save new product
module.exports.saveProduct =(user_id,product_name,quantity,price,image, callback) =>{
  const qry = "insert into product(user_id,product_name,quantity,price,image) values(?,?,?,?,?) ";

  pool.query(qry,[user_id,product_name,quantity,price,image], (err,result) => {
    if (err){
      return callback(err,null);
    }else {
      return callback(null,result);

    }

  });
}


//check for duplicate product names
module.exports.findProductByName =(product_name,user_id, callback) =>{
  const qry = "select * from product where product_name=? AND user_id=?";
   pool.query(qry,[product_name,user_id], (err,result) =>{
     if (err){
       return callback(err,null);
     }

     if(result[0]==null){
       return callback(null,false); //no product found
     }else{
       return callback(null,true);  //product already in the list
     }
   });
}



//get product list
module.exports.getProductList =(user_id, callback) =>{
  const qry = "select product_id,product_name from product where user_id=?";
   pool.query(qry,[user_id], (err,result) =>{
     if (err){
       return callback(err,null);
     }else {
       // console.log(fields);
       return callback(null,result);

     }

   });
}


//findProductImage
// module.exports.findProductImage =(product_id, callback) =>{
//   const qry = "select image from product where product_id=?";
//    pool.query(qry,[product_id], (err,result) =>{
//      if (err){
//        return callback(err,null);
//      }else {
//        // console.log(fields);
//        return callback(null,result);
//
//      }
//
//    });
// }



//getPriceAndName
module.exports.getPriceAndName =(product_id, callback) =>{
  const qry = "select product_name,price from product where product_id=?";
   pool.query(qry,[product_id], (err,result) =>{
     if (err){
       return callback(err,null);
     }else {
       // console.log(fields);
       return callback(null,result[0]);

     }

   });
}



//insertBill
module.exports.insertBill =(user_id, callback) =>{
  const qry = "insert into bill(user_id) values(?)";

   pool.query(qry,[user_id], (err,result) =>{
     if (err){
       return callback(err,null);
     }else {
       return callback(null,result);

     }

   });
}


// reduceStockQuantity
module.exports.reduceStockQuantity =(product_id,quantity, callback) =>{
  const qry = "update product set quantity=quantity-? where product_id=?";
  const qry1 = "select * from product where product_id=?"
   pool.query(qry,[quantity,product_id], (err,result) =>{
     if (err){
       return callback(err,null);
     }else {
       pool.query(qry1,[product_id], (err1,result1) =>{
         if (err){
           return callback(err1,null);
         }else {
           return callback(null,result1[0]);

         }
       });

     }

   });
}



//addSale
module.exports.addSale =(bill_id,sale_product,quantity,unit_price, callback) =>{
  const qry = "insert into sale(bill_id,sale_product,sale_quantity,unit_price) values(?,?,?,?)";

   pool.query(qry,[bill_id,sale_product,quantity,unit_price], (err,result) =>{
     if (err){
       return callback(err,null);
     }else {
       return callback(null,true);

     }

   });
}
