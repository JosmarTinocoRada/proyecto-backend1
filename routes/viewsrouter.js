const express = require('express');
const router = express.Router();

// Asegúrate de que esta ruta sea correcta y que el archivo 'products.js' exporte un objeto con la propiedad 'products'.
let products = require('./products').products;

let io; // Variable para la instancia de Socket.IO

// Inicializa Socket.IO
const initSocket = (socketIO) => {
    io = socketIO;
};

// Ruta para la vista principal
router.get('/', (req, res) => {
    res.render('home', { products, title: 'Home' });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products, title: 'Productos en Tiempo Real' });
});

// Emitir eventos cuando se agrega o elimina un producto
const emitProductEvents = (event, product) => {
    if (io) {
        io.emit(event, product);
    }
};

// Exportar el router y la función initSocket
module.exports = { router, initSocket };
