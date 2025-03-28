import request from 'supertest';
import { app } from '../../app';

it('responds with details about current user', async () => {
  const cookie = await global.signin();
  if(!cookie){
    throw new Error("Cookie not set after signup");
  }
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie[0])
    .send()
    .expect(200)
  expect(response.body.currentUser.email).toEqual('test@test.test');
});

it('responds with null if not authenicated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)
  expect(response.body.currentUser).toEqual(null);
});

