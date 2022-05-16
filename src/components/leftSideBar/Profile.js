import alolaStarter from "./img/alola-starter.png";
import sinnohStarter from "./img/sinnoh-starter.jpg";

const Profile = ({ user, selectRoom }) => {
  const wallpaper = {
    Kanto:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/21369a06-eaf5-43b7-a2c8-33132d9e8c3a/dbp9jnm-dbacc28a-ebc7-4c55-af94-61199eb19f19.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzIxMzY5YTA2LWVhZjUtNDNiNy1hMmM4LTMzMTMyZDllOGMzYVwvZGJwOWpubS1kYmFjYzI4YS1lYmM3LTRjNTUtYWY5NC02MTE5OWViMTlmMTkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.pP4Lm9VAOQ7KRNRQeIfCplWJ-L41RIx1l6aCh9SkpeA",
    Johto:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/21369a06-eaf5-43b7-a2c8-33132d9e8c3a/dboqf5g-aa97b813-fa82-4bc3-8778-9781c2257ffc.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzIxMzY5YTA2LWVhZjUtNDNiNy1hMmM4LTMzMTMyZDllOGMzYVwvZGJvcWY1Zy1hYTk3YjgxMy1mYTgyLTRiYzMtODc3OC05NzgxYzIyNTdmZmMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dyApslXsJfceqH0gLSjnoR2AUVkBuZYu59OWHcy47Dk",
    Hoenn:
      "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgetwallpapers.com%2Fwallpaper%2Ffull%2F6%2Fc%2F9%2F761139-mudkip-wallpapers-2450x1500-for-android-50.jpg&f=1&nofb=1",
    Sinnoh: sinnohStarter,
    Unova: "https://wallpapercave.com/wp/wp7582577.jpg",
    Kalos:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1733aa4c-c30e-4ecc-b8d6-80ef83ca0b8e/d6dagh4-9f785386-0373-4eff-a198-e56401cb7e63.png/v1/fill/w_1024,h_626,strp/starter_s_kalos_region_by_pklucario_d6dagh4-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjI2IiwicGF0aCI6IlwvZlwvMTczM2FhNGMtYzMwZS00ZWNjLWI4ZDYtODBlZjgzY2EwYjhlXC9kNmRhZ2g0LTlmNzg1Mzg2LTAzNzMtNGVmZi1hMTk4LWU1NjQwMWNiN2U2My5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.4W9kBu-DKJGcXDjd_LQEyinw8UNYOPioa-AOCy2ladU",
    Alola: alolaStarter,
    Galar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fxawv9cv16kr31.png&f=1&nofb=1",
  };
  return (
    <div>
      <img style={img} src={wallpaper[selectRoom]} alt='Wallpaper of pokemon region' />
      <div style={profileContainer}>
        <img style={profilePic} src={user.image} alt='Pic of Pokemon' />
        <div style={{ ...profileName, color: user.color }}>{user.nickname}</div>
      </div>
    </div>
  );
};

const img = {
  width: "100%",
  height: 200,
};

const profileContainer = {
  position: "relative",
  top: -75,
};

const profilePic = {
  display: "block",
  margin: "auto",
  borderRadius: 100,
  width: 175,
  height: 175,
  background: "hsla(0, 0%, 13%, 1)",
};

const profileName = {
  textAlign: "center",
  padding: 5,
  fontSize: 20,
};

export default Profile;
