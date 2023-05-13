import React from "react";

const Uploader = ({ attachment, handleChange, handleRemove }) => {
  if (!!attachment.url) {
    return (
      <div className="col-sm-10">
        <img src={attachment.url} alt="image" style={{ width: "100px" }} className="m-2" />
        <button type="button" onClick={handleRemove} class="btn btn-danger">
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
