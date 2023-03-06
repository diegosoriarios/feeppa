import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    console.log(items);
    setList(items);
  };

  const generateBody = (question, isApproved) => ({
    cod: question.cod,
    contribuicao: question.contribuicao,
    usuario: question.usuario,
    ferramenta: question.ferramenta,
    tipoContribuicao: question.contribuitionType || "",
    descricaoContribuicao: question.description || "",
    linkContribuicao: question.link || "",
    arquivoContribuicao: question.attachment || "",
    descricaoResposta: question.description || "",
    arquivoResposta: question.attachment || "",
    videoResposta: question.attachment || "",
    aprovada: isApproved,
    rejeitada: !isApproved,
    motivo: motive,
    titulo: question.titulo,
    answers: [],
  })

  const handleModeration = async (isApproved) => {
    if (selectedIndex < 0) return;

    const question = list[selectedIndex];
    console.log("QUESTION", question);

    const body = generateBody(question, isApproved);

    if (body.rejeitada) 
      return updateModeration(body);
    
    await firebase.create("questions", body);
    navigate("/home");
  };

  const updateModeration = async (item) => {
    const docs = await firebase.find('moderation', item.cod, 'values.cod');
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id)
    });

    console.log(items[0]);

    await firebase.update('moderation', { values: item }, items[0]);
    setIndex(-1);
    handleClose();
  }

  const handleRemove = async () => {
    const item = list[selectedIndex];
    const docs = await firebase.find('moderation', item.cod, 'values.cod');
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id)
    });
    
    await firebase.remove('moderation', items[0]);
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
              list[selectedIndex]?.rejeitada ? (
                <Button variant="danger" onClick={handleRemove}>
                  Remover
                </Button>
              ) : (
                <Button variant="danger" onClick={() => handleModeration(false)}>
                  Rejeitar
                </Button>
              )
            }
            
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
                          variant="danger"
                        >
                          Rejeitar
                        </Button>
                        <Button variant="success" onClick={(e) => {
                          e.preventDefault();
                          setIndex(index);
                          handleModeration(true);
                        }}>
                          Aprovar
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
