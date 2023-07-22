import React from "react";
import SearchBar from "./searchbar";
import { Outlet, Link } from "react-router-dom";
import axios from "../api/axios";
import Cookies from "js-cookie";



const loginCookie = Cookies.get("jwt");
console.log("LA COOKIES ES " + loginCookie);

const LOGOUT_URL = "/logout";
const Header = () => {  
    
    const handleLogout = async () => {
        console.log('Handle LOGOUT')
        try {
            const response = await axios.post(LOGOUT_URL,
                JSON.stringify({}),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));

            console.log('Handle LOGOUT 2')
            window.location.href = "/";
        } catch (err) {
            console.log({ err });
            if (err.response?.status === 400) {
                console.log("Error 400");
            } else if (err.response?.status === 401) {
                console.log("Error 401");
            } else {
                console.log("Error desconocido");
            }
        }
    }

    return (
        <>
            <div className="headerContainer">
                <div className="headerUp">
                    <Link to="/" className="linkLogo"><img src="/src/assets/logoLibrerate.png" alt="Logo de Librerate" className="logo" /></Link>
                    <SearchBar />

                    {loginCookie
                        ?
                        (<div className="logIn-RegisterButtons">
                            <button className="btn btn-dark logIn-Register"><Link to="/miCuenta" className="linkTo">Mi Cuenta</Link></button>
                            <button className="btn btn-customRed logIn-Register linkTo" onClick={handleLogout}>Cerrar Sesion</button>
                        </div>)
                        :
                        (<div className="logIn-RegisterButtons">
                            <button className="btn btn-dark logIn-Register"><Link to="/register" className="linkTo">Registro</Link></button>
                            <button className="btn btn-customRed logIn-Register"><Link to='/LogIn' className="linkTo">Log-In</Link></button>
                        </div>)
                    }


                </div>
                <div className="headerDown">
                    <div className="headerLinksContainer">
                        <Link to="buscarLibro" className="headerLink">Búsqueda detallada</Link>
                        <Link to="queEsLibrerate" className="headerLink">Que es librerate</Link>
                        {loginCookie ? <Link to="miLista" className="headerLink">Mi lista</Link> : null }
                        <Link to="soporte" className="headerLink">Soporte</Link>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    )
}
export default Header;