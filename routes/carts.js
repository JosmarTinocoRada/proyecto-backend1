const express = require('express');
const router = express.Router();

let carts = [];

const generateId = () => {
    return carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
};

router.post('/', (req, res) => {
    const newCart = {
        id: generateId(),
        products: []
    };

    carts.push(newCart);
    res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});


router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = carts.find(c => c.id === cartId);

    if (cart) {
        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        res.status(200).json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

module.exports = router;
