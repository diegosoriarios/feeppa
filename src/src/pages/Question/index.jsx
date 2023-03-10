import { Field, FieldArray, Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import Navbar from "../../components/navbar";

const QuestionPage = () => {
  const [question, setQuestion] = useState({});
  const { id } = useParams();
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    getQuestion();
  }, [])
  
  const getQuestion = async () => {
    console.log(id);
    const docs = await firebase.find('questions', id, 'values.cod');
    const items = [];

    docs?.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data().values,
      })
    });

    setQuestion(items[0])
  }

  const initialValues = {
    answerSteps: [""],
    attachment: "",
  };

  const handleSubmit = async (values) => {
    const answers = [...question?.answers, {
      passos: values.answerSteps,
      anexo: values.attachment
    }];

    const newQuestion = {
      ...question,
      answers,
    };
    
    await firebase.update('questions', { values: newQuestion }, question?.id);
    navigate(0);
  }

  return (
    <>
      <Navbar />
      <div className="col-md-12">
        <div className="bg-white comment-section">
          <div className="d-flex flex-row user p-2">
            <div className="d-flex flex-column ml-2">
              <h3 className="name font-weight-bold">{question?.titulo}</h3>
            </div>
          </div>
          <div className="mt-2 p-2">
            <p className="comment-content">
              {question?.descricaoContribuicao || question?.descricaoResposta}
            </p>
          </div>
          <div className="d-flex justify-content-between py-3 border-top">
            <span>Leave a comment</span>
            <div className="d-flex align-items-center border-left px-3 comments">
              <i className="fa fa-comment"></i>
              <span className="ml-2">{question?.answers?.length}</span>
            </div>
          </div>

          <ul>
              {
                question?.answers?.map(answer => (
                  Object.entries(answer.passos).map(key => <span>{Object.values(key[1])[0]}</span>
                  )
                ))
              }
            </ul>

          <h3>Descri????o</h3>
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
                    <input className="form-control" type="file" id="formFile" />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Adicionar coment??rio
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
