import { Field, FieldArray, Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import Navbar from "../../components/navbar";
import { POST_TYPE } from "../../utils/consts";
import Thumbnail from "../../components/thumbnail";

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
    navigate(0);
  };

  console.log("DIEGO", question);

  return (
    <>
      <Navbar />
      <div className="col-md-12">
        <div className="bg-white comment-section">
          <div className="d-flex flex-row user p-2">
            <div className="d-flex flex-column ml-2">
              <h2 className="name font-weight-bold">{question?.titulo}</h2>
              <p className="comment-content">
                {question?.contribuicao ? "Contribuição" : "Dúvida"}
              </p>
            </div>
          </div>
          <h4 className="comment-content p-2">
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
            <Thumbnail setIsFullScreen={setIsFullScreen} isFullScreen={isFullScreen} file={question?.arquivoResposta} />
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
            <span>Leave a comment</span>
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
                  <span className="card-body">{Object.values(key[1])[0]}</span>
                ))}
                {answer?.anexo && (
                  <img src={answer.anexo} alt={answer.passos[0]} />
                )}
              </div>
            ))}
          </div>

          <h3>Descrição</h3>
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
                    <input
                      type="file"
                      onChange={handleChange}
                      accept="/image/*"
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
    </>
  );
};

export default QuestionPage;
