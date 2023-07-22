import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link, json } from "react-router-dom";
import bcrypt from "bcryptjs";
import axios from "../api/axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const EMAIL_REGEX = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
const NAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';


const Register = () => {

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [pass, setPass] = useState('');
    const [validPass, setValidPass] = useState(false);
    const [passFocus, setPassFocus] = useState(false);

    const [matchPass, setMatchPass] = useState('');
    const [validMatchPass, setValidMatchPass] = useState(false);
    const [matchPassFocus, setMatchPassFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = NAME_REGEX.test(name);
        console.log(result);
        console.log(name);
        setValidName(result);
    }, [name]);

    useEffect(() => {
        const result = PWD_REGEX.test(pass);
        console.log(result);
        console.log(pass);
        setValidPass(result);
        const match = pass === matchPass;
        setValidMatchPass(match);
    }, [pass, matchPass]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pass, matchPass]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        //una validación más en el caso de que el botón pueda ser "hackeado"
        //el botón está deshabilitado hasta que el formulario sea válido
        //pero puede ser habilitado desde el inspector de elementos
        //por lo que se hace una validación más

        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pass);
        const v3 = pass === matchPass;
        const v4 = NAME_REGEX.test(name);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg('El formulario contiene errores.');
            return;
        }



        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ name, user: email, pass }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
            // limpiar el formulario
            setEmail('');
            setName('');
            setPass('');
            setMatchPass('');

        } catch (err) {
            if (!err?.response) {
                setErrMsg('Error de conexión.');
            } else if (err.response?.status === 409) {
                setErrMsg('El correo electrónico ya está registrado.');
            } else {
                setErrMsg('Registro fallido.');
            }
            errRef.current.focus();
        }

    }


    return (
        <>
            {success ? (
                <section className="containerRegistro">
                    <h1>¡Cuenta creada!</h1>
                    <p>Ya puedes iniciar sesión con tu nueva cuenta.</p>
                    <Link to="/login">Iniciar sesión</Link>
                </section>
            ) : (
                <section className="registerContainer">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                    <form className="registerForm" onSubmit={handleSubmit}>
                        <h1 className="registerTitle">Crear cuenta</h1>
                        <hr className="hr" />
                        <label className="registerLabel" htmlFor="email">
                            Correo electrónico:
                            <span className={validEmail ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validEmail || !email ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="email"
                            ref={emailRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            El correo electrónico no tiene un formato válido.
                        </p>

                        <label className="registerLabel" htmlFor="name">
                            Nombre:
                            <span className={validName ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validName || !name ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                        />
                        <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            El nombre tiene que tener más de 3 letras. <br />
                            No puede contener números ni caracteres especiales.
                        </p>

                        <label className="registerLabel" htmlFor="password">
                            Contraseña:
                            <span className={validPass ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPass || !pass ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPass(e.target.value)}
                            required
                            aria-invalid={validPass ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPassFocus(true)}
                            onBlur={() => setPassFocus(false)}
                        />
                        <p id="pwdnote" className={passFocus && pass && !validPass ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            La contraseña debe tener entre 8 y 24 caracteres <br />
                            Al menos una mayúscula, una minúscula, un número y un caracter especial. <br />
                            Caracteres especiales válidos:
                            <span aria-label="exclamación"> ! </span>
                            <span aria-label="arroba"> @ </span>
                            <span aria-label="almoadilla"> # </span>
                            <span aria-label="dólar"> $ </span>
                            <span aria-label="por ciento"> % </span>
                        </p>

                        <label className="registerLabel" htmlFor="confirm_pass">
                            Confirmar contraseña:
                            <span className={validMatchPass && matchPass ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validMatchPass || !matchPass ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_pass"
                            onChange={(e) => setMatchPass(e.target.value)}
                            required
                            aria-invalid={validMatchPass ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchPassFocus(true)}
                            onBlur={() => setMatchPassFocus(false)}
                        />
                        <p id="confirmnote" className={matchPassFocus && matchPass && !validMatchPass ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Las contraseñas no coinciden.
                        </p>

                        <button className="btn btn-customRed linkTo" diabled={!validEmail || !validPass || !validMatchPass ? true : false}>
                            Crear cuenta
                        </button>
                    </form>
                    <p>
                        ¿Ya tienes una cuenta? <br />
                        <span className="line">
                            <Link to="/Login">Inicia sesión</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}


export default Register;