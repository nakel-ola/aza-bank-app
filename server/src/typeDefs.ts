import { mergeTypeDefs } from "@graphql-tools/merge";
import gql from "graphql-tag";

import { userTypes } from "./user";
import { transactionTypes } from "./transaction";

var rootTypes = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const types = [rootTypes, userTypes,transactionTypes];

export default mergeTypeDefs(types);
