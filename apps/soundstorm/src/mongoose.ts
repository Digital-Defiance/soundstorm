// mongoConnect.js
import {Model, connect } from 'mongoose';
import { environment } from './environment';
import { User, UserModelName } from './models/user';

export async function connectDb() {
    try {
        await connect(environment.mongo.uri, {
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export function loadModels(): { [key: string]: Model<unknown> }  {
    const result = {};
    result[UserModelName] = User;
    return result;
}

export default connect;
