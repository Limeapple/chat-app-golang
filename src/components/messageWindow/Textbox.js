import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaughBeam } from "@fortawesome/free-solid-svg-icons";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import useComponentVisible from "./useComponentVisible";
import { useState } from "react";
import moment from "moment";

const Textbox = ({ sendMessage }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [textMessage, setTextMessage] = useState("");

  return (
    <div ref={ref} style={container}>
      <TextareaAutosize
        style={textbox}
        maxRows={1}
        placeholder='Speak your mind'
        onChange={(e) => setTextMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && textMessage.trim() !== "") {
            setIsComponentVisible(false);
            e.preventDefault();
            sendMessage(textMessage, moment().format("ddd M/D/YY h:mm:ss A"));
            setTextMessage("");
          }
        }}
        value={textMessage}
      />
      <FontAwesomeIcon
        style={icon}
        icon={faLaughBeam}
        onClick={() => {
          setIsComponentVisible(!isComponentVisible);
        }}
      />
      {isComponentVisible ? (
        <Picker
          title=''
          emoji=''
          style={picker}
          set='twitter'
          showSkinTones={true}
          theme='dark'
          emojiSize={30}
          onSelect={(e) => setTextMessage(textMessage + e.native)}
        />
      ) : null}
    </div>
  );
};

const container = {
  width: "100%",
  display: "flex",
};

const textbox = {
  width: "85%",
  resize: "none",
  display: "block",
  margin: "auto",
  background: "hsla(0, 0%, 19%, 1)",
  border: "0px solid hsla(0, 0%, 13%, 1)",
  borderRadius: 10,
  fontSize: 16,
  padding: 15,
  outline: "none",
  color: "hsla(0, 0%, 80%, .9)",
};

const picker = {
  position: "absolute",
  bottom: 80,
  right: 10,
};

const icon = {
  fontSize: 40,
  alignSelf: "center",
  margin: "auto",
  marginLeft: 0,
  color: "hsla(0, 0%, 19%, 1)",
  cursor: "pointer",
};

export default Textbox;
