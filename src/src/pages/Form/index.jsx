import React, { useState } from "react";
import Navbar from "../../components/navbar";

const FormPage = () => {
  const [isQuestion, setIsQuestion] = useState(true);

  const handleForm = () => {};

  const QuestionForm = () => {
    return (
      <>
        <div className="form-group row my-4">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            Descrição
          </label>
          <div className="col-sm-10">
            <textarea
              class="form-control"
              aria-label="With textarea"
            ></textarea>
          </div>
        </div>
        <div className="form-group row my-4">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            Arquivo ou video
          </label>
          <div className="col-sm-10">
            <input className="form-control" type="file" id="formFile" />
          </div>
        </div>
      </>
    );
  };

  const ContribuitionForm = () => {
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
            <input
              type="text"
              readOnly
              className="form-control"
              id="contribuitionType"
              defaultValue="Tipo de Contribuição"
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label htmlFor="description" className="col-sm-2 col-form-label">
            Descrição
          </label>
          <div className="col-sm-10">
            <textarea
              class="form-control"
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
              readOnly
              className="form-control"
              id="link"
              defaultValue="Link"
            />
          </div>
        </div>
        <div className="form-group row my-4">
          <label htmlFor="file" className="col-sm-2 col-form-label">
            Arquivo ou video
          </label>
          <div className="col-sm-10">
            <input className="form-control" type="file" id="formFile" />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
    <Navbar />
    <form className="p-4">
      <div>
        <div className="form-group row my-4">
          <label htmlFor="tool" className="col-sm-2 col-form-label">
            Ferramenta
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              readOnly
              className="form-control"
              id="tool"
              defaultValue="Ferramenta"
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
              readOnly
              className="form-control"
              id="title"
              defaultValue="Título"
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
          <label className="form-check-label" for="questionRadio">
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
          <label className="form-check-label" for="contributionRadio">
            Contribuição
          </label>
        </div>
      </div>
      {isQuestion ? <QuestionForm /> : <ContribuitionForm />}
      <button onClick={handleForm} type="button" className="btn btn-primary">
        Adicionar post
      </button>
    </form>
    </>
  );
};

export default FormPage;
