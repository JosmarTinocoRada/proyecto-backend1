const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

let products = [
    { id: 1, name: 'Producto 1', price: 100, stock: 10 },
    { id: 2, name: 'Producto 2', price: 200, stock: 20 }
];

app.use('/api/products', require('./routes/products'));
app.use('/api/carts', require('./routes/carts'));

app.get('/', (req, res) => {
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});


app.post('/api/products', (req, res) => {
    const { name, price, stock } = req.body;

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        name,
        price,
        stock
    };

    products.push(newProduct);

    
    io.emit('productAdded', newProduct);

    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    products = products.filter(p => p.id !== productId);

    
    io.emit('productDeleted', productId);

    res.status(204).send();
});


io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.emit('updateProducts', products);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    
    socket.on('addProduct', (data) => {
        const { name, price, stock } = data;
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            name,
            price,
            stock
        };

        products.push(newProduct);

        
        io.emit('productAdded', newProduct);
    });

    
    socket.on('deleteProduct', (data) => {
        const productId = parseInt(data.id);
        products = products.filter(p => p.id !== productId);

        
        io.emit('productDeleted', productId);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});