import request from 'supertest';
import { app } from '../../app';

it('responds with the current user', async () => {

    let cookie = await signin()

    if (!cookie) {
        throw new Error("Cookie not set after signup");
    }
    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
})

it ('responds with null if not signed in', async () => {
    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        expect(200);

    expect(response.body.currentUser).toBeNull();
})