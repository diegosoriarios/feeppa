import React, { useEffect, useState } from "react";
import { createBrowserRouter, Route, Routes } from "react-router-dom";
import UserContext from "../context/UserContext";
import useFirebase from "../hooks/useFirebase";
import FormPage from "../pages/Form";
import ListPage from "../pages/List";
import LoginPage from "../pages/Login";
import ModerationPage from "../pages/moderation";
import ProfilePage from "../pages/Profile";
import QuestionPage from "../pages/Question";

export const Router = () => {
  const firebase = useFirebase();
  const [userId, setUserId] = useState(null);
  const [isModerator, setModerator] = useState(null);

  useEffect(() => {
    firebase.initialize();
  }, []);

  return (
    <UserContext.Provider value={{
      userId,
      setUserId,
      isModerator,
      setModerator
    }}
    >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<ListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/moderation" element={<ModerationPage />} />
        <Route path="/:id" element={<QuestionPage />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </UserContext.Provider>
  );
}
