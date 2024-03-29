import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";
import Loading from "../../components/loading";
import { getPostDate } from "../../utils/date";

let questions = [];

const ListPage = () => {
  const [questionCheckbox, setQuestionCheckbox] = useState(false);
  const [contributionCheckbox, setContributionCheckbox] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState(questions);
  const [tools, setTools] = useState([]);
  const [tool, setTool] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const firebase = useFirebase();
  const navigate = useNavigate();

  const initialize = async () => {
    const ref = await firebase.read("questions");
    const items = [];
    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push(values);
    });

    questions = items;

    setList(items);
    setIsLoading(false);
  };

  const getTools = async () => {
    const ref = await firebase.read("tools");
    const items = [];

    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push({
        id: values,
        name: values,
      });
    });

    const set = Array.from(new Set(items.map((i) => i.id)));

    const list = set.map((item) => ({
      label: item,
      value: item,
    }));

    setTools(list);
  };

  useEffect(() => {
    initialize();
    getTools();
  }, []);

  useEffect(() => {
    if (!questionCheckbox && !contributionCheckbox && !search.length) return setList(questions);

    const searchLabelText = !search.length ? questions : questions.filter((question) => {
      return question.titulo.toLowerCase().includes(search.toLowerCase());
    });

    const questionSearchList = !questionCheckbox ? searchLabelText : searchLabelText.filter((question) => 
      questionCheckbox && question.contribuicao === POST_TYPE.QUESTION
    )

    const contribuitionSearchList = !contributionCheckbox ? questionSearchList : questionSearchList.filter((question) => 
      contributionCheckbox &&
      question.contribuicao === POST_TYPE.CONTRIBUTION
    )
  
    setList(contribuitionSearchList);
  }, [questionCheckbox, contributionCheckbox, search]);

  useEffect(() => {
    if (tool === "Choose") return setList(questions);

    const searchList = questions.filter((question) => {
      return question.ferramenta == tool;
    });
    setList(searchList);
  }, [tool]);

  const renderDescription = (text) => {
    const TEXT_LIMIT = 75;
    if (text.length >= TEXT_LIMIT) return text.substring(0, TEXT_LIMIT) + "...";

    return text;
  }

  if (isLoading) return <Loading />

  return (
    <section className="w-100">
      <Navbar />
      <div className="m-5">
        <div className="row">
          <div className="col"></div>
          <h1 className="m-2 col text-center  ">Recursos de Ajuda</h1>
          <form className="d-flex flex-row m-2 form-inline col">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              onClick={(e) => {e.preventDefault()}}
            >
              Pesquisar
            </button>
          </form>
        </div>

        <hr className="hr" />
        
        <p className="m-2">Escolha a ferramenta e o tipo de recurso a visualizar:</p>
        <div className="m-2 d-flex flex-row justify-content-center align-items-center mb-4">
          <div className="input-group m-0 ">
            <div className="input-group-prepend ">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                Ferramentas
              </label>
            </div>
            <select
              onChange={(e) => setTool(e.target.value)}
              className="custom-select"
              id="inputGroupSelect01"
            >
              <option key="Choose" value="Choose">
                Ferramenta...
              </option>
              {tools.map((tool) => (
                <option key={tool.label} value={tool.label}>
                  {tool.label}
                </option>
              ))}
            </select>
            <div className="form-check form-check-inline align-items-center d-flex flex-row">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="questionCheckbox"
                  id="questionCheckbox"
                  checked={questionCheckbox}
                  onChange={() => setQuestionCheckbox(!questionCheckbox)}
                />
                <label className="form-check-label" htmlFor="questionCheckbox">
                  Questão
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input ms-2 me-2"
                  type="checkbox"
                  name="contributionCheckbox"
                  id="contributionCheckbox"
                  checked={contributionCheckbox}
                  onChange={() =>
                    setContributionCheckbox(!contributionCheckbox)
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="contributionCheckbox"
                >
                  Contribuição
                </label>
              </div>
            </div>
          </div>
        </div>

        <p className="m-2">Recursos disponíveis (clique no título para obter mais informações ou inserir um comentário)</p>

        {!!list?.length ? (
          <ul className="list-group">
            {list.map((question) => (
              <a
                className="text-decoration-none"
                href="#"
                onClick={() => navigate(`/${question.cod}`)}
                key={question.cod}
              >
                <li
                  className="list-group-item d-flex justify-content-between align-items-center m-2"
                  key={question.cod}
                >
                  <div>
                    <h5 className="text-black">{question.titulo} - {question.ferramenta}</h5>
                    <p className="text-black">{renderDescription(question.descricaoResposta || question.descricaoContribuicao)}</p>
                    <p>{getPostDate(question.created_at)} - {question.usuario}</p>
                    <span
                      className={`badge badge-pill ${
                        question.contribuicao === POST_TYPE.QUESTION
                          ? "bg-primary"
                          : "bg-success"
                      } badge-primary text-uppercase`}
                    >
                      {question.contribuicao === POST_TYPE.CONTRIBUTION
                        ? "Contribuição"
                        : "Questão"}
                    </span>
                  </div>
                  <span className="badge bg-secondary badge-primary rounded-pill">
                    {question?.answers?.length}
                  </span>
                </li>
              </a>
            ))}
          </ul>
        ) : (
          <div className="m-2">
            <p>Nada prara mostrar aqui</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListPage;
