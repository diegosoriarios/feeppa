import React, { useEffect } from "react";
import Navbar from "../../components/navbar";
import Select from "react-select";
import Uploader from "../../components/uploader";
import { useEditForm } from "./useEditForm";
import { Button, Modal } from "react-bootstrap";
import { useModeration } from "./useModeration";

const EditForm = () => {
  const {
    isQuestion,
    tools,
    selectedTool,
    contribuitionType,
    attachment,
    formik,
    setContribuitionType,
    setSelectedTool,
    setIsQuestion,
    getInitialValues,
    getToolList,
    handleChange,
    handleRemove,
    getBody,
  } = useEditForm();

  const {
    motive,
    setMotive,
    show,
    handleShow,
    handleModeration,
    handleClose,
  } = useModeration(getBody(formik.values));

  useEffect(() => {
    getToolList();
    getInitialValues();
  }, []);

  const renderQuestionForm = () => {
    return (
      <>
        <div className="form-group row my-4">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            Descrição
          </label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              value={formik.values.description}
              aria-label="With textarea"
              name="description"
              onChange={formik.handleChange}
            ></textarea>
          </div>
        </div>
        <div className="form-group row my-4">
          <label htmlFor="file" className="col-sm-2 col-form-label">
            Arquivo ou video
          </label>
          <Uploader
            attachment={attachment}
            handleChange={handleChange}
            handleRemove={handleRemove}
          />
        </div>
      </>
    );
  };

  const renderContribuitionForm = () => {
    return (
      <>
        <div className="form-group row my-4">
          <label
            htmlFor="contribuitionType"
            className="col-sm-2 col-form-label"
          >
            Tipo de Contribuição
          </label>
          <div className="col-sm-10">
            <Select
              options={[
                { label: "Artigos", value: "Artigos" },
                {
                  label: "Exemplos de projetos",
                  value: "Exemplos de projetos",
                },
                { label: "Exemplo de código", value: "Exemplo de código" },
                { label: "Metodologias", value: "Metodologias" },
                { label: "Tutoriais", value: "Tutoriais" },
                { label: "Links para wikis", value: "Links para wikis" },
                { label: "Link para Fóruns", value: "Link para Fóruns" },
                { label: "Outros", value: "Outros" },
              ]}
              placeholder="Tipo de contribuição"
              value={contribuitionType}
              onChange={(value) => setContribuitionType(value)}
              name="contribuitionType"
              id="contribuitionType"
              type="text"
              isSearchable
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label htmlFor="description" className="col-sm-2 col-form-label">
            Descrição
          </label>
          <div className="col-sm-10">
            <textarea
              name="description"
              key="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="form-control"
              aria-label="With textarea"
            ></textarea>
          </div>
        </div>
        <div className="form-group row my-4">
          <label htmlFor="link" className="col-sm-2 col-form-label">
            Link
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="link"
              value={formik.values.link}
              onChange={formik.handleChange}
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label htmlFor="file" className="col-sm-2 col-form-label">
            Arquivo ou video
          </label>
          <Uploader
            attachment={attachment}
            handleChange={handleChange}
            handleRemove={handleRemove}
          />
        </div>
      </>
    );
  };

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
          {getBody(formik.values).rejeitada ? (
            <Button variant="danger" onClick={handleRemove}>
              Remover
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={() => handleModeration(false)}
            >
              Rejeitar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Navbar />
      <div className="d-flex flex-column text-align-center align-items-center justify-content-center m-2">
        <h2>Curadoria: verificação de conteúdo</h2>
        <p>
          Analise o conteúdo/questão e, se necessário, faça as devidas
          alterações
        </p>
      </div>

      <hr className="h4" />
      <form className="p-4">
        <div>
          <div className="form-group row my-4">
            <label htmlFor="tool" className="col-sm-2 col-form-label">
              Ferramenta
            </label>
            <div className="col-sm-10">
              <Select
                options={tools}
                placeholder="Selecione a Ferramenta"
                value={selectedTool}
                onChange={(value) => setSelectedTool(value)}
                type="text"
                id="tool"
                name="tool"
                isSearchable
              />
            </div>
          </div>
          <div className="form-group row my-4">
            <label htmlFor="title" className="col-sm-2 col-form-label">
              Título
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                maxLength={100}
                value={formik.values.title}
                onChange={formik.handleChange}
              />
            </div>
          </div>
        </div>
        <div className="d-flex flex-row my-4 col-sm-4 justify-content-between">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="questionRadio"
              id="questionRadio"
              checked={isQuestion}
              onChange={() => setIsQuestion(true)}
            />
            <label className="form-check-label" htmlFor="questionRadio">
              Duvida
            </label>
          </div>
          <div className="form-check ml-3">
            <input
              className="form-check-input ml-4"
              type="radio"
              name="contributionRadio"
              id="contributionRadio"
              checked={!isQuestion}
              onChange={() => setIsQuestion(false)}
            />
            <label className="form-check-label" htmlFor="contributionRadio">
              Contribuição
            </label>
          </div>
        </div>
        <p>
          Descreva sua dúvida e, se desejar, insira um arquivo de apoio (imagem,
          video, etc)
        </p>
        {isQuestion ? renderQuestionForm() : renderContribuitionForm()}
        <div className="d-flex flex-row">
          <Button onClick={formik.handleSubmit} variant="primary">
            Salvar alterações
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleShow();
            }}
            variant="danger"
            className="ms-2"
          >
            Rejeitar
          </Button>
          <Button
            className="ms-2"
            variant="success"
            onClick={(e) => {
              e.preventDefault();
              handleModeration(true);
            }}
          >
            Aprovar
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditForm;
