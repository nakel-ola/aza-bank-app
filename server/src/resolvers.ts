import merge from "lodash.merge";
import { transactionMutations, transactionQueries } from "./transaction";
import { userMutations, userQueries } from "./user";

const resolvers = {
  Query: merge({}, userQueries, transactionQueries),
  Mutation: merge({}, userMutations, transactionMutations),
};

export default merge(resolvers);
