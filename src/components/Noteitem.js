import React, { useContext} from 'react'
import noteContext from '../Context/notes/noteContext';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note,updateNote } = props;
    return (
        <div className='col-md-4 my-2'>


            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <i className="fa-solid fa-trash" onClick={()=>{deleteNote(note._id); props.showAlert("Deleted successfully","success");}}></i>
                    <i className="fa-solid mx-4 fa-pen-to-square" onClick={()=>{updateNote(note)}}></i>

                </div>
            </div>
        </div>
    )
}

export default Noteitem