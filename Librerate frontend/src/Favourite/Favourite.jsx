import React, {useContext, useState, useEffect} from "react";
import axios from "../api/axios";
import { Link, useParams } from "react-router-dom";
import Book from "../Book/Book.jsx";




//CAMBIA LA CONSTANTE SI QUIERES
const REGISTER_URL ="/favourite/${userId}/";

async function getUserBookList() {
    try {
        const response = await axios.get(`/getUserBookList`,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
        console.log('Lista de libros obtenida correctamente:', response.data);
        // Realiza acciones adicionales con la lista de libros obtenida
        return response.data;
    } catch (error) {
        console.error(error)
    }
}








const Favourite = () => {
    
    const [listaLibrosFavoritos, setListaLibrosFavoritos] = useState([]);
    let content = [];

    useEffect(() => {
        if (listaLibrosFavoritos.length === 0) {
          try{
            getUserBookList().then(favouriteBooks => {
                setListaLibrosFavoritos(favouriteBooks);
            });
          } catch (error) {
            console.log(error);
          }
            
        }
    }, []);
    listaLibrosFavoritos?.forEach((libro, index) => {
        content.push(
            <Book props={libro} key={index}/>
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

export default Favourite;