import {
  resolvers as generatedResolvers,
  crudResolvers,
} from "@generated/type-graphql";
import { NonEmptyArray } from "type-graphql";

export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  ...generatedResolvers,
  ...crudResolvers,
];
