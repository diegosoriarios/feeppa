import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { isModerator } = useContext(UserContext);
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div>
          <a className="navbar-brand" href="/home">AADA</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav d-flex justify-content-end">
            <a className={`nav-link ${location.pathname === "/home" ? "active" : ""}` } aria-current="page" href="/home">Recursos de ajuda</a>
            <a className={`nav-link ${location.pathname === "/profile" ? "active" : ""} border-start` } href="/profile">Perfil</a>
            <a className="nav-link border-start" href="/moderation">Curadoria</a>
            <a className="nav-link btn btn-primary text-white" href="/form">Novo post</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
