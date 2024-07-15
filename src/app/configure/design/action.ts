// action.ts module contains server-side logic RPC functions
// these functions encapsulate specific server-side operations or business logic that can be directly invoked from the client. They allow for a more flexible, function-based approach to handling requests (data processing, database operations, or other backend operations), often abstracting complex logic into reusable server-side functions. Additionally, this approach improves security by keeping the server-side code hidden from the client, ensuring that sensitive logic and data handling remain protected on the server.
"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";

// predefine type for given object
export type SaveConfigArgs = {
  configId: string;
  // only the values from the enum types are allowed in these props
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
};

// function responsible for saving configurations by the user (phone case color, material, finish and model)
// using this RPC (remote procedure call) pattern, you can perform actions on a DB without passing these parameters as URL params or inside of a POST request body or something like that. You can just pass these params as arguments to a server side function that does the action on the DB for you (this function pattern is called RPC)
export async function saveConfig({
  configId,
  color,
  finish,
  material,
  model,
}: SaveConfigArgs) {
  // update an existing 'configuration' object in the DB (table Configuration)
  await db.configuration.update({
    // update the record where its 'id' matches the given 'configId'
    where: { id: configId },
    // update the value of the fields 'model', 'material', 'finish' & 'color'
    data: { model, material, finish, color },
  });
}
