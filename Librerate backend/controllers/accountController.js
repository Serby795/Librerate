const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');
require('dotenv').config({ path: './env/.env' });

const queryAsync = promisify(conexion.query).bind(conexion);

exports.register = async (req, res) => {
    try {
        const { name, user: email, pass } = req.body;
        const USER_REGEX = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        const existingUser = await queryAsync('SELECT * FROM user WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            console.error('User already exists');
            return res.status(409);
        }

        if (name && email && pass) {
            if (!email.match(USER_REGEX)) {
                console.error('Email or password does not meet the requirements');
                return res.status(400);
            }

            send(email);
            await createUser(name, email, pass);
            return res.status(200).json({ name, email, pass });
        } else {
            console.error('Missing name, email, or password');
            return res.status(400);
        }
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
};
/*
exports.changePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Verificar si el usuario existe
        const existingUser = await queryAsync('SELECT * FROM user WHERE email = ?', [email]);
        if (existingUser.length === 0) {
            console.log('Usuario no encontrado');
            return res.redirect('/error');
        }

        if (!process.env.USER_REGEX.test(email) || !process.env.PWD_REGEX.test(newPassword)) {
            console.log('El email o la nueva contraseña no cumplen con los requisitos');
            return res.redirect('/error');
        }

        // Generar un hash de la nueva contraseña
        const hashedPassword = await bcryptjs.hash(newPassword, 8);

        // Actualizar la contraseña en la base de datos
        await queryAsync('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, email]);

        console.log('Contraseña modificada correctamente para el usuario ' + email);
        return res.redirect('/index');
    } catch (error) {
        console.log(error);
        return res.redirect('/error');
    }
};*/



async function createUser(name, email, pass) {
    try {
        const userQuery = 'INSERT INTO user (username, password, email) VALUES (?, ?, ?)';
        const userResult = await queryAsync(userQuery, [name, pass, email]);

        const userId = userResult.insertId;

        const subscriptionQuery = 'INSERT INTO subscription (user_id, subscription_number) VALUES (?, ?)';
        await queryAsync(subscriptionQuery, [userId, 0]);
    } catch (error) {
        console.error(error + ' in createUser');
    }
}

exports.login = async (req, res) => {
    try {
        const { user: email, pass } = req.body;

        if (!email || !pass) {
            console.log('Ingrese un usuario y contraseña');
            return res.status(400)
        }

        const results = await queryAsync('SELECT user_id, password FROM user WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(401)
        }
        const isMatch = pass === results[0].password;

        if (!isMatch) {
            console.log('Contraseña incorrecta');
            return res.status(401)
        }


        const id = results[0].user_id;
        const name = results[0].username;

        const token = jwt.sign({ user_id: id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        });
        console.log(`TOKEN: ${token} para el USUARIO: ${email}`);

        const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: false
        };
        res.cookie('jwt', token, cookiesOptions);
        console.log('La cookie se ha creado correctamente, se ha iniciado sesión correctamente');
        return res.status(200).json({
             token,
             email,
             id
        });
    } catch (error) {
        console.log(error);
        return res.status(500)
    }
};




exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.status(200).json({})
}

const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const OAuth2 = google.auth.OAuth2;
const accountTransport = require('../account_transport.json')

//email
const mail_rover = async (callback) => {
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
        tls: {
            rejectUnauthorized: false
        }
    });

    oauth2Client.getAccessToken((err, tokens) => {
        if (err) {
            console.log(err);
            return;
        }

        accountTransport.auth.accessToken = tokens.access_token;
        callback(nodemailer.createTransport(accountTransport));
    });
};
function send(email) {
    mail_rover(function (emailTransporter) {
        const mailOptions = {
            from: 'Librerate register 📖" <andreajacome2509@gmail.com>',
            to: email,
            subject: 'Register',
            html: `
            <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Bienvenido a Librerate</title>
                </head>
                <body>
                    <h1>Bienvenido a Librerate</h1>
                    <p>Gracias por unirte a nuestra comunidad de lectores. Estamos emocionados de tenerte a bordo.</p>
                    <br><br>
                    <p>Para comenzar a disfrutar de todos los beneficios de Librerate puedes escoger una de las suscripciones que ofrecemos: </p>
                    <br><br>
                    <p>enseñamos suscripciones</p>
                    <p>¡Esperamos que disfrutes de tu experiencia con nosotros!</p>
                    <br><br>
                    <p>Saludos,</p>
                    <p>El equipo de Librerate</p>
                </body>
                </html>

      `,
        };

        emailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}



