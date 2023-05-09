import React from "react";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";


const Thumbnail = ({file, setIsFullScreen, isFullScreen}) => {
  if (!file) return <></>;

  if (file?.type.includes("image")) {
    return (
      <p>
        {isFullScreen ? (
          <Lightbox
            image={file.url}
            title={file.name || ""}
            style={{ width: "100px" }}
            onClose={() => setIsFullScreen(false)}
          />
        ) : (
          <div
            onClick={() => {
              setIsFullScreen(true);
            }}
          >
            <img
              src={file.url}
              alt="image"
              style={{ width: "100px" }}
            />
          </div>
        )}
      </p>
    );
  }
};

export default Thumbnail;
