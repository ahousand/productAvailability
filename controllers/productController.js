var Product = require('../models/products');
var Shipment = require('../models/shipments');
var Available = require('../models/availability');
var async = require('async');


//Home screen
exports.index = function(req, res){
  async.parallel({
    product_count: function(callback){
      Product.count(callback);
    },
  },function (err, results){
      res.render('index', {title: 'Welcome to UrbanStems!', error: err, data: results});
  });
};

//method to render the list of three products
exports.products_list = function(req,res,next){
  Product.find({})
  .select('name description -_id')
  .exec(function(err, list_products){
    if (err) {return next(err);}
    console.log(list_products)
    res.render('products_list', {title: 'Products', products_list: list_products});
  })
};

//render the form to search products by date
exports.product_search_form = function(req,res,next){
  res.render('product_form_date', {title: 'Search Products'});
}
//render form to search products by date and product name
exports.product_search_formWithName = function(req,res,next){
  res.render('product_form_dateAndName', {title: 'Search Products'});
}

//get shipments by arrival date
exports.products_by_date = function(req, res, next) {
    Shipment.find({'date_arriving': {$gte: new Date(req.body.date)}})
    .select('product_id date_arriving count date_spoiling')
    .exec(function(err, found_shipments){
      if(err){return next(err);}
      allProducts(found_shipments,res);
  });
};

//determine which product ID's correspond to which arrival dates
var allProducts = function (shipments,res){
  var ids = [];
  var counts = [];
  var arriving_dates = [];
  var spoiling_dates = [];
  var dictionary = [];
  var products = [Product];
  for (var i in shipments){
    shipment = shipments[i];
    var id = shipment.product_id;
    ids.push(parseInt(id));
    arriving_dates.push(new Date(shipment.date_arriving).toUTCString());
    counts.push(shipment.count);
    spoiling_dates.push(new Date(shipment.date_spoiling).toUTCString());
  }
  dictionary.push(ids,arriving_dates,counts, spoiling_dates);
  Product.find({id: {$in: ids}})
  .select('name description id')
  .exec(function(err, matching_products){
    if(err){return next(err);}
    availabilityByDate(matching_products, dictionary,res);
  });
};

//build product availability information and render the results
var availabilityByDate = function(products, shipments,res){
  var available_products = [];
  for (var i in products){
    var available_dates = [];
    var shipmentTotal = 0;
    var spoiling_dates = [];
    var allDates = [];

    var ids = shipments[0];
    var shipmentDates = shipments[1];
    var counts = shipments[2];
    var spoilDates = shipments[3];
    for (var k in ids){
      if (ids[k] == products[i].id){
        available_dates.push(shipmentDates[k]);
        shipmentTotal += counts[k];
        spoiling_dates.push(spoilDates[k]);
      }
    }

    console.log(available_dates);
    var product = new Available({
      id: products[i].id,
      name: products[i].name,
      available_dates: available_dates,
      count: shipmentTotal,
      bad_dates: spoiling_dates
    });
    available_products.push(product);
  }
  res.render('available_productsList', {title: 'Available Products', products_list: available_products});
}

//find product by name; check to make sure user hasn't entered a product that doesn't exist
exports.product_by_dateAndName = function(req, res, next){
  var productName = req.body.name.toLowerCase().trim();
  console.log(productName);
  if (productName != 'the-jackie' && productName != 'red-rose' && productName != 'cactus'){
     res.render('error', {message: "Name must be 'the-jackie,' or 'red-rose,' or 'cactus.'", });
     return;
  }
  var date = req.body.date;
  Product.find({'name': productName, })
  .select('id name description -_id')
  .exec(function(err, found_product){
    if(err){return next(err);}
    shipmentInfo(found_product, date, res);
  });
}

//get corresponding shipment info based on product name entered in; filter by date and where product id matches
var shipmentInfo = function(product, date, res){
  Shipment.find({'date_arriving': {$gte: new Date(date)}})
  .where('product_id').equals(product[0].id)
  .select('date_arriving count id product_id date_spoiling')
  .exec(function(err, shipments){
    if(err){return next(err);}
    console.log('shipments ' + shipments);
    availabilityByDateAndName(shipments, product,res);
  });
}

//build list of available dates for requested product
var availabilityByDateAndName = function(shipments, product, res){
  product = product[0];
  var available_products =  [];
  var available_product = new Available();
  var dates = [];
  var spoilingDates = [];
  var count = 0;
  if (shipments.length > 0){
    for(var i in shipments){
        count += shipments[i].count;
        dates.push(new Date(shipments[i].date_arriving).toUTCString());
        spoilingDates.push(new Date(shipments[i].date_spoiling).toUTCString());
    }
    if (count > 0){
      available_product.id = product.id;
      available_product.name = product.name;
      available_product.available_dates = dates;
      available_product.count = count;
      available_product.bad_dates = spoilingDates
    }
    available_products.push(available_product);
  }
  res.render('available_productsList', {title: 'Available Products', products_list: available_products});
}
