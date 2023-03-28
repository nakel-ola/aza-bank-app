import { GraphQLError } from "graphql/error";

const ErrorHandler = (err: any) => {
  if (err.errors) {
    const errorMsg = err.errors.map((error) => error.message).join(",");
    throw new GraphQLError(errorMsg);
  } else {
    throw new GraphQLError(err.message);
  }
};

export default ErrorHandler;
