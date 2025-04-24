"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// beforeAll(async () => {
//   await prisma.user.deleteMany(); // Clean test DB before starting
// });
describe('Auth Routes', () => {
    const testUser = {
        username: 'testuser',
        password: 'test1234',
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        phone: '1234567890'
    };
    let token = '';
    it('should signup a new user', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/signup').send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });
    it('should login the user', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/signin').send({
            username: testUser.username,
            password: testUser.password
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
    it('should fetch the user profile', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.username).toBe(testUser.username);
    });
});
