import { gql, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/userSlice";

export const UserQuery = gql`
  query User {
    user {
      id
      firstName
      lastName
      balance
      email
      photoUrl
      phoneNumber
      accountNumber
    }
  }
`;

const useUser = (fetchPolicy: boolean = false) => {
  const dispatch = useDispatch();
  const [getUser, others] = useLazyQuery(UserQuery, {
    fetchPolicy: fetchPolicy ? "network-only" : "cache-first",
    onCompleted: (data) => {
      dispatch(login(data.user));
    },
  });

  return { getUser, ...others };
};
export default useUser;
