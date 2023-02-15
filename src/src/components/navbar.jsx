import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div>
          <a className="navbar-brand" href="/home">Navbar</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav d-flex justify-content-end">
            <a className="nav-link active" aria-current="page" href="/home">Lista</Link>
            <a className="nav-link" href="/profile">Perfil</Link>
            <a className="nav-link" href="/moderation">Curadoria</Link>
            <a className="nav-link btn btn-primary text-white" href="/form">Novo post</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
