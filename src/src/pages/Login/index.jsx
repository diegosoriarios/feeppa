import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <Link href="/home" className="btn btn-primary">Login with google</Link>
  );
};

export default LoginPage;
