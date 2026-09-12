import {CreateMasterTrekSchema} from "../validators/master-trek.validator.js";
import z from "zod";

export type CreateMasterTrekRequest = z.infer<
  typeof CreateMasterTrekSchema
>;
