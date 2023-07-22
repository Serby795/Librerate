import { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import axios from '../api/axios';
import bcrypt from "bcryptjs";

const LOGIN_URL = "/login";


const LogIn = () => {
    const { setAuth } = useContext(AuthContext);
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email, pass]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user: email, pass }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.accessToken;
            const { id } = response.data;
            setAuth({ id, email, pass, accessToken });
            setEmail("");
            setPass("");
            window.location.href = "/"
        } catch (err) {
            if (!err?.response) {
                setErrMsg("Error de conexión");
                return;
            } else if (err.response?.status === 400) {
                setErrMsg("Falta el email o la contraseña");
            } else if (err.response?.status === 401) {
                setErrMsg("Email o contraseña incorrectos");
            } else {
                setErrMsg("Error desconocido");
            }
            errRef.current.focus();
        }

    };
    return (
        <>
            <section className='logInContainer'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                <form className='loginForm' onSubmit={handleSubmit}>
                    <h1 className='loginTitle'>Iniciar sesión</h1>
                    <hr className="hr" />
                    <label className="loginLabel" htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        ref={emailRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        className='loginInput'
                    />

                    <label className="loginLabel" htmlFor="pass">Contraseña:</label>
                    <input
                        type="password"
                        id="pass"
                        onChange={(e) => setPass(e.target.value)}
                        value={pass}
                        required
                        className='loginInput'
                    />

                    <button className='btn btn-customRed linkTo'>Conectar</button>
                </form>
                <div className="goToRegister">

                    <p>¿No tienes cuenta?</p>
                    <span>
                        <Link className='loginLink' to="/register">Regístrate</Link>
                    </span>
                </div>
            </section>
        </>
    );
}


export default LogIn;