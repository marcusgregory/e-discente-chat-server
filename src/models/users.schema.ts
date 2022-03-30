import { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        uid: String,
        fcmTokens: [{
            type: String,
        }],
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