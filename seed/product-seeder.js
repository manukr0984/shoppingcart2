var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/shopping');


var products = [
new Product({
   imagePath: 'http://www.pngall.com/wp-content/uploads/2017/03/Holi-Color-Download-PNG.png',
   title: 'Graphic Human Image',
   description: 'Awesome image',
   price: 10
}),
new Product({
    imagePath: 'http://www.pngall.com/wp-content/uploads/2017/03/Holi-Color-PNG-Image.png',
    title: 'Holi',
    description: 'Awesome Holi image',
    price: 8
 }),
 new Product({
    imagePath: 'http://www.pngall.com/wp-content/uploads/2017/03/Holi-Color-PNG-Picture.png',
    title: 'Paints',
    description: 'Awesome Paints',
    price: 15
 }),
 new Product({
    imagePath: 'http://www.pngall.com/wp-content/uploads/2017/03/Holi-Color-Transparent.png',
    title: 'Gulal',
    description: 'Gulal image',
    price: 10
 }),
 new Product({
    imagePath: 'http://www.pngall.com/wp-content/uploads/2017/03/Holi-Color-PNG.png',
    title: 'Sketch',
    description: 'Sketch image',
    price: 12
 })
];

var done = 0;

for (var i=0; i<products.length; i++){
    console.log(products.length);
    products[i].save(function(err,result){
        done++;
        if(done == products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}
