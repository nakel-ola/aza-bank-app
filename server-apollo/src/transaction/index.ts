import depositTransaction from "./deposit-transaction";
import sendTransaction from "./send-transaction";
import transactions from "./transactions";
import types from "./types";

const transactionQueries = {
  transactions,
};
const transactionMutations = {
  sendTransaction,
  depositTransaction,
};

const transactionTypes = types;

export { transactionQueries, transactionMutations, transactionTypes };
