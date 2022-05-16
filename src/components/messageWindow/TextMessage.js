import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaughBeam } from "@fortawesome/free-solid-svg-icons";
import { Picker } from "emoji-mart";
import useComponentVisible from "./useComponentVisible";
import "emoji-mart/css/emoji-mart.css";
import { useEffect, useRef, useState } from "react";
import { gql, useMutation, useSubscription } from "@apollo/client";

const NEW_MESSAGE = gql`
  subscription updateMessage {
    updateMessage {
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

const UPDATE_MESSAGE = gql`
  mutation updateMessage($message: GetMessage!) {
    updateMessage(input: $message) {
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

const TextMessage = ({ messageArray, setMessageArray, user }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [messageID, setMessageID] = useState(0);
  const messagesEndRef = useRef(null);
  const [updateMessage, { data }] = useMutation(UPDATE_MESSAGE);
  const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE);
  useEffect(() => {
    if (messageData) {
      let message = messageData.updateMessage[messageData.updateMessage.length - 1];
      let temp = JSON.parse(JSON.stringify(messageArray));
      try {
        temp.map((obj) => {
          if (
            obj.createdAt === message.createdAt &&
            obj.member.nickname === message.member.nickname
          )
            obj.emoji = message.emoji;
        });
        setMessageArray([...temp]);
      } catch (err) {
        console.log(err);
      }
    }
  }, [messageData]);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messageArray]);

  const getMessageID = (i) => {
    setMessageID(i);
    setIsComponentVisible(!isComponentVisible);
  };

  if (!messageArray) return <div />;
  return (
    <div
      id='test'
      style={container}
      ref={ref}
      onClick={() => (isComponentVisible ? setIsComponentVisible(false) : null)}>
      {messageArray.map((el, i) => {
        if (el)
          return (
            <div key={i} style={messageFormat}>
              <img style={profilePic} src={el.member.image} alt='User profile pic' />
              <div style={messageContainer}>
                <div
                  style={{
                    ...nameAndDateContainer,
                    color: el.member.color,
                  }}>
                  <div>
                    {el.member.nickname} <span style={date}>{el.createdAt}</span>{" "}
                  </div>
                  <FontAwesomeIcon
                    key={i}
                    messageid={i}
                    style={icon}
                    icon={faLaughBeam}
                    onClick={() => getMessageID(i)}
                  />
                </div>
                <div>{el.content}</div>
                {el.emoji && el.emoji.length > 0 ? (
                  <div style={emojiFormat}>
                    {el.emoji.map((emojiEl, j) => {
                      let hasReactedToEmoji = emojiEl.memberID.filter(
                        (obj) => obj === user.nickname + user.createdAt
                      );
                      return (
                        <div
                          key={j}
                          style={
                            hasReactedToEmoji.length > 0
                              ? {
                                  ...emojiContainerSelected,
                                  borderColor:
                                    user.color.substring(0, user.color.length - 3) + ".4)",
                                }
                              : {}
                          }
                          className={hasReactedToEmoji.length > 0 ? "emojiHover" : "emojiContainer"}
                          onClick={(e) => {
                            let messageID = i;
                            let messageTemp = JSON.parse(JSON.stringify(messageArray));
                            let id = user.nickname + user.createdAt;
                            let emoji = e.target.innerText.split(" ");
                            emoji = emoji[emoji.length - 1];
                            console.log(messageTemp[messageID], emoji);

                            let filterEmoji = messageTemp[messageID].emoji.map((obj, i) => {
                              let emojiExist = false; //variable to check if member already reacted with this emoji
                              if (obj.emojiCode === emoji) {
                                obj.memberID.map((element, j) => {
                                  //check if member already added the emoji, if so remove them,
                                  if (element === id) {
                                    emojiExist = true;
                                    //if there is only one name in memberID, delete the entire emoji object
                                    if (obj.memberID.length === 1) {
                                      messageTemp[messageID].emoji.splice(i, 1);
                                    } else {
                                      //else delete the id inside of memberID that matches
                                      messageTemp[messageID].emoji[i].memberID.splice(j, 1);
                                    }
                                  }
                                });
                              }
                              //increment emoji count for that existing emoji
                              if (!emojiExist && obj.emojiCode === emoji) {
                                messageTemp[messageID].emoji[i].memberID.push(id);
                              }
                              return obj;
                            });
                            // //add emoji if it is unique
                            // if (addNewEmoji)
                            //   messageTemp[messageID].emoji.push({
                            //     memberID: [id],
                            //     emojiCode: e.native,
                            //   });
                            const newMessage = {
                              _id: messageTemp[messageID]._id,
                              member: {
                                _id: messageTemp[messageID]._id,
                                nickname: messageTemp[messageID].member.nickname,
                                color: messageTemp[messageID].member.color,
                                image: messageTemp[messageID].member.image,
                                createdAt: "432897",
                              },
                              content: messageTemp[messageID].content,
                              createdAt: messageTemp[messageID].createdAt,
                              emoji: messageTemp[messageID].emoji,
                              channelName: messageTemp[messageID].channelName
                                ? messageTemp[messageID].channelName
                                : "Kanto",
                            };
                            updateMessage({ variables: { message: newMessage } });

                            setMessageArray(messageTemp);
                          }}>
                          {emojiEl.memberID.length > 1 ? emojiEl.memberID.length : null}{" "}
                          {emojiEl.emojiCode}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          );
      })}
      {isComponentVisible ? (
        <Picker
          style={picker}
          set='twitter'
          showSkinTones={true}
          title=''
          emoji=''
          theme='dark'
          emojiSize={30}
          onSelect={(e) => {
            let messageTemp = JSON.parse(JSON.stringify(messageArray));
            let id = user.nickname + user.createdAt;
            let addNewEmoji = true; //variable that checks if the emoji being added is unique in message

            let filterEmoji = messageTemp[messageID].emoji.map((obj, i) => {
              let emojiExist = false; //variable to check if member already reacted with this emoji
              if (obj.emojiCode === e.native) {
                obj.memberID.map((element, j) => {
                  //check if member already added the emoji, if so remove them,
                  if (element === id) {
                    emojiExist = true;
                    addNewEmoji = false;
                    //if there is only one name in memberID, delete the entire emoji object
                    if (obj.memberID.length === 1) {
                      messageTemp[messageID].emoji.splice(i, 1);
                    } else {
                      //else delete the id inside of memberID that matches
                      messageTemp[messageID].emoji[i].memberID.splice(j, 1);
                    }
                  }
                });
              }
              //increment emoji count for that existing emoji
              if (!emojiExist && obj.emojiCode === e.native) {
                messageTemp[messageID].emoji[i].memberID.push(id);
                addNewEmoji = false;
              }
              return obj;
            });
            //add emoji if it is unique
            if (addNewEmoji)
              messageTemp[messageID].emoji.push({
                memberID: [id],
                emojiCode: e.native,
              });
            const newMessage = {
              _id: messageTemp[messageID]._id,
              member: {
                _id: messageTemp[messageID]._id,
                nickname: messageTemp[messageID].member.nickname,
                color: messageTemp[messageID].member.color,
                image: messageTemp[messageID].member.image,
                createdAt: "432897",
              },
              content: messageTemp[messageID].content,
              createdAt: messageTemp[messageID].createdAt,
              emoji: messageTemp[messageID].emoji,
              channelName: messageTemp[messageID].channelName
                ? messageTemp[messageID].channelName
                : "Kanto",
            };
            updateMessage({ variables: { message: newMessage } });

            setMessageArray(messageTemp);
          }}
        />
      ) : null}
      <div ref={messagesEndRef} />
    </div>
  );
};

const emojiContainerSelected = {
  border: "1px solid hsla(0, 0%, 24%, 1)",
  cursor: "pointer",
  borderRadius: 5,
  marginRight: 5,
  padding: "3px 7px",
};

const container = {
  width: "100%",
  height: "90vh",
  overflowY: "scroll",
};

const messageFormat = {
  display: "flex",
  padding: "1%",
};

const emojiFormat = {
  display: "flex",
  padding: "1%",
  flexWrap: "wrap",
};

const nameAndDateContainer = {
  display: "flex",
  justifyContent: "space-between",
};

const profilePic = {
  marginRight: 10,
  borderRadius: 100,
  width: 50,
  height: 50,
};

const messageContainer = {
  position: "relative",
  width: "90%",
  color: "hsla(0, 0%, 80%, .9)",
  lineHeight: 1.5,
  wordBreak: "break-all",
};

const date = {
  fontSize: 12,
  marginLeft: 5,
  color: "hsla(0, 0%, 40%, 1)",
};

const icon = {
  position: "relative",
  fontSize: 25,
  color: "hsla(0, 0%, 19%, 1)",
  cursor: "pointer",
  marginRight: 10,
};

const picker = {
  position: "absolute",
  bottom: 80,
  right: 10,
};

export default TextMessage;
