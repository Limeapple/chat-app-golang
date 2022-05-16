import Profile from "./Profile";
import RoomList from "./RoomList";
const leftSideBar = ({ user, setSelectRoom, selectRoom }) => {
  return (
    <div style={container}>
      <Profile user={user} selectRoom={selectRoom} />
      <RoomList setSelectRoom={setSelectRoom} selectRoom={selectRoom} />
    </div>
  );
};

const container = {
  background: "hsla(0, 0%, 13%, 1)",
  width: "20%",
  height: "100vh",
  overflowY: "auto",
  overflowX: "hidden",
};

export default leftSideBar;
