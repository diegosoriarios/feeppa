import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";
import "./loading.css";
import Loading from "../../components/loading";

const ModerationPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);

  const firebase = useFirebase();
  const navigate = useNavigate();

  const handlePermission = async () => {
    const userId = localStorage.getItem("userId");
    const docs = await firebase.find("user", userId, "values.id");

    let values;
    docs?.forEach((doc) => {
      values = {
        values: doc.data().values,
        id: doc.id,
      };
    });

    const user = { ...values.values, doc: values.id };
    setUser(user);

    if (!user.papelCurador) navigate("/home");
  };

  useEffect(() => {
    handlePermission();
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
    setIsLoading(false);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <section>
        <Navbar />
        <div className="d-flex flex-column text-align-center align-items-center justify-content-center m-2">
          <h2 className="m-2">Curadoria</h2>
          <p>
            Analise os conteúdos inseridos e Aprove ou não a disponibilização
            dos mesmos para a comunidade
          </p>
          <p>
            Clique no título para verificar o detalhamento do conteúdo/questão
          </p>
        </div>
        {!!list?.length ? (
          <ul className="list-group">
            {list.map((question, index) => {
              return (
                <div className="text-decoration-none">
                  <li
                    className="m-2 list-group-item d-flex justify-content-between align-items-center"
                    key={question.cod}
                  >
                    <a
                      style={{
                        flexShrink: 1,
                        flexGrow: 1,
                      }}
                      onClick={() => {
                        navigate("/editForm", { state: { id: question.cod } });
                      }}
                    >
                      <h4 className="text-black">{question.titulo}</h4>
                      <span
                        className={`badge badge-pill ${
                          question.contribuicao === POST_TYPE.QUESTION
                            ? "bg-primary"
                            : "bg-success"
                        } badge-primary text-uppercase max-w-2`}
                      >
                        {question.contribuicao === POST_TYPE.CONTRIBUTION
                          ? "Contribuição"
                          : "Questão"}
                      </span>
                      <span className="ml-2">
                        {(
                          question.descricaoContribuicao ||
                          question.descricaoResposta
                        ).length > 100
                          ? `${(
                              question.descricaoContribuicao ||
                              question.descricaoResposta
                            ).substring(0, 100)}...`
                          : question.descricaoContribuicao ||
                            question.descricaoResposta}
                      </span>
                      <div className="d-flex flex-column">
                        {question.motivo && (
                          <span className="text-danger mr-4">
                            Rejeitado: {question.motivo}
                          </span>
                        )}
                      </div>
                    </a>
                  </li>
                </div>
              );
            })}
          </ul>
        ) : (
          <div className="m-2">
            <p>Nada prara mostrar aqui</p>
          </div>
        )}
      </section>
    </>
  );
};

export default ModerationPage;
