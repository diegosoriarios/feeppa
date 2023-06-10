import { Field, FieldArray, Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import Navbar from "../../components/navbar";
import { POST_TYPE } from "../../utils/consts";
import Thumbnail from "../../components/thumbnail";
import Uploader from "../../components/uploader";
import useEmail from "../../hooks/useEmail";
import { useSelector } from "react-redux";
import { getPostDate } from "../../utils/date";
import Loading from "../../components/loading";

const QuestionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState({});
  const [attachment, setAttachment] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const firebase = useFirebase();
  const navigate = useNavigate();
  const email = useEmail();

  useEffect(() => {
    getQuestion();
  }, []);

  const getQuestion = async () => {
    const docs = await firebase.find("questions", id, "values.cod");
    const items = [];

    docs?.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data().values,
      });
    });

    setQuestion(items[0]);
    setIsLoading(false);
  };

  const handleChange = async (e) => {
    await firebase.uploadFile(e.target.files[0], setAttachment);
  };

  const initialValues = {
    answerSteps: [""],
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const created_at = new Date();
    const answers = [
      ...question?.answers,
      {
        passos: values.answerSteps,
        anexo: attachment,
        usuario: localStorage.getItem("userName"),
        created_at,
      },
    ];

    const newQuestion = {
      ...question,
      answers,
    };

    
    // email.sendEmail({
    //   name: user.nome,
    //   titulo: question.titulo,
    //   to: user.email,
    // });

    await firebase.update("questions", { values: newQuestion }, question?.id);
    setQuestion(newQuestion);
    setIsLoading(false);
  };

  const handleRemove = async () => {
    await firebase.removeFile(attachment, setAttachment);
  };

  if (isLoading) return <Loading />

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center">
        <div className="col-md-8">
          <div className="bg-white comment-section">
            <div className="d-flex flex-row user">
              <div className="d-flex flex-column p-2">
                <p className="comment-content text-uppercase text-secondary m-0">
                  {question?.contribuicao === POST_TYPE.CONTRIBUTION
                    ? "Contribuição"
                    : "Questão"}
                </p>
                <h2 className="name font-weight-bold">{question?.titulo}</h2>
              </div>
            </div>
            <h4 className="comment-content p-2 m-0">
              Ferramenta: {question?.ferramenta}
            </h4>
            <div className="mt-2 p-2">
              {(question?.descricaoContribuicao ||
                question?.descricaoResposta) && (
                <p className="comment-content">
                  {question?.contribuicao === POST_TYPE.CONTRIBUTION
                    ? question?.descricaoContribuicao
                    : question?.descricaoResposta}
                </p>
              )}
              <Thumbnail
                setIsFullScreen={setIsFullScreen}
                isFullScreen={isFullScreen}
                file={
                  question?.arquivoResposta || question?.arquivoContribuicao
                }
              />
              {question?.linkContribuicao && (
                <a
                  className="comment-content"
                  href={question?.linkContribuicao}
                  target="_blank"
                >
                  {question?.linkContribuicao}
                </a>
              )}
            </div>
            <div className="d-flex justify-content-between py-3 border-top">
              <h2>Deixe um comentário</h2>
              <div className="d-flex align-items-center border-left px-3 comments">
                <i className="fa fa-comment"></i>
                <span className="ml-2">{question?.answers?.length}</span>
              </div>
            </div>

            <div className="d-flex align-items-start flex-column mh-4">
              {question?.answers?.map((answer, index) => (
                <div className="card w-100 m-2 p-4" key={index}>
                  <h4>
                    {answer?.usuario} - {getPostDate(answer?.created_at)}
                  </h4>
                  {Object.entries(answer.passos).map((key) => (
                    <span className="card-body" key={key}>
                      {Object.values(key[1])[0]}
                    </span>
                  ))}
                  {answer?.anexo?.type?.includes("image") && (
                    <Thumbnail
                      setIsFullScreen={setIsFullScreen}
                      isFullScreen={isFullScreen}
                      file={answer?.anexo}
                    />
                  )}
                </div>
              ))}
            </div>

            <hr className="hr" />

            <div className="mt-4 mb-2 d-flex flex-row pt-2 align-items-center justify-content-around">
              <h3 className="me-2">Descrição</h3>
              <p className="m-0">
                Descreva sua contribuição/resposta em textos pequenos de
                preferência no formato passo a passo
              </p>
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                className="d-flex m-2 row"
                onSubmit={handleSubmit}
              >
                {({ values }) => (
                  <Form>
                    <FieldArray name="answerSteps">
                      {({ insert, remove, push }) => (
                        <>
                          <div>
                            {values.answerSteps.map((step, index) => (
                              <div className="mb-3" key={index}>
                                <div className="d-flex align-items-center flex-row align-middle">
                                  <label
                                    htmlFor={`answerSteps.${index}.step-${index}`}
                                    className="form-label align-middle col-md-1 m-2"
                                  >
                                    {index + 1} passo
                                  </label>
                                  <Field
                                    className="form-control"
                                    id="exampleFormControlInput1"
                                    placeholder="Digite o passo"
                                    name={`answerSteps.${index}.step-${index}`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => push("")}
                            type="button"
                            className="btn btn-primary"
                          >
                            Add passo
                          </button>
                        </>
                      )}
                    </FieldArray>
                    <p className="mt-2">
                      Se desejar, insira um arquivo de apoio (imagem, video,
                      etc)
                    </p>
                    <div className="mb-3 d-flex flex-row align-items-center">
                      <label
                        htmlFor="formFile"
                        className="form-label me-4 mt-2"
                      >
                        Arquivo
                      </label>
                      <Uploader
                        attachment={attachment}
                        handleChange={handleChange}
                        handleRemove={handleRemove}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Adicionar comentário
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionPage;
