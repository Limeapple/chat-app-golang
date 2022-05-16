import { useState, useEffect } from "react";
import LeftSideBar from "./components/leftSideBar/LeftSideBar";
import MessageWindow from "./components/messageWindow/MessageWindow";
import { CreateUser } from "./graphql/CreateUser";
import { useQuery, gql } from "@apollo/client";

function App() {
  const [selectRoom, setSelectRoom] = useState("Kanto");
  const [messageArray, setMessageArray] = useState([]);

  const GET_MESSAGE = gql`
    query getMessage($selectRoom: String!) {
      getMessage(selectRoom: $selectRoom) {
        _id
        member {
          nickname
          color
          image
        }
        content
        createdAt
        channelName
        emoji {
          memberID
          emojiCode
        }
      }
    }
  `;

  const { createUserLoading, createUserError, createUserData } = CreateUser();

  const {
    loading: getMessageLoading,
    error: getMessageError,
    data: getMessageData,
  } = useQuery(GET_MESSAGE, {
    fetchPolicy: "network-only",
    variables: { selectRoom },
  });
  useEffect(() => {
    // do some checking here to ensure data exist
    // mutate data if you need to
    if (getMessageData) {
      setMessageArray(getMessageData.getMessage);
    }
  }, [getMessageData]);

  if (createUserLoading || getMessageLoading) return <p>Loading...</p>;
  if (createUserError || getMessageError) return <p>Error :(</p>;

  let user = JSON.parse(localStorage.getItem("User_Info"));
  if (!user || new Date().valueOf() > parseFloat(user.createdAt) + 86400000) {
    user = createUserData.createMember;
    localStorage.setItem("User_Info", JSON.stringify(user));
  }

  return (
    <div style={container}>
      <LeftSideBar user={user} setSelectRoom={setSelectRoom} selectRoom={selectRoom} />
      <MessageWindow
        user={user}
        messageArray={messageArray}
        setMessageArray={setMessageArray}
        selectRoom={selectRoom}
      />
    </div>
  );
}

const container = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
};

export default App;
