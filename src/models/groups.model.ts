import { model } from "mongoose";
import GroupSchema from "./groups.schema";

export const GroupModel = model("groups", GroupSchema);