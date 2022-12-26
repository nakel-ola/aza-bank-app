import gql from "graphql-tag";

const types = gql`
  scalar DateTime

  type Transaction {
    id: ID!
    amount: Float!
    description: String
    receiverId: String!
    receiverName: String!
    senderId: String!
    senderName: String!
    type: String!
    balanceAtCompletion: Float!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TransactionsType {
    page: Int!
    totalItems: Int!
    results: [Transaction!]!
  }

  input GetTransactionsInput {
    page: Int!
    limit: Int!
  }

  input SendTransactionInput {
    accountNumber: Float!
    accountName: String!
    amount: Float!
    description: String
  }

  input DepositTransactionInput {
    amount: Float!
    description: String
  }

  extend type Query {
    transactions(input: GetTransactionsInput!): TransactionsType!
  }
  extend type Mutation {
    sendTransaction(input: SendTransactionInput!): MessageType!
    depositTransaction(input: DepositTransactionInput!): MessageType!
  }
`;
export default types;
