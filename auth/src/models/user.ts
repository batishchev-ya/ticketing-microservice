import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An Interface that describes the properties that a User Modal Has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs) : UserDoc
};

// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function(done) {
  if(this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
// here <UserDoc, UserModel> means that we pass types UserDoc and UserModel as arguments in function model. model method will return UserModel after calling it because we provided UserModel as second argument. UserDoc says that model method will work with userSchema created earlier.
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };