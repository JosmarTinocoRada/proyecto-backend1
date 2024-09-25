const express = require('express');
const router = express.Router();

let products = [
    { id: 1, name: 'Papas', description: 'Papa', code: '001', price: 100, status: true, stock: 10, category: 'Hortalizas', thumbnails: [] },
    { id: 2, name: 'Cerveza', description: 'sadas', code: '002', price: 800, status: true, stock: 20, category: 'Bebidas', thumbnails: [] },
    { id: 3, name: 'Hamburguesa', description: 'Descripción 3', code: '003', price: 300, status: true, stock: 30, category: 'Comidas', thumbnails: [] },
];

const generateId = () => {
    return products.length > 0 ? products[products.length - 1].id + 1 : 1;
};

let io; // Variable para la instancia de Socket.IO

const initSocket = (socketIO) => {
    io = socketIO;
};

// Obtener todos los productos
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    if (limit && limit > 0) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Crear un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const newProduct = {
        id: generateId(),
        name: title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);

    if (io) {
        io.emit('newProduct', newProduct);
    }

    res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const { id, ...updateData } = req.body;

        products[productIndex] = { ...products[productIndex], ...updateData };

        res.json(products[productIndex]);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        products.splice(productIndex, 1);

        if (io) {
            io.emit('deleteProduct', productId);
        }

        res.status(204).send(); // Sin contenido
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Exportar solo el router y la función initSocket
module.exports = { router, initSocket };
