import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../components/navbar";
import UserContext from "../../context/UserContext";
import useFirebase from "../../hooks/useFirebase";
import Badges from "../../components/badges";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faGear } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Modal, Overlay, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showErrorMessage, setErrorMessage] = useState(false);
  const [code, setCode] = useState("");
  const [user, setUser] = useState({});
  const [ranking, setRanking] = useState({
    contribuicoes: 0,
    curadoria: 0,
    perguntas: 0,
  });
  const firebase = useFirebase();
  const navigate = useNavigate();

  const getUser = async () => {
    const userId = localStorage.getItem("userId");
    const docs = await firebase.read("user");
    const items = [];

    docs?.forEach((doc) => {
      items.push(doc.data().values);
      if (doc.data().values.id === userId) {
        setUser(doc.data().values);
      }
    });
    getRanking(items, userId);
  };

  const getRanking = (allUsers, userId) => {
    allUsers.sort((a, b) => {
      return b.contribuicoesCount - a.contribuicoesCount;
    });
    const contribuitionRanking = allUsers.findIndex(
      (item) => item.id === userId
    );

    allUsers.sort((a, b) => {
      return b.curadoriaCount - a.curadoriaCount;
    });
    const curadoriaRanking = allUsers.findIndex((item) => item.id === userId);

    allUsers.sort((a, b) => {
      return b.perguntasCount - a.perguntasCount;
    });
    const perguntasRanking = allUsers.findIndex((item) => item.id === userId);

    setRanking({
      contribuicoes: contribuitionRanking + 1,
      curadoria: curadoriaRanking + 1,
      perguntas: perguntasRanking + 1,
    });
  };

  const handleShowModal = () => {
    if (user.papelCurador)
      generateRandomCode();
    setShow(true);
  };

  const handleCloseModal = () => setShow(false);
  
  const handleClipboardButton = async () => {
    if (user.papelCurador) {
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
  }

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
      const docs = await firebase.find('user', userId, 'values.id');
    
      let id;
      docs?.forEach((doc) => {
        id = doc.id
      });
      await firebase.update('user', { values: user }, id);
      await firebase.remove('moderation_code', codeIsValid[0].id);
      navigate("/moderation");
    } else {
      setErrorMessage(true);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <section>
      <Navbar />

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Código de moderador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Diga o motivo para rejeitar a contribuição</p>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={code}
              disabled={user.papelCurador}
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
                  {
                    user.papelCurador ? "Item copiado para o clipboard" : "Código colado"
                  }
                </Tooltip>
              )}
            </Overlay>
            </div>
          </div>
          {showErrorMessage && (<p className="text-danger">Código inválido</p>)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          {
            !user.papelCurador && (
              <Button variant="secondary" onClick={() => checkCode(code)}>
                Adicionar Código
              </Button>
            )
          }
        </Modal.Footer>
      </Modal>

      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-12 col-xl-8">
            <div className="card bg-light" style={{ borderRadius: "15px" }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    referrerPolicy="no-referrer"
                    src={user.avatar}
                    className="rounded-circle img-fluid"
                    style={{ width: "100px" }}
                  />
                </div>
                <Dropdown style={{ position: "absolute", right: 18, top: 18 }}>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    <FontAwesomeIcon icon={faGear} size="lg" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {user.papelCurador ? (
                      <Dropdown.Item href="#" onClick={handleShowModal}>
                        Gerar item codigo de moderador
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item href="#" onClick={handleShowModal}>
                        Adicionar codigo de moderador
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item href="#">Editar dados</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}  href="#">Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <h4 className="mb-2">{user.nome}</h4>
                <p className="text-muted mb-4">{user.descricao}</p>
                <Badges
                  contribuicoes={user.contribuicoesCount}
                  curadoria={user.curadoriaCount}
                  perguntas={user.perguntasCount}
                  ranking={ranking}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
