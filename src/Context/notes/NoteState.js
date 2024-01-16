import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    // the commented code is just for the understanding of the useEffect Hook
    // const s1 = {
    //     "name": "Rohit",
    //     "age": "22"
    // }
    // const [state, setState] = useState(s1);
    // const update = ()=>{
    //     setTimeout(() => {
    //         setState({
    //             "name": "Tanya",
    //     "age": "22"
    //         })
    //     }, 1000);
    // }
    const host = 'http://localhost:5000'
    const notesIntital = []

    //Get all notes
    const getAllNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        // console.log(json);
        setNotes(json)
    }
    // Add a new note
    const addNote = async (title, description, tag) => {
        //Api call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await response.json();
        //logic to add a new note in frontend or client side 
        // console.log("adding a new note")
        setNotes(notes.concat(note))
    }
    // Delete a note
    const deleteNote = async (id) => {
        // Api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        // logic for frontend
        // console.log('deleting a note with id' + id)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes);
    }
    // edit note
    const editNote = async (id, title, description, tag) => {
        // Api call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = await response.json();
        // logic to edit in client
        for (let i = 0; i < notes.length; i++) {
            const element = notes[i];
            if (element._id === id) {
                notes[i].title = title;
                notes[i].description = description;
                notes[i].tag = tag;
            }
        }
        // to call the function getAllNotes() is a shortcut way to show the updated note in frontend
        getAllNotes();
    }
    const [notes, setNotes] = useState(notesIntital)
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getAllNotes }}>
            {props.children}
        </NoteContext.Provider>
    )

}
export default NoteState;
