import { Field, FieldArray, Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import Navbar from "../../components/navbar";
import { POST_TYPE } from "../../utils/consts";
import Thumbnail from "../../components/thumbnail";
import Uploader from "../../components/uploader";

const QuestionPage = () => {
  const [question, setQuestion] = useState({});
  const [attachment, setAttachment] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { id } = useParams();
  const firebase = useFirebase();
  const navigate = useNavigate();

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
  };

  const handleChange = async (e) => {
    await firebase.uploadFile(e.target.files[0], setAttachment);
  };

  const initialValues = {
    answerSteps: [""],
  };

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
    const user = {...values.values};
    
    if (!user.perguntasCount) {
      user.perguntasCount = 1
    } else
      user.perguntasCount++

    await firebase.update('user', { values: user }, values.id);
  }

  const handleSubmit = async (values) => {
    const answers = [
      ...question?.answers,
      {
        passos: values.answerSteps,
        anexo: attachment,
        usuario: localStorage.getItem("userName"),
      },
    ];

    const newQuestion = {
      ...question,
      answers,
    };

    await firebase.update("questions", { values: newQuestion }, question?.id);
    incrementCounts();
    navigate(0);
  };

  const handleRemove = async () => {
    await firebase.removeFile(attachment, setAttachment);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center">
        <div className="col-md-8">
          <div className="bg-white comment-section">
            <div className="d-flex flex-row user">
              <div className="d-flex flex-column p-2">
              <p className="comment-content text-uppercase text-secondary m-0">
                  {question?.contribuicao === POST_TYPE.CONTRIBUTION ? "Contribuição" : "Dúvida"}
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
                file={question?.arquivoResposta}
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
              <span>Deixe um comentário</span>
              <div className="d-flex align-items-center border-left px-3 comments">
                <i className="fa fa-comment"></i>
                <span className="ml-2">{question?.answers?.length}</span>
              </div>
            </div>

            <div className="d-flex align-items-start flex-column mh-4">
              {question?.answers?.map((answer) => (
                <div className="card w-100 m-2 p-4">
                  <h4>{answer?.usuario}</h4>
                  {Object.entries(answer.passos).map((key) => (
                    <span className="card-body">
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

            <h3 className="border-top mt-4 pt-2">Descrição</h3>
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
                                    className="form-label align-middle col-md-1"
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
                    <div className="mb-3">
                      <label htmlFor="formFile" className="form-label">
                        Arquivo ou video
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
