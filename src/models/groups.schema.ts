import { Schema } from "mongoose";

const GroupSchema = new Schema(
    {
        gid: String,
        members: [{
            type: String,
            default:''
        }],
        createdAt: {
            type: Date,
            default: new Date()
        },
        modifiedAt: {
            type: Date,
            default: new Date()
        },
        name: String,
        recentMessage: {
            messageText: {
                type:String,
                default:''
            },
            sentBy: {
                type:String,
                default:''
            },
            sentAt: {
                type: Date,
                default: new Date()
            },
            readBy: [{
                type: String,
                default:''
            }],

        },
    }
);
export default GroupSchema;