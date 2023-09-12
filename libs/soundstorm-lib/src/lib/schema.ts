// file: schema.ts
// description: This file contains the schema for all models in the system
// ---------------------------------------------------------------------------------------------
import { ModelName } from './enumerations/modelName';
import { IUser } from './interfaces/user';
import { BaseModel } from './models/baseModel';
import { ISchemaModels } from './interfaces/schemaModels';
import { ModelData } from './schemaModelData';
import { IUserSound } from './interfaces/userSound';

export const SchemaModels: ISchemaModels = {
  User: BaseModel.create<IUser>(ModelData[ModelName.User]).Model,
  UserSound: BaseModel.create<IUserSound>(ModelData[ModelName.UserSound]).Model,
};
