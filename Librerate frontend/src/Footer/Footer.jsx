import React from "react";
import { Link } from "react-router-dom";


const Footer = () =>{
    return(
        <>
            <div className="footerContainer">
                <Link to="/Home"><img src="/src/assets/logoLibrerate.png" alt="Logo de librerate" className="footerLogo" /></Link>
                <div className="footerLinks">
                    <div className="footerColumn">
                        <h6 className="footerColumnTitle">Acerca de</h6>
                        <a href="*" className="footerLink">Acerca de Librerate</a>
                        <a href="*" className="footerLink">Librerate para empresas</a>
                        <a href="*" className="footerLink">Unete a nuestro equipo</a>
                    </div>
                    <div className="footerColumn">
                        <h6 className="footerColumnTitle">Ayuda</h6>
                        <a href="*" className="footerLink">Ayuda / Preguntas frecuentes</a>
                        <a href="*" className="footerLink">Contactar con soporte</a>
                        <a href="*" className="footerLink">Ayuda para compra</a>
                    </div>
                    <div className="footerColumn">
                        <h6 className="footerColumnTitle">Legal</h6>
                        <a href="*" className="footerLink">Terminos</a>
                        <a href="*" className="footerLink">Privacidad</a>
                        <a href="*" className="footerLink">Copyright</a>
                    </div>
                    <div className="footerColumn">
                        <h6 className="footerColumnTitle">Social</h6>
                        <a href="*" className="footerLink">Instagram</a>
                        <a href="*" className="footerLink">LinkedIn</a>
                        <a href="*" className="footerLink">Facebook</a>
                    </div>
                </div>
            </div>
        </>
    )
}



export default Footer;