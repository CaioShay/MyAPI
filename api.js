require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;

// verifica se o secret existe
if (!SECRET) {
    console.log('JWT_SECRET não encontrado no .env');
    process.exit(1);
}else {console.log(SECRET)}

// rota de login
app.post('/login', (req, res) => {

    const { user, password } = req.body;

    // validação simples
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
        SECRET,
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

    // verifica se enviou o token
    if (!authHeader) {
        return res.status(401).json({
            error: 'Token não enviado'
        });
    }

    // pega o token depois do Bearer
    const token = authHeader.split(' ')[1];

    // verifica token
    try {

        const decoded = jwt.verify(
            token,
            SECRET
        );

        // salva dados do usuário
        req.user = decoded;

        next();

    } catch (err) {

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

// inicia servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});