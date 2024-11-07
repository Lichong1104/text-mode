import React, { useEffect, useRef, useState } from "react";
import * as docx from "docx-preview";
import { Spin } from "antd";

const DocxView = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const docxContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (props.src === "") return;
      try {
        const response = await fetch(props.src);
        const data = await response.blob();
        const containerElement = docxContainerRef.current;
        if (containerElement) {
          docx.renderAsync(data, containerElement).then(() => {
            console.info("docx: finished");
            setIsLoading(false);
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching or rendering document:", error);
      }
    };

    fetchData();
  }, [props.src]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflowY: "scroll",
        border: "2px solid rgba(128, 128, 128, 0.2)",
      }}
    >
      <div ref={docxContainerRef} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default DocxView;
