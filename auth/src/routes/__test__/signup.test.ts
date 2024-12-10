import request  from "supertest";
import { app } from "../../app";

it('returns a 201 on succesfull signup', async () => {
  return request(app).
    post('/api/users/signup').
    send({
      email: 'test@test.com', 
      password: 'password'
    }).
    expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app).
    post('/api/users/signup').
    send({
      email: 'invalid.email', 
      password: 'password'
    }).
    expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app).
    post('/api/users/signup').
    send({
      email: 'test@test.test', 
      password: 'p'
    }).
    expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app).
    post('/api/users/signup').
    send({
      email: 'test@test.test'
    }).
    expect(400);

  return request(app).
    post('/api/users/signup').
    send({
      password: 'asdasdasd'
    }).
    expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app).
    post('/api/users/signup').
    send({
      email: 'test@test.test', 
      password: 'password'
    }).
    expect(201);
    
  return request(app).
    post('/api/users/signup').
    send({
      email: 'test@test.test', 
      password: 'asdasdasd'
    }).
    expect(400);
});
  
  it('sets a cookie after successfull singup', async () => {
    const response = await request(app).
      post('/api/users/signup').
      send({
        email: 'test@test.test', 
        password: 'password'
      }).
      expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
});