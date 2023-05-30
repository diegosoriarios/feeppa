import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal, Overlay, Tooltip } from "react-bootstrap";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import useFirebase from "../hooks/useFirebase";
import { v4 as uuidv4 } from "uuid";

const Navbar = () => {
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showErrorMessage, setErrorMessage] = useState(false);
  const [code, setCode] = useState("");

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const location = useLocation();
  const firebase = useFirebase();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const userId = localStorage.getItem("userId");
    if (!user && !!userId) {
      handleLogout();
    }
  }

  const handleShowModal = () => {
    if (user?.papelCurador) generateRandomCode();
    setShow(true);
  };

  const generateRandomCode = async () => {
    const randomCode = uuidv4();
    let date = new Date();

    date.setDate(date.getDate() + 1);

    const body = {
      code: randomCode,
      validation: date,
    };

    setCode(randomCode);
    await firebase.create("moderation_code", body);
  };

  const handleLogout = async () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleCloseModal = () => setShow(false);

  const handleClipboardButton = async () => {
    if (user?.papelCurador) {
      navigator.clipboard.writeText(code);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 1000);
    } else {
      const text = await navigator.clipboard.readText();

      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 1000);

      setCode(text);
    }
  };

  const checkCode = async (code) => {
    const docs = await firebase.read("moderation_code");
    const items = [];

    docs?.forEach((doc) => {
      const values = {
        values: doc.data().values,
        id: doc.id,
      };
      items.push(values);
    });

    const codeIsValid = items.filter((item) => {
      const date = new Date().getTime();
      const codeDate = new Date(item.values.validation * 1000).getTime();
      const isValid = date <= codeDate;
      return item.values.code === code && isValid;
    });

    if (!!codeIsValid.length) {
      user.papelCurador = true;
      const userId = localStorage.getItem("userId");
      const docs = await firebase.find("user", userId, "values.id");

      let id;
      docs?.forEach((doc) => {
        id = doc.id;
      });
      await firebase.update("user", { values: user }, id);
      await firebase.remove("moderation_code", codeIsValid[0].id);
      navigate("/moderation");
    } else {
      setErrorMessage(true);
    }
  };

  if (!user) return <></>;

  return (
    <>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Código de curador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Adicione o código de curador.</p>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={code}
              disabled={user?.papelCurador}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="input-group-append">
              <button
                ref={target}
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleClipboardButton}
              >
                <FontAwesomeIcon icon={faClipboard} />
              </button>
              <Overlay target={target.current} show={show} placement="right">
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    {user?.papelCurador
                      ? "Item copiado para o clipboard"
                      : "Código colado"}
                  </Tooltip>
                )}
              </Overlay>
            </div>
          </div>
          {showErrorMessage && <p className="text-danger">Código inválido</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          {!user?.papelCurador && (
            <Button variant="secondary" onClick={() => checkCode(code)}>
              Adicionar Código
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <div>
            <Link
              className="navbar-brand"
              href="#"
              onClick={() => navigate("/home")}
            >
              RELP
            </Link>
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
          <div
            className="collapse navbar-collapse d-flex justify-content-between"
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav d-flex justify-content-start">
              <a
                className={`nav-link ${
                  location.pathname === "/home" ? "active" : ""
                }`}
                aria-current="page"
                href="#"
                onClick={() => navigate("/home")}
              >
                Recursos de ajuda
              </a>
              { user.papelCurador &&
                <a
                  className="nav-link border-start"
                  href="#"
                  onClick={() => navigate("/moderation")}
                >
                  Curadoria
                </a>
              }
              <a
                className="nav-link btn btn-primary text-white"
                href="#"
                onClick={() => navigate("/form")}
              >
                Inserir conteúdo
              </a>
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {user?.nome}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {user?.papelCurador ? (
                    <Dropdown.Item href="#" onClick={handleShowModal}>
                      Gerar item codigo de curador
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item href="#" onClick={handleShowModal}>
                      Adicionar codigo de curador
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item href="#" onClick={() => navigate("/profile")}>
                    Perfil
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <a className="nav-link ms-4" onClick={handleLogout} href="#">
                Sair
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
