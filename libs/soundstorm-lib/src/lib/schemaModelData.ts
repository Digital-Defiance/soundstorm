import { ModelName } from './enumerations/modelName';
import { ModelNameCollection } from './enumerations/modelNameCollection';
import { UserSchema } from './schemas/user';
import { ISchemaModelData } from './interfaces/schemaModelData';
import { UserSoundSchema } from './schemas/userSound';

function modelNameCollectionToPath(
  modelNameCollection: ModelNameCollection,
): string {
  return `/${modelNameCollection as string}`;
}

/**
 * The schema for all models in the system.
 * This includes the name, description, plural name, and api name of each model.
 */
export const ModelData: ISchemaModelData = {
  User: {
    name: ModelName.User,
    description: 'A user in the system.',
    collection: ModelNameCollection.User,
    schema: UserSchema,
    path: modelNameCollectionToPath(ModelNameCollection.User),
  },
  UserSound: {
    name: ModelName.UserSound,
    description: 'A sound that a user has saved from their komplete db.',
    collection: ModelNameCollection.UserSound,
    schema: UserSoundSchema,
    path: modelNameCollectionToPath(ModelNameCollection.UserSound),
  },
};
