const jwt = require('jsonwebtoken');
const conexion = require('../database/db')
const { promisify } = require('util');

require('dotenv').config({ path: './env/.env' })

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado. Debe iniciar sesión' });
    }

    try {
        console.log("entra en isAuthenticated try");
        // Verificar y descodificar el token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETO);

        // Obtener el ID de usuario del token decodificado
        const userId = decodedToken.user_id;
        // Pasar al siguiente middleware o ruta si el usuario tiene un token válido
        req.userId = userId; // Almacenar el ID de usuario en el objeto de solicitud
        console.log("autenticado correctamente, tu id es " + userId);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Acceso no autorizado. Token inválido.' });
    }
};

const setAuthenticatedUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return next();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETO);
    const userId = decodedToken.user_id;
    req.userId = userId;
    next();

};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;

        // Eliminar la lista de libros del usuario
        const deleteBookListQuery = 'DELETE FROM bookList WHERE user_id = ?';
        await promisify(conexion.query).call(conexion, deleteBookListQuery, [userId]);

        // Eliminar la suscripción del usuario
        const deleteSubscriptionQuery = 'DELETE FROM subscription WHERE subscription_id IN (SELECT subscription_id FROM user WHERE user_id = ?)';
        await promisify(conexion.query).call(conexion, deleteSubscriptionQuery, [userId]);

        // Eliminar el usuario de la base de datos
        const deleteUserQuery = 'DELETE FROM user WHERE user_id = ?';
        await promisify(conexion.query).call(conexion, deleteUserQuery, [userId]);

        console.log('Usuario y sus datos asociados eliminados correctamente');
    } catch (error) {
        console.error('Error al eliminar el usuario y sus datos asociados:', error);
        return res.status(500);
    }
}

/*
const changePasswordAuthenticated = async (req, res) => {
    try {
        const { userId } = req;
        const { currentPassword, newPassword } = req.body;
        console.log("contrasena actual: " + currentPassword + " nueva: " + newPassword + " userId: " + userId);

        // Obtener el usuario de la base de datos
        const userQuery = 'SELECT * FROM user WHERE user_id = ?';
        const [user] = await promisify(conexion.query).call(conexion, userQuery, [userId]);

        // Verificar la contraseña actual
        const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            console.log('Contraseña actual incorrecta');
            return res.redirect('/error');
        }
        if (!process.env.PWD_REGEX.test(newPassword)) {
            console.log('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial');
            return res.redirect('/error');
        }

        // Generar el hash de la nueva contraseña
        const newHashedPassword = await bcryptjs.hash(newPassword, 8);

        // Actualizar la contraseña en la base de datos
        const updatePasswordQuery = 'UPDATE user SET password = ? WHERE user_id = ?';
        await promisify(conexion.query).call(conexion, updatePasswordQuery, [newHashedPassword, userId]);

        console.log('Contraseña actualizada correctamente');
        res.redirect('/success');
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.redirect('/error');
    }
};*/


const setSubscription = async (req, res) => {
    console.log("entra en setSubscription");
    try {
        const userId = req.userId;
        const newSubscriptionNumber = req.body.newSubscriptionNumber;

        // Obtener el número de suscripción del usuario
        const subscriptionNumber = await getSubscriptionNumber(userId);
        console.log("subscriptionNumber= " + subscriptionNumber + " de tipo " + typeof subscriptionNumber);
        // Transformar newSubscriptionNumber a number
        const parsedSubscriptionNumber = parseInt(newSubscriptionNumber);
        console.log("newSubscriptionNumber= " + parsedSubscriptionNumber + "de tipo " + typeof parsedSubscriptionNumber);
        if (parsedSubscriptionNumber <= process.env.MAX_NUMBER_SUSCRIPTION) {
            console.log("entra en el if");
            // Modificar el número de suscripción del usuario
            const subscriptionQuery = 'UPDATE subscription SET subscription_number = ? WHERE user_id = (SELECT subscription_id FROM user WHERE user_id = ?)';

            await new Promise((resolve, reject) => {
                conexion.query(subscriptionQuery, [parsedSubscriptionNumber, userId], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });

            console.log('Número de suscripción actualizado correctamente a ' + parsedSubscriptionNumber + ' para el usuario con ID ' + userId);
            res.redirect('/index');
        }
    } catch (error) {
        console.error('Error al actualizar el número de suscripción:', error);
        res.redirect('/error');
    }
};

const getSubscriptionNumber = (userId) => {
    console.log("entra en getSubscriptionNumber");
    return new Promise((resolve, reject) => {
        const subscriptionQuery = `
    SELECT s.subscription_number
    FROM subscription s
    JOIN user u ON u.subscription_id = s.subscription_id
    WHERE u.user_id = ?
`;
        conexion.query(subscriptionQuery, [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].subscription_number);
            }
        });
    });
};

