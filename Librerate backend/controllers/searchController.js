const conexion = require('../database/db');

const searchByFilters = async (req, res) => {
    try {
        const { title, editorial, isbn, author, is_school_book, course_level, subject } = req.query;

        // Construir la consulta SQL base
        let searchQuery = 'SELECT * FROM book WHERE 1 = 1';

        // Crear un array para almacenar los valores de los parámetros
        const values = [];

        // Agregar filtros según los campos proporcionados en el formulario
        if (title) {
            searchQuery += ' AND title LIKE ?';
            values.push(`%${title}%`);
        }

        if (editorial) {
            searchQuery += ' AND editorial LIKE ?';
            values.push(`%${editorial}%`);
        }

        if (isbn) {
            searchQuery += ' AND isbn LIKE ?';
            values.push(`%${isbn}%`);
        }

        if (author) {
            searchQuery += ' AND author LIKE ?';
            values.push(`%${author}%`);
        }

        if (is_school_book !== '') {
            const isSchoolBookValue = is_school_book === '1' ? 1 : 0;
            searchQuery += ' AND is_school_book = ?';
            values.push(isSchoolBookValue);
        }

        if (is_school_book === '0' && !course_level) {
            searchQuery += ' AND course_level IS NULL';
        } else if (course_level) {
            searchQuery += ' AND course_level = ?';
            values.push(course_level);
        }

        if (subject) {
            searchQuery += ' AND subject LIKE ?';
            values.push(`%${subject}%`);
        }

        // Ejecutar la consulta SQL con los valores de los parámetros
        const searchResults = await new Promise((resolve, reject) => {
            conexion.query(searchQuery, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        console.log('Libros encontrados:', searchResults);
        return res.json({ results: searchResults });

    } catch (error) {
        console.error('Error en la búsqueda de libros:', error);
        return res.status(500).json({ message: 'Error en la búsqueda de libros' });
    }
};

module.exports = {
    searchByFilters,
};
