"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const signup = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email, phone } = req.body;
        const hashed = await (0, hash_1.hashPassword)(password);
        const user = await prisma.user.create({
            data: {
                username,
                password: hashed,
                firstName,
                lastName,
                email,
                phone,
            },
        });
        const token = (0, jwt_1.generateToken)({ id: user.id, username: user.username });
        res.status(201).json({ token });
    }
    catch (err) {
        res.status(400).json({ error: 'Signup failed', details: err });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !(await (0, hash_1.comparePassword)(password, user.password))) {
            res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)({ id: user.id, username: user.username });
        res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ error: 'Login failed', details: err });
    }
};
exports.login = login;
const signout = async (req, res) => {
    res.status(200).json({ status: 200, message: 'Logged out successfully' });
};
exports.signout = signout;
