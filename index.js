const express = require('express');
const app = express();

const PORT = 8080;

app.use(express.json());


app.use('/api/products', require('./routes/products'));
app.use('/api/carts', require('./routes/carts'));


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
