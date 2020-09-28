// Setup estandar de la app
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const port = process.env.PORT      || 3000;
const db = process.env.MONGODB_URI || 'mongodb://localhost/notas';

const app = express();

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log(`DB connected @ ${db}`);
    })
    .catch(err => console.error(`Connection error ${err}`))
;

// Middlewares
app.use(express.json()); // Parsear a [.JSON]
app.use(cors()); // Permitir recursos de distintas fuentes (evitar SOP)
app.use(morgan('dev')); // Debug
app.use('/api', require('./api/routes/note')); // Redireccionar a note.js

// Si usan la ruta a cualquier lado, este middleware crea el error 404
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
}); 

// Devolver el error y cerrar la petición
app.use((err, req, res, next) => {
    // Si vienen de otro lado y se saltean el error, mandar 500
    res.status(err.status || 500); 
    // console.error(err.stack);
    res.json({ error: err.message });
});

// Listen
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
