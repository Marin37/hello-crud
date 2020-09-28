const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

// GET /notes
router.get('/notes', (req, res, next) => {
    Note.find()                     // Buscar en todas las notas
        .select('_id title text')   // Selecciona los campos a mostrar
        .sort('-updatedAt')         // Ordena por modificación de mayor a menor
        .exec((err, notes) => {
            // Si hay error
            if (err) return next(err);
            // Notas
            notes = notes.map(note => ({
                id: note._id,
                title: note.title,
                text: note.text,
                details: {
                    method: 'GET',
                    url: `${req.protocol}://${req.hostname}:3000/api/notes/${note._id}`
                }
            }));
            res.status(200).json({
                count: notes.length,
                notes: notes,
                tocreateuse: {
                    method: 'POST',
                    url: `${req.protocol}://${req.hostname}:3000/api/notes`
                }
            });
        });
});

// GET /notes/:id
router.get('/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .select('_id title text createdAt updatedAt')
        .exec((err, note) => {
            // Si hay error
            if (err) return next(err); 
            // Si no se encuentra
            if (!note) return res.status(404).json({ msg: 'Not Found'});
            // Nota encontrada
            res.status(200).json ({
                note: note,
                links: {
                    update: {
                        method: 'PUT',
                        url: `${req.protocol}://${req.hostname}:3000/api/notes/${note._id}`
                    },
                    delete: {
                        method: 'DELETE',
                        url: `${req.protocol}://${req.hostname}:3000/api/notes/${note._id}`
                    }
                }
            });
        });
});

// POST /notes
router.post('/notes', (req, res, next) => {
    const note = new Note({
        title: req.body.title,
        text: req.body.text
    });
    note.save((err, note) => {
        // Si hay error
        if (err) return next(err);
        // Nota creada
        res.status(201).json(note);
    });
});

// PUT /notes/:id
router.put('/notes/:id', (req, res, next) => {
    const note = {
        title: req.body.title,
        text: req.body.text,
        updatedAt: Date.now()
    };
    const options = {
        new: true,
        omitUndefined: true,
    };
    Note.findByIdAndUpdate(req.params.id, note, options)
        .exec((err, note) => {
            // Si hay error
            if (err) return next(err);
            // Si no se encuentra
            if (!note) return res.status(404).json({ msg: 'Not Found' });
            // Nota actualizada
            res.status(200).json(note);
        });
});

// DELETE /notes/:id
router.delete('/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .exec((err, note) => {
            // Si hay error
            if (err) return next(err);
            // Si no se encuentra
            if (!note) return res.status(404).json({ msg: 'Not Found' });
            // Nota Borrada
            res.status(200).json({ msg: 'Delete OK' });
        });
});

module.exports = router;