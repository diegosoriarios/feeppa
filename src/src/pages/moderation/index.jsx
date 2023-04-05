import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";
import "./loading.css";


const ModerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedIndex, setIndex] = useState(-1);
  const [motive, setMotive] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setMotive("");
    setShow(false)
  };
  const handleShow = (index) => {
    if (list[index]?.motivo) setMotive(list[index]?.motivo)
    setShow(true);
  };

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

  const handleModeration = async (isApproved, index) => {
    if (index < 0) return;
    setIsLoading(true);

    try {
      const question = list[index];

      const body = generateBody(question, isApproved);

      if (body.rejeitada) 
        return updateModeration(body);

      await firebase.create("tools", body.ferramenta);
      await firebase.create("questions", body);

      removeFromModerationList(list[index].cod);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const removeFromModerationList = async (id) => {
    const docs = await firebase.find('moderation', id, 'values.cod');
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id)
    });

    await firebase.remove('moderation', items[0]);

    navigate("/home");
  }

  const updateModeration = async (item) => {
    const docs = await firebase.find('moderation', item.cod, 'values.cod');
    const items = [];

    docs.forEach((doc) => {
      items.push(doc.id)
    });


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

  if (isLoading) return (
    <section>
        <Navbar />
      <div className="spinner-container">
        <div className="loading-spinner">
        </div>
      </div>
    </section>
  );

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
                <Button variant="danger" onClick={() => handleModeration(false, selectedIndex)}>
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
                  <a onClick={() => {
                    navigate('/editForm', { state: { id: question.cod } })
                  }} className="text-decoration-none">
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
                        {
                          question.motivo && <span className="text-danger">{question.motivo}</span>
                        }
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
                            handleShow(index);
                          }}
                          variant="danger"
                        >
                          Rejeitar
                        </Button>
                        <Button variant="success" onClick={(e) => {
                          e.preventDefault();
                          setIndex(index);
                          handleModeration(true, index);
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
