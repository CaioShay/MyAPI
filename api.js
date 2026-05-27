const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(express.json());

// rota de login
app.post('/login', (req, res) => {

    const { user, password } = req.body;

    // exemplo simples
    if (user !== 'caio' || password !== '123') {
        return res.status(401).json({
            error: 'Usuário ou senha inválidos'
        });
    }

    // cria token
    const token = jwt.sign(
        {
            user: user
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    res.json({
        token: token
    });
});

// middleware auth
function auth(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Token não enviado'
        });
    }

    // Bearer TOKEN
    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch {

        return res.status(401).json({
            error: 'Token inválido'
        });
    }
}

// rota protegida
app.post('/multiply', auth, (req, res) => {

    const a = Number(req.body.a);
    const b = Number(req.body.b);

    res.json({
        user: req.user.user,
        result: a * b
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
});