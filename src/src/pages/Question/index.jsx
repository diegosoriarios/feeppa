import React, { useState } from "react";
import Navbar from "../../components/navbar";

const QuestionPage = () => {
  const [answerSteps, setAnswerSteps] = useState([""]);
  const [comments, setComments] = useState([]);

  const handleAdd = () => {
    setAnswerSteps(state => state = [...answerSteps, ""])
  }

  const handleForm = () => {}

  return (
    <>
      <Navbar />
      <div className="d-flex m-2 row">
        <div className="col-md-12">
            <div className="bg-white comment-section">
                <div className="d-flex flex-row user p-2">
                  <img className="rounded-circle" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" width="50"/>
                  <div className="d-flex flex-column ml-2"><span className="name font-weight-bold">Chris Hemsworth</span><span>10:30 PM, May 25</span></div>
                </div>
                <div className="mt-2 p-2">
                    <p className="comment-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div className="d-flex justify-content-between py-3 border-top"><span>Leave a comment</span>
                    <div className="d-flex align-items-center border-left px-3 comments"><i className="fa fa-comment"></i><span className="ml-2">{comments.length}</span></div>
                </div>
                <div>
                  <h3>Descrição</h3>
                  {
                    answerSteps.map((steps, index) => (
                      <div className="mb-3">
                        <div className="d-flex align-items-center flex-row align-middle">
                          <label htmlFor="exampleFormControlInput1" className="form-label align-middle col-md-1">{index + 1} passo</label>
                          <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                        </div>
                      </div>
                    ))
                  }
                  <button onClick={handleAdd} type="button" className="btn btn-primary">Add passo</button>
                </div>
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">Arquivo ou video</label>
                  <input className="form-control" type="file" id="formFile" />
                </div>
            </div>
            <button onClick={handleForm} type="button" className="btn btn-primary">Adicionar comentário</button>
        </div>
    </div>
    </>
  );
};

export default QuestionPage;
