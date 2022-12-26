import { gql } from "graphql-tag";

const types = gql`
  input RegisterInput {
    firstName: String!
    lastName: String!
    phoneNumber: String!
    password: String!
    email: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ValidateCodeInput {
    email: String!
    validationToken: String!
  }

  input ChangePasswordInput {
    email: String!
    validationToken: String!
    password: String!
  }

  type UserType {
    id: ID!
    firstName: String!
    lastName: String!
    balance: String!
    email: String!
    phoneNumber: String!
    accountNumber: Float!
    photoUrl: String
  }

  type TokenType {
    access_token: String!
  }

  type MessageType {
    message: String!
  }

  type ValidateType {
    validate: Boolean!
  }

  extend type Query {
    user: UserType!
  }

  extend type Mutation {
    register(input: RegisterInput!): TokenType!
    login(input: LoginInput!): TokenType!
    forgetPassword(email: String!): MessageType!
    validateCode(input: ValidateCodeInput!): ValidateType!
    changePassword(input: ChangePasswordInput!): TokenType!
  }
`;

export default types;
