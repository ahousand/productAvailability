
var async = require('async');
var Product = require('./models/products');
var Shipment = require ('./models/shipments');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://all_users:sunflower@ds121222.mlab.com:21222/a_rose_by_any_other_name';
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


var products = [];
var shipments = [];

function createShipment(id, arrival_date, count, product_id, spoil_date, cb){
  shipmentDetail = {
    id: id,
    date_arriving: arrival_date,
    count: count,
    product_id: product_id,
    date_spoiling: spoil_date
  }

  var shipment = new Shipment(shipmentDetail);
  shipment.save(function(err){
    if (err){
      cb(err, null)
      return
    }
    console.log('New Shipment: ' + shipment);
    shipments.push(shipment)
    //cb(null, author)
  });
}

function createProduct(id, name, description, cb){
  productDetail = {
    id: id,
    name: name,
    description: description
  }

  var product = new Product(productDetail);
  product.save(function(err){
    if(err){
      cb(err, null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product);
    //cb(null, product)
  });
}

function generateProducts(cb){
  async.parallel([
    function(callback){
      createProduct(21, 'the-jackie', "Grower's choice bouqet");
    },
    function(callback){
      createProduct(22, 'red-rose', 'A dozen red roses')
    },
    function(callback){
      createProduct(23, 'cactus', 'Get in touch with your desert side!')
    }
  ],
cb);
}

function generateShipments(cb){
  async.parallel([
    function(callback){
      createShipment(1, new Date("2017-08-20"), 25, 21, new Date("2017-08-27"))
    },
    function(callback){
      createShipment(2, new Date("2017-08-25"), 29, 21, new Date("2017-08-30"))
    },
    function(callback){
      createShipment(3, new Date("2017-08-20"), 15, 22, new Date("2017-08-23"))
    },
    function(callback){
      createShipment(4, new Date("2017-08-27"), 5, 22, new Date("2017-08-30"))
    },
    function(callback){
      createShipment(5, new Date("2017-08-30"), 154, 23, new Date("2018-08-01"))
    }
  ],
cb);
}

async.series([
  
  generateShipments
],
function (err, results){
  if (err){
    console.log('Error: ' + err);
  }
else{
  console.log('Success');
}
mongoose.connection.close();
});
