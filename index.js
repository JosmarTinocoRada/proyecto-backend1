const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que la carpeta 'views' esté en la raíz del proyecto

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!'); 
});


// Middleware para JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importar las rutas
const { router: productsRouter, initSocket: initProductSocket } = require('./routes/products'); // Asegúrate de que la ruta sea correcta
const cartsRouter = require('./routes/carts'); // Ajustar según la ubicación real de carts.js
const { router: viewsRouter, initSocket: initViewSocket } = require('./routes/viewsrouter'); // Ajustar según la ubicación real de viewsrouter.js

// Usar los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Crear servidor HTTP y configurar Socket.IO
const server = createServer(app);
const io = new Server(server);

// Manejar eventos de WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('newProduct', (product) => {
        io.emit('productAdded', product);
    });

    socket.on('deleteProduct', (productId) => {
        io.emit('productDeleted', productId);
    });
});

// Inicializar el socket en los routers
initProductSocket(io); // Pasar la instancia de Socket.IO a la función de inicialización en products.js
initViewSocket(io); // Pasar la instancia de Socket.IO a la función de inicialización en viewsrouter.js

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
