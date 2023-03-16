import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import { POST_TYPE } from "../../utils/consts";

const questions = [
  {id: 1, question: "Teste questão?", comments: 0, type: POST_TYPE.QUESTION},
  {id: 2, question: "Teste questão?", comments: 15,  type: POST_TYPE.QUESTION},
  {id: 3, question: "Teste contribuição?", comments: 6,  type: POST_TYPE.CONTRIBUTION},
  {id: 4, question: "Teste questão?", comments: 78,  type: POST_TYPE.QUESTION},
  {id: 5, question: "Teste questão?", comments: 2,  type: POST_TYPE.QUESTION},
];

//const tools = [
//  {id: 1, name:"Scratch"},
//  {id: 2, name:"C"},
//];

const ListPage = () => {
  const [questionCheckbox, setQuestionCheckbox] = useState(false);
  const [contributionCheckbox, setContributionCheckbox] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState(questions);
  const [tools, setTools] = useState([]);
  const [tool, setTool] = useState({});

  const firebase = useFirebase();

  const initialize = async () => {
    const ref = await firebase.read("questions");
    const items = [];
    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push(values);
    });
    console.log(items);
    setList(items);
  }
  
  const getTools = async () => {
    const ref = await firebase.read("tools");
    const items = [];

    ref.forEach((snapshot) => {
      const { values } = snapshot.data();
      items.push({
        id: values,
        name: values,
      })
    });

    const set = Array.from(new Set(items.map(i => i.id)));

    const list = set.map((item) => ({
      label: item,
      value: item,
    }));

    setTools(list)
  }

  useEffect(() => {
    initialize();
    getTools();
  }, [])

  useEffect(() => {
    if (!questionCheckbox && !contributionCheckbox) return setList(questions);

    const searchList = questions.filter(question => {
      if (questionCheckbox && question.type === POST_TYPE.QUESTION) return question;
      if (contributionCheckbox && question.type === POST_TYPE.CONTRIBUTION) return question;
    })
    setList(searchList);
  }, [questionCheckbox, contributionCheckbox]);

  return (
    <section className="w-100">
      <Navbar />
      <div className="d-flex w-100 justify-content-between flex-row">
        <h2 className="m-2">Lista</h2>
        <form className="d-flex flex-row m-2 form-inline">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
      <div className="m-2">
        <h2 className="">Filtro</h2>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="inputGroupSelect01">Ferramentas</label>
          </div>
          <select className="custom-select" id="inputGroupSelect01">
            <option value={tool}>Choose...</option>
            {
              tools.map(tool => (
                <option key={tool.label} value={tool.label}>{tool.label}</option>
              ))
            }
          </select>
        </div>
        <div className="form-check form-check-inline">
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
              className="form-check-input"
              type="checkbox"
              name="contributionCheckbox"
              id="contributionCheckbox"
              checked={contributionCheckbox}
              onChange={() => setContributionCheckbox(!contributionCheckbox)}
            />
            <label className="form-check-label" htmlFor="contributionCheckbox">
              Contribuição
            </label>
          </div>
        </div>
      </div>
      {
        !!list?.length ? (
          <ul className="list-group">
            {list.map(question => (
              <a className="text-decoration-none" href={`/${question.cod}`} key={question.cod}>
              <li className="list-group-item d-flex justify-content-between align-items-center" key={question.cod}>
                <div>
                  <p className="text-black">{question.titulo}</p>
                  <span className={`badge badge-pill ${question.tipoContribuicao === POST_TYPE.QUESTION ? "bg-primary" : "bg-success"} badge-primary`}>{question.type}</span>
                </div>
                <span className="badge bg-secondary badge-primary rounded-pill">{question?.answers?.length}</span>
              </li>
              </a>
            ))}
          </ul>
        ) : (
          <div>
            <p>Nada para mostrar aqui</p>
          </div>
        )
      }
    </section>
  );
}

export default ListPage;
