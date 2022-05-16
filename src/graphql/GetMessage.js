import { useQuery, gql } from "@apollo/client";

export const GetMessage = () => {
  const GET_MESSAGE = gql`
    query getMessage($input: String!) {
      getMessage(input: $input) {
        _id
        member {
          nickname
          color
          image
        }
        content
        createdAt
        emoji {
          memberID
          emojiCode
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_MESSAGE);
  return { getMessageLoading: loading, getMessageError: error, getMessageData: data };
};
