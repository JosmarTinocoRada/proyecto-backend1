const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine()); // Usa el método .engine() para configurarlo
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que la carpeta 'views' esté en la raíz del proyecto

// Middleware para JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// Importar las rutas
const { router, initSocket } = require('./routes/viewsrouter'); 
app.use('/', router); 

app.use('/api/products', require('./routes/products')); // Ajustar según la ubicación real de products.js
app.use('/api/carts', require('./routes/carts')); // Ajustar según la ubicación real de carts.js

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

// Inicializar el socket en el router de vistas
initSocket(io); // Pasar la instancia de Socket.IO a la función de inicialización

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
