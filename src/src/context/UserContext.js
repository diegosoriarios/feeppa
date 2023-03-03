import { createContext } from "react";

const UserContext = createContext({
  userId: null,
  setUserId: () => {},
  isModerator: false,
  setModerator: () => {},
});

export default UserContext;