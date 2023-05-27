import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";
import "./loading.css";

const ModerationPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [selectedIndex, setIndex] = useState(-1);
  const [motive, setMotive] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setMotive("");
    setShow(false);
  };
  const handleShow = (index) => {
    if (list[index]?.motivo) setMotive(list[index]?.motivo);
    setShow(true);
  };

  const firebase = useFirebase();
  const navigate = useNavigate();

  const handlePermission = async () => {
    const userId = localStorage.getItem("userId");
    const docs = await firebase.find("user", userId, "values.id");

    let values;
    docs?.forEach((doc) => {
      values = {
        values: doc.data().values,
        id: doc.id,
      };
    });
    const user = { ...values.values };
    setUser(user);

    if (!user.papelCurador) navigate("/home");
  }

  useEffect(() => {
    handlePermission();
    getItemsToModerate();
  }, []);

  const getItemsToModerate = async () => {
    const ref = await firebase.read("moderation");
    const items = [];
    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push(values);
    });

    setList(items);
    setIsLoading(false);
  };

  const generateBody = (question, isApproved) => ({
    cod: question.cod,
    contribuicao: question.contribuicao,
    usuario: question.usuario,
    ferramenta: question.ferramenta,
    tipoContribuicao: question.contribuitionType || "",
    descricaoContribuicao: question.descricaoContribuicao || "",
    linkContribuicao: question.link || "",
    arquivoContribuicao:
      question.contribuicao === POST_TYPE.CONTRIBUTION
        ? question.arquivoResposta || ""
        : "",
    descricaoResposta: question.descricaoResposta || "",
    arquivoResposta:
      question.contribuicao === POST_TYPE.QUESTION
        ? question.arquivoResposta || ""
        : "",
    videoResposta: question.attachment || "",
    aprovada: isApproved,
    rejeitada: !isApproved,
    motivo: motive,
    titulo: question.titulo,
    answers: [],
  });

  const incrementCounts = async () => {
    let user = {...values.values, curadoriaCount: values.values.curadoriaCount + 1};

    await firebase.incrementValue("user", { values: user }, values.id);
  };

  const handleModeration = async (isApproved, index) => {
    if (index < 0) return;
    setIsLoading(true);

    try {
      const question = list[index];

      const body = generateBody(question, isApproved);

      if (body.rejeitada) return updateModeration(body);

      addNewToolToFirebase(body.ferramenta);
      await firebase.create("questions", body);

      incrementCounts();
      removeFromModerationList(list[index].cod);
    } catch (e) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      getItemsToModerate();
    }
  };

  const addNewToolToFirebase = async (ferramenta) => {
    const ref = await firebase.read("tools");
    const items = [];

    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push({
        id: values,
        name: values,
      });
    });

    const alreadyExists = items.filter((item) => item.name === ferramenta);

    if (!alreadyExists.length) await firebase.create("tools", ferramenta);
  };

  const removeFromModerationList = async (id) => {
    const docs = await firebase.find("moderation", id, "values.cod");
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id);
    });

    await firebase.remove("moderation", items[0]);

    navigate("/home");
  };

  const updateModeration = async (item) => {
    const docs = await firebase.find("moderation", item.cod, "values.cod");
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id);
    });

    await firebase.update("moderation", { values: item }, items[0]);
    setIndex(-1);
    handleClose();
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const item = list[selectedIndex];
      const docs = await firebase.find("moderation", item.cod, "values.cod");
      const items = [];

      docs.forEach((doc) => {
        items.push(doc.id);
      });

      await firebase.remove("moderation", items[0]);
      removeItemFromList(item.cod);
      setIndex(-1);
      handleClose();
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const removeItemFromList = (id) => {
    const newList = list.filter((item) => item.cod !== id);
    setList(newList);
  };

  if (isLoading) {
    return (
      <section className="w-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rejeitar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Diga o motivo para rejeitar a contribuição</p>
          <input
            type="text"
            className="form-control"
            value={motive}
            onChange={(e) => setMotive(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Voltar
          </Button>
          {list[selectedIndex]?.rejeitada ? (
            <Button variant="danger" onClick={handleRemove}>
              Remover
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={() => handleModeration(false, selectedIndex)}
            >
              Rejeitar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <section>
        <Navbar />
        <h2 className="m-2">Área restrita para usuário Curador</h2>
        {!!list?.length ? (
          <ul className="list-group">
            {list.map((question, index) => {
              return (
                <div className="text-decoration-none">
                  <li
                    className="m-2 list-group-item d-flex justify-content-between align-items-center"
                    key={question.cod}
                  >
                    <a
                      style={{
                        flexShrink: 1,
                        flexGrow: 1,
                      }}
                      onClick={() => {
                        navigate("/editForm", { state: { id: question.cod } });
                      }}
                    >
                      <h4 className="text-black">{question.titulo}</h4>
                      <span
                        className={`badge badge-pill ${
                          question.contribuicao === POST_TYPE.QUESTION
                            ? "bg-primary"
                            : "bg-success"
                        } badge-primary text-uppercase max-w-2`}
                      >
                        {question.contribuicao === POST_TYPE.CONTRIBUTION
                          ? "Contribuição"
                          : "Questão"}
                      </span>
                      <span className="ml-2">
                        {(
                          question.descricaoContribuicao ||
                          question.descricaoResposta
                        ).length > 100
                          ? `${(
                              question.descricaoContribuicao ||
                              question.descricaoResposta
                            ).substring(0, 100)}...`
                          : question.descricaoContribuicao ||
                            question.descricaoResposta}
                      </span>
                      <div className="d-flex flex-column">
                        {question.motivo && (
                          <span className="text-danger mr-4">
                            Rejeitado: {question.motivo}
                          </span>
                        )}
                      </div>
                    </a>
                    <div>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setIndex(index);
                          handleShow(index);
                        }}
                        variant="danger"
                      >
                        Rejeitar
                      </Button>
                      <Button
                        className="m-2"
                        variant="success"
                        onClick={(e) => {
                          e.preventDefault();
                          setIndex(index);
                          handleModeration(true, index);
                        }}
                      >
                        Aprovar
                      </Button>
                    </div>
                  </li>
                </div>
              );
            })}
          </ul>
        ) : (
          <div className="m-2">
            <p>Nada prara mostrar aqui</p>
          </div>
        )}
      </section>
    </>
  );
};

export default ModerationPage;
