import { useFormik } from "formik";
import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";

const FormPage = () => {
  const [isQuestion, setIsQuestion] = useState(true);

  const firebase = useFirebase();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      type: isQuestion ? POST_TYPE.QUESTION : POST_TYPE.CONTRIBUTION,
      tool: "",
      title: "",
      description: "",
      attachment: "",
      contribuitionType: "",
      link: "",
    },
    onSubmit: (values) => handleForm(values),
  });

  const handleForm = async (values) => {
    const unique_id = uuid();
    const cod = unique_id.slice(0,8)
    const userId = localStorage.getItem("userId");

    const body = isQuestion ? {
      cod,
      contribuicao: isQuestion,
      usuario: userId,
      ferramenta: values.tool,
      descricaoResposta: values.description,
      arquivoResposta: values.attachment,
      videoResposta: values.attachment,
      aprovada: false,
      rejeitada: false,
      motivo: "",
      titulo: values.title,
    } : {
      cod,
      contribuicao: isQuestion,
      usuario: userId,
      ferramenta: values.tool,
      tipoContribuicao: values.contribuitionType,
      descricaoContribuicao: values.description,
      linkContribuicao: values.link,
      arquivoContribuicao: values.attachment,
      aprovada: false,
      rejeitada: false,
      motivo: "",
      titulo: values.title,
    }
  
    await firebase.create('moderation', body);
    navigate("/home");
  };

  const QuestionForm = () => {
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
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            Arquivo ou video
          </label>
          <div className="col-sm-10">
            <input className="form-control" name="attachment" value={formik.values.attachment}
              onChange={formik.handleChange} type="file" id="formFile" />
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
              className="form-control"
              id="contribuitionType"
              value={formik.values.contribuitionType}
              onChange={formik.handleChange}
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
          <div className="col-sm-10">
            <input className="form-control" 
              name="attachment"
              value={formik.values.attachment}
              onChange={formik.handleChange}
            type="file" id="formFile" />
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
              className="form-control"
              id="tool"
              name="tool"
              value={formik.values.tool}
              onChange={formik.handleChange}
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
      {isQuestion ? <QuestionForm /> : <ContribuitionForm />}
      <button onClick={formik.handleSubmit} type="button" className="btn btn-primary">
        Adicionar post
      </button>
    </form>
    </>
  );
};

export default FormPage;
