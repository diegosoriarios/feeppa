import React from "react";
import { createBrowserRouter } from "react-router-dom";
import FormPage from "../pages/Form";
import ListPage from "../pages/List";
import LoginPage from "../pages/Login";
import ModerationPage from "../pages/moderation";
import ProfilePage from "../pages/Profile";
import QuestionPage from "../pages/Question";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <ListPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "/moderation",
    element: <ModerationPage />
  },
  {
    path: "/question",
    element: <QuestionPage />
  },
  {
    path: "/form",
    element: <FormPage />
  }
]);
