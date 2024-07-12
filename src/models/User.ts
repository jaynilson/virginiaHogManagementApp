import mongoose, {Schema, Document, Number, Mongoose} from "mongoose";

export interface IUser extends Document {
    user_id: Number;
    amount: Number,
    date: Date,
}

const UserSchema : Schema = new Schema({
    user_id: {type: Number, required: true},
    amount: {type: Number, required:true},
    date: {type: Date, required: true},
});

export default mongoose.model<IUser>('User', UserSchema);