const RoomList = ({ selectRoom, setSelectRoom }) => {
  return (
    <div style={container}>
      <h4>Channels</h4>
      <ul style={{ position: "relative", right: 30 }}>
        <li
          style={selectRoom === "Kanto" ? listSelected : list}
          onClick={() => setSelectRoom("Kanto")}>
          Kanto
        </li>
        <li
          style={selectRoom === "Johto" ? listSelected : list}
          onClick={() => setSelectRoom("Johto")}>
          Johto
        </li>
        <li
          style={selectRoom === "Hoenn" ? listSelected : list}
          onClick={() => setSelectRoom("Hoenn")}>
          Hoenn
        </li>
        <li
          style={selectRoom === "Sinnoh" ? listSelected : list}
          onClick={() => setSelectRoom("Sinnoh")}>
          Sinnoh
        </li>
        <li
          style={selectRoom === "Unova" ? listSelected : list}
          onClick={() => setSelectRoom("Unova")}>
          Unova
        </li>
        <li
          style={selectRoom === "Kalos" ? listSelected : list}
          onClick={() => setSelectRoom("Kalos")}>
          Kalos
        </li>
        <li
          style={selectRoom === "Alola" ? listSelected : list}
          onClick={() => setSelectRoom("Alola")}>
          Alola
        </li>
        <li
          style={selectRoom === "Galar" ? listSelected : list}
          onClick={() => setSelectRoom("Galar")}>
          Galar
        </li>
      </ul>
    </div>
  );
};

const container = {
  position: "relative",
  top: -70,
  left: 15,
  margin: 0,
  fontSize: 18,
  padding: 5,
  paddingLeft: 5,
  color: "hsla(0, 0%, 40%, 1)",
};

const list = {
  padding: 5,
  color: "hsla(0, 0%, 40%, 1)",
  cursor: "pointer",
  listStyle: "none",
};

const listSelected = {
  padding: 5,
  color: "hsla(0, 0%, 70%, 1)",
  cursor: "pointer",
  listStyle: "none",
  backgroundColor: "hsla(0, 0%, 18%, 1)",
};

export default RoomList;
