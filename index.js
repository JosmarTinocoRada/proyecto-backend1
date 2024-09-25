const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 8080;


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!'); 
});



app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const { router: productsRouter, initSocket: initProductSocket } = require('./routes/products'); 
const cartsRouter = require('./routes/carts'); 
const { router: viewsRouter, initSocket: initViewSocket } = require('./routes/viewsrouter'); 


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const server = createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('newProduct', (product) => {
        io.emit('productAdded', product);
    });

    socket.on('deleteProduct', (productId) => {
        io.emit('productDeleted', productId);
    });
});


initProductSocket(io); 
initViewSocket(io); 


server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
