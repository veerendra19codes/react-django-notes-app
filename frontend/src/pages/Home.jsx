import React, { useEffect, useState } from 'react'
import api from '../api'
import Note from '../components/Note';
import "../styles/Home.css"
import { Link } from 'react-router-dom';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    useEffect(() => {
        getNotes();
    }, [])

    const getNotes = () => {
        api.get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                console.log("data:", data);
                setNotes(data)
            })
            .catch((err) => alert(err))
    }

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    alert("Note deleted successfully!")
                }
                else {
                    alert("Failed to delete note!")
                }
                getNotes();
            })
            .catch((err) => alert(err));

    }

    const createNote = (e) => {
        api
            .post("api/notes/", { title, content })
            .then((res) => {
                if (res.status === 201) {
                    alert("Note created successfully!")
                }
                else {
                    alert("Failed to create note!")
                }
                getNotes();
            })
            .catch((err) => alert(err));
    }


    return (
        <div>
            <Link className="logout" to={"/logout"} >Logout</Link>
            <h2>Create a note</h2>
            <form onSubmit={createNote}>
                <label htmlFor='title'>Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />
                <label htmlFor='content'>Content:</label>
                <br />
                <textarea
                    type="text"
                    id="content"
                    name="content"
                    value={content}
                    required
                    onChange={(e) => setContent(e.target.value)}
                />
                <br />
                <input type="submit" value="Submit" />
            </form>
            <div>
                <h1>Notes</h1>
                {notes.map((note) => <Note key={note.id} note={note}
                    onDelete={deleteNote} />)}
            </div>
        </div>
    )
}

export default Home
