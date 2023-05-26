import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Uploader from "../../components/uploader";

const FormPage = () => {
  const [isQuestion, setIsQuestion] = useState(true);
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState("");
  const [attachment, setAttachment] = useState({});
  const [contribuitionType, setContribuitionType] = useState("");

  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    getToolList();
  }, []);

  const getToolList = async () => {
    const ref = await firebase.read("tools");
    const items = [];

    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push(values)
    });

    const set = Array.from(new Set(items));

    const list = set.map((item) => ({
      label: item,
      value: item,
    }));

    setTools(list)
  }

  const handleChange = async (e) => {
    await firebase.uploadFile(e.target.files[0], setAttachment);
  }

  const incrementCounts = async () => {
    const userId = localStorage.getItem("userId");
    const docs = await firebase.find('user', userId, 'values.id');
    
    let values;
    docs?.forEach((doc) => {
      values = {
        values: doc.data().values,
        id: doc.id
      };
    });
    let user = {...values.values, contribuicoesCount: values.values.contribuicoesCount + 1};

    await firebase.incrementValue('user', { values: user }, values.id);
  }

  const formik = useFormik({
    initialValues: {
      type: isQuestion ? POST_TYPE.QUESTION : POST_TYPE.CONTRIBUTION,
      title: "",
      description: "",
      contribuitionType: "",
      link: "",
    },
    onSubmit: (values) => handleForm(values),
  });

  const handleAttachment = (type) => {
    const attachmentIsEmpty = Object.keys(attachment).length === 0;

    if (attachmentIsEmpty) return "";

    const attachmentIsType = attachment.type.includes(type);
    
    if (!attachmentIsType) return "";

    return attachment;
  }

  const handleRemove = async () => {
    await firebase.removeFile(attachment, setAttachment);
  }

  const handleForm = async (values) => {
    const unique_id = uuid();
    const cod = unique_id.slice(0,8)
    const userId = localStorage.getItem("userId");
    
    const arquivoResposta = handleAttachment("image");
    const videoResposta = handleAttachment("video");

    const body = {
      cod,
      contribuicao: isQuestion ? POST_TYPE.QUESTION : POST_TYPE.CONTRIBUTION,
      usuario: userId,
      ferramenta: selectedTool.value,
      tipoContribuicao: contribuitionType.value || "",
      descricaoContribuicao: isQuestion ? "" : values.description,
      descricaoResposta: isQuestion ? values.description : "",
      arquivoResposta,
      videoResposta,
      aprovada: false,
      rejeitada: false,
      motivo: "",
      link: values.link,
      titulo: values.title,
    }

    incrementCounts();
  
    await firebase.create('moderation', body);
    navigate("/home");
  };

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
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            Arquivo ou video
          </label>
          <Uploader attachment={attachment} handleChange={handleChange} handleRemove={handleRemove} />
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
          <Uploader attachment={attachment} handleChange={handleChange} handleRemove={handleRemove} />
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
      {isQuestion ? renderQuestionForm() : renderContribuitionForm()}
      <button onClick={formik.handleSubmit} type="button" className="btn btn-primary">
        Adicionar post
      </button>
    </form>
    </>
  );
};

export default FormPage;