// Método para agregar un libro a la lista
const addBookToList = async (req, res) => {
    try {
        console.log("entra en addBookToList: try");
        const userId = req.userId;
        const bookId = req.body.bookId;

        // Buscar el book_id correspondiente al título del libro en la tabla "book"
        const selectQuery = 'SELECT book_id FROM book WHERE book_id = ?';
        const results = await promisify(conexion.query).call(conexion, selectQuery, [bookId]);

        if (results.length === 0) {
            console.error('No se encontró el libro con el título proporcionado');
            return res.status(404);
        }

        const bookIdResult = results[0].book_id;

        // Insertar el libro en la lista
        const insertQuery = 'INSERT INTO bookList (user_id, book_id) VALUES (?, ?)';
        const bookData = await promisify(conexion.query).call(conexion, insertQuery, [userId, bookIdResult]);

        console.log('Libro agregado a la lista correctamente');
        return res.json(bookData || []);
    } catch (error) {
        console.error('Error al agregar el libro a la lista:', error);
        return res.status(500);
    }
};


// Método para eliminar un libro de la lista
const removeBookFromList = async (req, res) => {
    try {
        console.log("entra en removeBookFromList: try");
        const userId = req.userId;
        const title = req.body.title;

        // Buscar el book_id correspondiente al título del libro en la tabla "book"
        const selectQuery = 'SELECT book_id FROM book WHERE title = ?';
        const results = await promisify(conexion.query).call(conexion, selectQuery, [title]);

        if (results.length === 0) {
            console.log('No se encontró el libro con el título proporcionado');
            return res.status(404);
        }

        const bookId = results[0].book_id;

        // Eliminar el libro de la lista
        const deleteQuery = 'DELETE FROM bookList WHERE user_id = ? AND book_id = ?';
        const bookData = await promisify(conexion.query).call(conexion, deleteQuery, [userId, bookId]);

        console.log('Libro eliminado de la lista correctamente');
        return res.json(bookData || []);
    } catch (error) {
        console.error('Error al eliminar el libro de la lista:', error);
        return res.status(500);
    }
};
const getUserBookList = async (req, res) => {
    try {
        console.log("entra en getUserBookList");
        const userId = req.userId;

        if (!userId) {
            return res.json([]);
        }

        let bookFavData = [];

        const selectFavQuery = `
            SELECT bookList.book_id, book.title, book.publisher, book.isbn, book.author, book.is_school_book, book.course_level, book.subject
            FROM bookList
            INNER JOIN book ON bookList.book_id = book.book_id
            WHERE bookList.user_id = ?
        `;
        bookFavData = await promisify(conexion.query).call(conexion, selectFavQuery, [userId]);

        
        const bookIdsWithFav = bookFavData.map(book => book.book_id);

        const selectQuery = `
        SELECT bookList.book_id, book.title, book.publisher, book.isbn, book.author, book.is_school_book, book.course_level, book.subject
        FROM bookList
        INNER JOIN book ON bookList.book_id = book.book_id
        WHERE bookList.user_id = ?
        `;
        
        const bookData = await promisify(conexion.query).call(conexion, selectQuery, [userId]);

        const booksWithFav = bookData.map(book => {
            const favFound = !!bookFavData.find((bookFav) => book.book_id === bookFav.book_id);
            return {
                ...book,
                fav: favFound
            }
        });

        console.log('Lista de libros obtenida correctamente');
        return res.json(booksWithFav || []);
    } catch (error) {
        console.error('Error al obtener la lista de libros:', error);
        return res.status(500);
    }
};


const getUserData = async (req, res) => {
    try {
        console.log("Enters getUserData");
        const userId = req.userId;

        // Consultar los datos del usuario
        const selectQuery = `
      SELECT * FROM user WHERE user_id = ?
    `;
        const userData = await promisify(conexion.query).call(conexion, selectQuery, [userId]);

        console.log('Datos del usuario obtenidos correctamente');
        return res.json(userData || []);

    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return res.status(500);
    }
};



module.exports = {
    setAuthenticatedUser,
    isAuthenticated,
    deleteAccount,
    setSubscription,
    addBookToList,
    removeBookFromList,
    getUserBookList,
    getUserData
    // changePasswordAuthenticated
}
