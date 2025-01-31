import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest'
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdasdasd';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});

});

beforeEach(async () => {
  if(mongoose.connection.db){
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections) {
      await collection.deleteMany();
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Bild jwt payload. { id, email }
  const payload = {
    id:'asdasf', 
    email: 'test@test.test'
  };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object { jwt: my_jwt}
  const session = { jwt: token };
  // Turn that session in to JSON
  const sessionJSON = JSON.stringify(session);
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats a cookie with the encoded data
  return [`session=${base64}`];
}