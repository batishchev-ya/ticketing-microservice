import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title:'valid', 
      price: 20
    })
    .expect(404);
  });
  
it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title:'valid', 
      price: 20
    })
    .expect(401);
    
  });
  
it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title:'valid', 
      price: 20
    })
    const id = response.body.id;
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title:'somevalid', 
      price: 30
    })
    .expect(401);
  
});

it('returns a 400 if the user provides invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title:'valid', 
      price: 20
    });
  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title:'', 
      price: 20
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title:'sdfsdf', 
      price: -10
    })
    .expect(400);
  
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title:'valid', 
      price: 20
    });
  const id = response.body.id;
  const newTitle = 'new title';
  const newPrice = 100;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle, 
      price: newPrice
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});


it('publishes an event', async () => {
  const title = 'sdsd';
  const price = 20;

  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title:'valid', 
      price: 20
    });
  const id = response.body.id;
  const newTitle = 'new title';
  const newPrice = 100;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle, 
      price: newPrice
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});