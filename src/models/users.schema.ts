import { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        uid: String,
        groups: [{
            type: String
        }],
        isOnline: Boolean,
        photoUrl: String,
        createdAt:{
            type: Date,
            default: new Date()
          },
    }
);
export default UserSchema;