import React, { useEffect, useState, useRef } from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";

import { format } from "./in_VideoPlayer/Duration";

function ChatViewer() {
  const { pointer } = React.useContext(EditorTimePointerContext);

  const [data, setData] = useState();
  const [flow, setFlow] = useState([]);
  const scroll = document.querySelector("#scroll");
  const [prevPointer, setPrevPointer] = useState(0);

  useEffect(() => {
    const chatData = localStorage.getItem("localChatSet");
    setData(JSON.parse(chatData));
    if (JSON.parse(chatData)[0] !== undefined) {
      setFlow([
        JSON.parse(chatData)[0].map((value) => pointer + " : " + value),
      ]);
    }
  }, []);

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      if (Math.abs(prevPointer - pointer) > 5) {
        setFlow([]);
      }
      if (data[pointer] !== undefined) {
        setFlow((flow) => [
          ...flow,
          data[pointer].map((value) => format(pointer) + " : " + value),
        ]);
      }
      scroll.scrollTop = scroll.scrollHeight;
      setPrevPointer(pointer);
    }
  }, [pointer]);

  return (
    <div className="App">
      <div>
        <div
          style={{
            width: 400,
            height: 600,
            overflow: "scroll",
            display: "inline-block",
            wordBreak: "break-all",
            textAlign: "left",
          }}
          id="scroll"
        >
          {flow.map((value, index) =>
            value ? (
              <div key={index}>
                {value.map((each, idx) =>
                  each ? <div key={idx}>{each}</div> : null
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatViewer;
