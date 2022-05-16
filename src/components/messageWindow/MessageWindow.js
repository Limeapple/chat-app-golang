import Textbox from "./Textbox";
import TextMessage from "./TextMessage";
import { useState, useEffect } from "react";
import { gql, useMutation, useSubscription } from "@apollo/client";

const NEW_MESSAGE = gql`
  subscription Messages {
    Messages {
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
      channelName
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($message: GetMessage!) {
    sendMessage(input: $message) {
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
      channelName
    }
  }
`;
let id = 0;

const MessageWindow = ({ user, messageArray, setMessageArray, selectRoom }) => {
  // const [messageArray, setMessageArray] = useState(messageArray);
  const [sendMessages, { data }] = useMutation(SEND_MESSAGE);

  const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE, {
    // onSubscriptionData: (data) => {
    //   console.log(
    //     data.subscriptionData.data.Messages[data.subscriptionData.data.Messages.length - 1],
    //     "data"
    //   );
    //   try {
    //     let message =
    //       data.subscriptionData.data.Messages[data.subscriptionData.data.Messages.length - 1];
    //     // console.log(messageArray[messageArray.length - 1], message, messageData);
    //     //check that messages are in the appropriate room and pnly new messages are sent
    //     if (
    //       message.channelName !== selectRoom &&
    //       message.id === messageArray[messageArray.length - 1].id
    //     )
    //       return;
    //     if (!message.emoji) message.emoji = [];
    //     message._id = id.toString();
    //     setMessageArray([...messageArray, message]);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
  });
  useEffect(() => {
    if (messageData) {
      console.log(messageArray, messageData);

      try {
        let message = messageData.Messages[messageData.Messages.length - 1];
        //check that messages are in the appropriate room and pnly new messages are sent
        if (
          message.channelName !== selectRoom &&
          message.id === messageArray[messageArray.length - 1].id
        )
          return;

        if (!message.emoji) message.emoji = [];
        message._id = id.toString();
        setMessageArray([...messageArray, message]);
      } catch (err) {
        console.log(err);
      }
    }
  }, [messageData]);

  const sendMessage = (content, createdAt) => {
    id = parseInt(Math.random() * 1000000000);
    const newMessage = {
      _id: id.toString(),
      member: {
        _id: id.toString(),
        nickname: user.nickname,
        color: user.color,
        image: user.image,
        createdAt: user.createdAt,
      },
      content,
      createdAt,
      emoji: [],
      channelName: selectRoom,
    };
    sendMessages({ variables: { message: newMessage } });
  };

  return (
    <div style={container}>
      <TextMessage user={user} messageArray={messageArray} setMessageArray={setMessageArray} />
      <Textbox sendMessage={sendMessage} />
    </div>
  );
};

const container = {
  width: "80%",
  height: "100vh",
  position: "relative",
};

export default MessageWindow;
