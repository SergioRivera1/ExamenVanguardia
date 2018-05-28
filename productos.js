var express = require('express');
var app = express();
var mongoose= require('mongoose');
var bodyParser= require("body-parser");

var path= require("path");

app.listen(3000, function () {
  console.log('App escuchando en el puerto 3000!');
});

mongoose.connect('mongodb://admin:Admin1234@ds137650.mlab.com:37650/examen',{useMongoClient: true}, function (error) {
    if (error) console.error(error);
    else console.log('Conectado a la base de datos.');
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'public','index.html'));
});


app.use(bodyParser.urlencoded({ extended: true }));

var productosSchema = mongoose.Schema({
    _id: Number,
    descripcion: String,
    marca: String,
    numero_estante: Number,
    fecha_ingreso: {type: Date, default: Date.now}
});

var Producto = mongoose.model('producto', productosSchema);

//Get de los productos
app.get('/api/productos', function (req, res) {
    Producto.find(function (err, productos){
        if (err)
            res.status(500).send('Error en la base de datos');
        else
            res.status(200).json(productos);
    });
});

//Ingresa los productos
app.post('/api/productos', function(req, res){
    var ingresar_cancion = new Producto({
        _id: req.body.id,
        descripcion: req.body.descripcion,
        marca: req.body.marca,
        numero_estante: req.body.numero_estante,
        fecha_ingreso: req.body.Date
    });

    ingresar_cancion.save(function(error, ingresar_cancion){
        if(error){
            res.status(500).send('No se agrego el producto');
        }
        else{
            res.status(200).json('Se agrego exitosamente')
        }
    });
});

//Get por id de productos
app.get('/api/productos/:id', function(req, res){
    Producto.findById(req.params.id, function(err, producto){
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (producto != null){
                res.status(200).json(producto);
            }
            else
            res.status(404).send('El producto no existe');
        }
    });
});

//delete de los productos
app.delete('/api/productos/:id', function(req, res){

    Producto.findById(req.params.id, function(err, producto){
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (producto != null){
                producto.remove(function(error, result){
                    if(error)
                        res.status(500).send('Error en la base de datos');
                    else{
                        res.status(200).send('Producto eliminado con exito');
                    }
                });
            }
            else
                res.status(404).send('El producto que quiere eliminar no existe');
    }
});
});

//get por marca
/*app.get('/api/productos', function(req, res){
    Producto.find({marca: req.query.marca},function (err, producto) {
        if (err) {
            console.log(err);
            res.status(500).send('Error al leer de la base de datos');
        }
        else
            res.status(200).json(producto);
    });
});
*/
//GET por fecha
/*app.get('/api/productos', function(req, res){
    Producto.find({ fecha_ingreso: { $gt: req.query.fecha_ingreso, $lt: req.query.fecha_ingreso } }, function(err, producto){
        if (err) {
            console.log(err);
            res.status(500).send('Error al leer de la base de datos');
        }
        else
            res.status(200).json(producto);
    });
});*/