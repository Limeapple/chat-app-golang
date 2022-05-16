import { gql, useMutation, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";

const RightSideBar = ({ user }) => {
  const [onlineArray, setOnlinArray] = useState([]);
  const ONLINE = gql`
    subscription online {
      online {
        user {
          nickname
          color
          image
        }
      }
    }
  `;

  const IS_ONLINE = gql`
    mutation isOnline($isOnline: Boolean!, $user: GetUser!, $list: [GetUser]!) {
      isOnline(isOnline: $isOnline, user: $user, list: $list) {
        user {
          nickname
          color
          image
        }
      }
    }
  `;

  const [isOnline] = useMutation(IS_ONLINE);

  const { data } = useSubscription(ONLINE);
  useEffect(() => {
    if (onlineArray.filter((item) => JSON.stringify(item) === JSON.stringify(user)).length === 1)
      isOnline(false, user, onlineArray);
  }, [data]);
  return (
    <div style={container}>
      <div style={online}>Online</div>
      <div style={profileContainer}>
        <div>
          <img style={profilePic} src={user.image} alt='Pic of Pokemon' />
          <div style={{ ...profileName, color: user.color }}>{user.nickname}</div>
        </div>
      </div>
    </div>
  );
};

const container = {
  background: "hsla(0, 0%, 13%, 1)",
  width: "20%",
  height: "100vh",
  overflowY: "scroll",
};

const online = {
  padding: 20,
  fontSize: 20,
};

const profileContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
};

const profilePic = {
  display: "block",
  margin: "auto",
  borderRadius: 100,
  width: 50,
  height: 50,
};

const profileName = {
  textAlign: "center",
  padding: 5,
  fontSize: 14,
  marginBottom: 10,
};
export default RightSideBar;
