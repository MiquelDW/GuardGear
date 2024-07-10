// action.ts contain server-side logic functions
"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";
import { config } from "process";

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
// using this RPC (remote procedure call) pattern, you can perform actions on a DB without passing these parameters as URL params or inside of a POST request body or something like that. You can just pass these params as arguments to a function that does the action on the DB for you (this function pattern is called RPC)
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
