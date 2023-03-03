import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";

const ModerationPage = () => {
  const [list, setList] = useState([]);
  const [selectedIndex, setIndex] = useState(-1);
  const [motive, setMotive] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setMotive("");
    setShow(false)
  };
  const handleShow = () => setShow(true);

  const firebase = useFirebase();

  useEffect(() => {
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
  };

  const handleModeration = async () => {
    if (selectedIndex < 0) return;

    const question = list[selectedIndex];

    const body =
      question.contribuicao == POST_TYPE.QUESTION
        ? {
            cod: question.cod,
            contribuicao: question.contribuicao,
            usuario: question.userId,
            ferramenta: question.tool,
            descricaoResposta: question.description,
            arquivoResposta: question.attachment,
            videoResposta: question.attachment,
            aprovada: !!motive.length,
            rejeitada: !!motive.length,
            motivo: motive,
            titulo: question.title,
            answers: [],
          }
        : {
            cod: question.cod,
            contribuicao: question.contribuicao,
            usuario: question.userId,
            ferramenta: question.tool,
            tipoContribuicao: question.contribuitionType,
            descricaoContribuicao: question.description,
            linkContribuicao: question.link,
            arquivoContribuicao: question.attachment,
            aprovada: !!motive.length,
            rejeitada: !!motive.length,
            motivo: motive,
            titulo: question.title,
            answers: [],
          };

    if (body.rejeitada) 
      return updateModeration(body);
    
    await firebase.create("questions", body);
    navigate("/home");
  };

  const updateModeration = async (item) => {
    const doc = await firebase.findById('moderation', item.cod, 'cod');
    console.log(doc);
    await firebase.update('moderation', item, doc.id);
    selectedIndex(-1);
    handleClose();
  }

  const handleRemove = async () => {
    const item = list[selectedIndex];
    const doc = await firebase.findById('moderation', item.cod, 'cod');
    
    await firebase.remove('moderation', doc.id);
    selectedIndex(-1);
    handleClose();
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
            {
              list[selectedIndex].rejeitada ? (
                <Button variant="danger" onClick={handleRemove}>
                  Remover
                </Button>
              ) : (
                <Button variant="danger" onClick={handleModeration}>
                  Rejeitar
                </Button>
              )
            }
            <Button variant="success" onClick={handleModeration}>
              Aprovar
            </Button>
          </Modal.Footer>
        </Modal>
      <section>
        <Navbar />
        <p>Moderation</p>
        {
          !!list?.length ? (
            <ul className="list-group">
              {list.map((question, index) => {
                return (
                  <a className="text-decoration-none" href={`/${question.cod}`}>
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={question.cod}
                    >
                      <div>
                        <p className="text-black">{question.titulo}</p>
                        <span>
                          {question.descricaoContribuicao ||
                            question.descricaoResposta}
                        </span>
                        <span
                          className={`badge badge-pill ${
                            question.contribuicao === POST_TYPE.QUESTION
                              ? "bg-primary"
                              : "bg-success"
                          } badge-primary`}
                        >
                          {question.contribuicao}
                        </span>
                      </div>
                      <div>
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            setIndex(index);
                            handleShow(true);
                          }}
                          className="badge bg-success badge-primary rounded-pill"
                        >
                          Avaliar
                        </Button>
                      </div>
                    </li>
                  </a>
                );
              })}
            </ul>
          ) : (
            <div>
              Nada prara mostrar aqui
            </div>
          )
        }
      </section>
    </>
  );
};

export default ModerationPage;
