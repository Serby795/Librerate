import React from 'react'
import './styles/styles.css'
import Header from './Header/Header'
import Register from './Register/Register'
import { Routes, Route } from 'react-router-dom'
import LogIn from './LogIn/Login'
import Footer from './Footer/Footer'
import Home from './Home/Home'
import AdvancedSearch from './Search/AdvancedSearch'
import Reader from './Reader/Reader'
import Favourite from './Favourite/Favourite'
import Cookies from 'js-cookie'

const loginCookie = Cookies.get('jwt')

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route path='/' element={<Home />} />
          <Route path='register' element={<Register /> } />
          <Route path='LogIn' element={<LogIn />} />
          <Route path='*' element={<h1 className="d-flex justify-content-center mainContent" style={{ color: "black" }}>Hola! Aquí todavía se está trabajando</h1>} />
          <Route path='Leer/:bookId' element={<Reader />} />
          <Route path='buscarLibro' element={<AdvancedSearch />} />
          {loginCookie ? <Route path='miLista' element={<Favourite />} /> : null}
        </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App
