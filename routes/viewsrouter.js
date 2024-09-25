const express = require('express');
const router = express.Router();


let products = require('./products').products;

let io; 


const initSocket = (socketIO) => {
    io = socketIO;
};

router.get('/', (req, res) => {
    res.render('home', { products, title: 'Home' });
});


router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products, title: 'Productos en Tiempo Real' });
});


const emitProductEvents = (event, product) => {
    if (io) {
        io.emit(event, product);
    }
};

// Exportar el router y la función initSocket
module.exports = { router, initSocket };
