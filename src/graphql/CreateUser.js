import { useQuery, gql } from "@apollo/client";

export const CreateUser = () => {
  const CREATE_USER = gql`
    query createMember {
      createMember {
        nickname
        color
        image
        createdAt
      }
    }
  `;
  const { loading, error, data } = useQuery(CREATE_USER);
  return { createUserLoading: loading, createUserError: error, createUserData: data };
};
