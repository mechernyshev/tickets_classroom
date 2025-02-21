import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
    var signin: () => string[];
}

let mongo: any;

beforeAll (async () => {
    process.env.JWT_KEY = 'test_key_1234567890';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll (async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});


global.signin = () => {
    // Build a JWT payload

    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    }
    // {"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjcwMjI5OTgxMGZmMmM2MWMwODQxNiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTc0MDA0Njg4OX0.dmOhiTKNLg-cxyh5otavFD71XnzmG2vs9ZGdajKMXac"}

    const token = jwt.sign(payload, process.env.JWT_KEY!);

    const session = {jwt: token};
    // create JWT
    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}