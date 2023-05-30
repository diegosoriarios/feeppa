import React from "react";
import Navbar from "./navbar";

const Loading = () => (
  <section className="w-100">
    <Navbar />
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  </section>
);

export default Loading;
