import React, {useState, useEffect} from "react";
import { Libro } from "../Domain/Libro";
import Book from "../Book/Book";
import axios from "../api/axios"

async function getAllBooks() {


    const response = await axios.get(
        "http://localhost:3000/getAllBooks",
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        }
    )
    console.log(response);
    return response.data || [];


}

const Home = () => {
    let content = [];
    const [listaLibros, setState] = useState([]);
    
    useEffect( () => {
        if (listaLibros.length === 0) {
            getAllBooks().then(allBooks => {
                setState(allBooks);
            })
        }
    }, []);

    listaLibros.forEach((libro) => {
        content.push(
                <Book props={libro} key={libro.book_id}/>
        )
    });
    return (
        <>
        <div className="mainContainer">
            {content}
        </div>
        </>
    )
}

export default Home;