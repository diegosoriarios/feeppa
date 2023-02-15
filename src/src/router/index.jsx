import React from "react";
import { createBrowserRouter, Route, Routes } from "react-router-dom";
import FormPage from "../pages/Form";
import ListPage from "../pages/List";
import LoginPage from "../pages/Login";
import ModerationPage from "../pages/moderation";
import ProfilePage from "../pages/Profile";
import QuestionPage from "../pages/Question";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<ListPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/moderation" element={<ModerationPage />} />
      <Route path="/question" element={<QuestionPage />} />
      <Route path="/form" element={<FormPage />} />
    </Routes>
  );
}
