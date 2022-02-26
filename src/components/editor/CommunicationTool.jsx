import React, { useEffect, useState } from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import { format } from "./in_VideoPlayer/Duration";
import axios from "axios";

function CommunicationTool() {
  const { pointer } = React.useContext(EditorTimePointerContext);
  const [markers, setMarkers] = useState([]);
  const [marker, setMarker] = useState("");
  const [addMarker, setAddMarker] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [submitState, setSubmitState] = useState(true);
  const [memoState, setMemoState] = useState(true);
  const [isStart, setIsStart] = useState(false);

  // localstorage
  useEffect(() => {
    const temp = localStorage.getItem("markers");
    const loadedMarkers = JSON.parse(temp);

    if (loadedMarkers) {
      setMarkers(loadedMarkers);
    }
  }, []);

  useEffect(() => {
    const temp = JSON.stringify(markers);
    localStorage.setItem("markers", temp);
  }, [markers]);

  function handleClick(e) {
    e.preventDefault(); //새로고침 되지않게 막음!
    console.log(`isStart`, isStart);
    if (isStart) {
      const endPointerValue = markers[markers.length - 1];
      endPointerValue["endPointer"] = pointer;
      setIsStart(false);
      console.log(`markers`, markers);
    } else {
      const newMarker = {
        id: new Date().getTime(),
        text: marker,
        startPointer: pointer,
        endPointer: null,
        completed: false,
      };
      setIsStart(true);
      setMarkers([...markers].concat(newMarker));
      setMemoState(true);
    }

    setMarker("");
  }

  function deleteMarker(id) {
    const updateMarkers = [...markers].filter((marker) => marker.id !== id);

    setMarkers(updateMarkers);
  }

  function toggleComplete(id) {
    const updateMarkers = [...markers].map((marker) => {
      if (marker.id === id) {
        marker.completed = !marker.completed;
      }
      return marker;
    });

    setMarkers(updateMarkers);
  }

  function addMemoEdit(id) {
    const updateMarkers = [...markers].map((marker) => {
      if (marker.id === id) {
        marker.text = editingText;
      }
      return marker;
    });
    setMarkers(updateMarkers);
    setEditingText("");
    setSubmitState(false);
    setAddMarker(null);
    setSubmitState(true);
    setMemoState(false);
  }

  function playVideo() {
    console.log("seekto 함수로 영상재생");
  }

  function goToGetDB(e) {
    console.log("DB로 get보낼것임");
    axios
      .get("http://210.107.130.133:5000/bookmarker")
      .then((response) => {
        console.log("Success", response.data);
      })
      .catch((error) => {
        console.log("get메소드 에러");
        console.log(error);
        alert("요청에 실패하였습니다.");
      });
  }
  function goToPostDB() {
    console.log("DB로 post보낼것임");
    console.log(`prev_axios_markers`, markers);
    let payload = { list: markers };
    axios
      .post("http://210.107.130.133:5000/bookmarker", {
        markers: payload,
        url: localStorage.getItem("prevUrl"),
      })
      .then((response) => {
        console.log("Success", response.data);
      })
      .catch((error) => {
        console.log("get메소드 에러");
        console.log(error);
        alert("요청에 실패하였습니다.");
      });
  }

  return (
    <div className="BookMarkerContainer">
      <h1>북마커 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <h3>유저 클릭 북마크의 start 값으로 Time Pointer 변경</h3>
      <>
        <button onClick={handleClick}>
          {isStart ? "북마크종료" : "북마크시작"}
        </button>
        {markers.map((marker) => (
          <div key={marker.id}>
            <input
              type="checkbox"
              onChange={() => toggleComplete(marker.id)}
              checked={marker.completed}
            />

            <button onClick={playVideo}>
              {format(marker.startPointer)}~{format(marker.endPointer)}
            </button>

            <button onClick={() => deleteMarker(marker.id)}>Delete</button>

            {addMarker === marker.id && submitState ? (
              <>
                <input
                  type="text"
                  onChange={(e) => setEditingText(e.target.value)}
                  value={editingText}
                />
                <button onClick={() => addMemoEdit(marker.id)}>Submit</button>
              </>
            ) : memoState === true ? (
              <button onClick={() => setAddMarker(marker.id)}>Add Memo</button>
            ) : (
              <button onClick={() => setAddMarker(marker.id)}>Edit Memo</button>
            )}

            <div>{marker.text}</div>
          </div>
        ))}
        <br></br>
        <button onClick={goToGetDB}>DB로 get 보내기</button>
        <button onClick={goToPostDB}>DB로 post 보내기</button>
      </>
    </div>
  );
}

export default CommunicationTool;
