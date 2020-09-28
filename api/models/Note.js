// Conexion a mongoose
const mongoose = require('mongoose');

// Definición del Schema
const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Exportar el Schema
const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
