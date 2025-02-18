import request from 'supertest'
import {app} from "../../app";

jest.setTimeout(10000); // 10 seconds

it ('returns a 201 on successful signup', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({email: 'test@test.com', password: 'password'})
    .expect(201)
})

it ('returns a 400 on invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({email: 'test@tes', password: 'password'})
        .expect(400)
})

it ('returns a 400 on invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'p'})
        .expect(400)
})

it ('returns a 400 with missing email and password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

it ('returns a 400 on duplicate emails signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(400)
})

it ('Sets a cookie after sign up', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})