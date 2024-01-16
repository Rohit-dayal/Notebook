const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Route 1: get all notes of the user from Get "/api/notes/fetchallnotes" . login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error")
    }

})
// Route 2: add a new note using post "/api/notes/addnote" . login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter atleat 3 character').isLength({ min: 3 }),
    body('description', 'Description must be atleat of 6 character').isLength({ min: 6 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if thier are errors then returns bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error")
    }

})

// Route 3: update an existing note put "/api/notes/updatenote" . login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create a new note object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag };

        //find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(400).send('Not Found');
        }
        // Allow only if user owns that particular note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error")
    }

})

// Route 4: delete an existing note Delete "/api/notes/deletenote" . login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(400).send('Not Found');
        }
        // Allow deletion only if user owns that particular note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        // deleting note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json('Note deleted');
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error")
    }

})

module.exports = router