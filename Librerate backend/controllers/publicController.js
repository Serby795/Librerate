const jwt = require('jsonwebtoken');
const conexion = require('../database/db')
const { promisify } = require('util');

require('dotenv').config({ path: './env/.env' })


const getAllBooks = async (req, res) => {
  try {
      console.log("Enters getUserData");
      const userId = req.userId;

      // Consultar los datos del usuario
      let bookFavData = [];
      console.log("userID" + userId);
      if (userId) {
        const selectFavQuery = 'SELECT * FROM booklist WHERE user_id = ?'
        bookFavData = await promisify(conexion.query).call(conexion, selectFavQuery, [userId]);
        
      }
      const selectQuery = `SELECT * FROM book`;
      const bookData = await promisify(conexion.query).call(conexion, selectQuery);
      const booksWithFav = bookData.map(book => {
        const favFound = !!bookFavData.find((bookFav) => book.book_id === bookFav.book_id);
        
        return {
          ...book,
          fav: favFound
        }
      });

      console.log('Obtenidos todos los libros');
      return res.json(booksWithFav || []);
  } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return res.status(500);
  }
};



module.exports = {
  getAllBooks
}
