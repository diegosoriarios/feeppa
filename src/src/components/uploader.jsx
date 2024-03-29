import React from "react";

const Uploader = ({ attachment, handleChange, handleRemove }) => {
  if (!!attachment.url) {
    return (
      <div className="col-sm-10">
        <img src={attachment.url} alt="image" style={{ width: "300px" }} className="m-2" />
        <button type="button" onClick={handleRemove} className="btn btn-danger">
          Apagar
        </button>
      </div>
    );
  }

  return (
    <div className="col-sm-10">
      <input type="file" onChange={handleChange} accept="/image/*" />
    </div>
  );
};

export default Uploader;
