import React from "react";
import { Link } from "react-router-dom";
import '../styles/_home.scss'
import Cookies from "js-cookie";
import LinkButton from "../components/LinkButton";
import axios from "../api/axios";



const isLogged = Boolean(Cookies.get('jwt'));
const REGISTER_URL = "/addBookToList";
async function removeBookFromList (bookId) {
    try {
        const response = await axios.post(
            REGISTER_URL,
            JSON.stringify({bookId: bookId}),
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
        );
        console.log(response);
    } catch (err) {
        console.error(err)
    }
}


const Book = ({ props }) => {
    async function addBookToList(bookId) {
        try {
            const response = await axios.post(
                REGISTER_URL,
                { bookId },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            console.log(response);
            //refreshPage();
            refreshPage();
        } catch (err) {
            console.error(err)
        }
    }
    
    const enlaceImg = "src/assets/"+props.subject+".png";

    return (
        <>
            <div className="card book">
                <img src={enlaceImg} className="card-img-top portada h-100 w-auto border-bottom" alt={props.title} />
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                    <h5 className="card-title tituloLibro">{props.title}</h5>
                    <p className="card-text datosLibro">
                        <span className="datos">{props.author}</span> <br />
                        <span className="datos">{props.publisher}</span> <br />
                        <span className="datos">{props.isbn}</span> <br />
                        <span className="datos">Libro de {props.subject}</span> <br />
                    </p>
                    {isLogged
                        ?
                        (<div className="d-flex justify-content-between">
                            <button className="btn btn-customRed" style={{ marginRight: '1rem' }}>
                                <Link className="linkTo" to={{ pathname: `/Leer/${props.book_id}` }}>Leer</Link>
                            </button>
                            {!props.fav
                                ?
                                (<button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    style={{ marginLeft: '1rem' }}
                                    onClick={() => addBookToList(props.book_id)}
                                    data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Añadir a favoritos">
                                    <span role="img" aria-label="Añadir a favoritos">⭐</span>
                                </button>)
                                :
                                (<button className="btn border-dark" style={{ marginLeft: '1rem' }} onClick={() => removeBookFromList(props.book_id)}>
                                    <span role="img" aria-label="Quitar de favoritos">❌</span>
                                </button>)}
                        </div>)
                        :
                        (<LinkButton buttonClassname="btn btn-customRed linkTo" to="Login" text="Inicie sesión para leer" />)
                    }
                </div>
            </div>
        </>
    )
}
export default Book;

