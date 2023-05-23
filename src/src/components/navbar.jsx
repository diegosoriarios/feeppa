import React, { useContext } from "react";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const { isModerator } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div>
          <a className="navbar-brand" href="/home">Feepa</a>
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
            <a className="nav-link active" aria-current="page" href="/home">Lista</a>
            <a className="nav-link" href="/profile">Perfil</a>
            <a className="nav-link" href="/moderation">Curadoria</a>
            <a className="nav-link btn btn-primary text-white" href="/form">Novo post</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
