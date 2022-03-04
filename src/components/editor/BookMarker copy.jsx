import React, { useEffect, useState } from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import { format } from "./in_VideoPlayer/Duration";
import axios from "axios";

import "./BookMarker.scss";
import useResult from "../../hooks/useResult";

function BookMarker({ duration, bookmarker }) {
  const {
    pointer,
    callSeekTo,
    setPlayed,
    changePointer,
    seeking,
    setSeeking,
    replayRef,
  } = React.useContext(EditorTimePointerContext);
  const { server_addr } = useResult();
  // const [marker, setMarker] = useState("");
  const [addMarker, setAddMarker] = useState(null); //
  const [editingText, setEditingText] = useState("");
  const [isStart, setIsStart] = useState(false);
  const { markers, setMarkers, setRelay } = useResult();
  // localstorage;
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

  useEffect(() => {
    if (!bookmarker) return;
    setMarkers(bookmarker);
  }, [bookmarker]);

  useEffect(() => {
    if (!replayRef) return;
    replayRef.current.saveMarker = handleClick;
  }, [markers]);

  function handleClick(e) {
    if (e) {
      e.preventDefault(); //새로고침 되지않게 막음!
    }
    if (seeking) return;
    console.log(`is replayRef?`, replayRef.current);
    if (replayRef.current.isReplay) {
      const newMarker = {
        id: new Date().getTime(),
        text: "",
        startPointer: replayRef.current.startTime,
        endPointer: replayRef.current.endTime,
        completed: false,
        isPlaying: false,
      };
      setMarkers([...markers].concat(newMarker));
    } else {
      console.log(`isStart`, isStart);
      if (isStart) {
        if (markers.length === 0) {
          setIsStart(false);
        } else {
          const endPointerValue = markers[markers.length - 1];
          endPointerValue["endPointer"] = pointer;
          setIsStart(false);
          console.log(`markers`, markers);
        }
      } else {
        const newMarker = {
          id: new Date().getTime(),
          text: "",
          startPointer: pointer,
          endPointer: null,
          completed: false,
          isPlaying: false,
        };
        setIsStart(true);
        setMarkers([...markers].concat(newMarker));
      }
    }
    // setMarker(""); //얜왜하지?
  }

  
  function deleteMarker(id) {
    const updateMarkers = [...markers].filter((marker) => marker.id !== id);

    setMarkers(updateMarkers);
  }

  function toggleComplete(id) {
    setSeeking(true);
    const updateMarkers = [...markers].map((marker) => {
      if (marker.id === id) {
        marker.completed = !marker.completed;
      }
      return marker;
    });

    setMarkers(updateMarkers);
    setSeeking(false);
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
    setAddMarker(null);
  }

  function playVideo(id) {
    markers.forEach((marker) => {
      if (marker.id === id) {
        setSeeking(true);
        const playTime = marker.startPointer; //시작값
        console.log(`marker.start`, marker.startPointer);
        console.log(`marker.start_type`, typeof marker.startPointer);
        const playTimeRatio = playTime / parseInt(duration);
        console.log(`duration`, duration, "playerTimeRatio", playTimeRatio);
        console.log(`duration's type`, typeof duration);
        callSeekTo(playTimeRatio);
        setPlayed(parseFloat(playTimeRatio));
        changePointer(playTime);
        setSeeking(false);
        replayRef.current.isReplay = true;
        replayRef.current.startTime = marker.startPointer;
        replayRef.current.endTime = marker.endPointer;
        replayRef.current.playingId = marker.id;
        setRelay(prev => prev = true)
        console.log('marker click play', replayRef.current)
      }
    });
    console.log("seekto 함수로 영상재생");
  }

  //get test!!!

  // function goToGetDB(e) {
  //   console.log("DB로 get보낼것임");
  //   axios
  //     .get(server_addr+"/bookmarker")
  //     .then((response) => {
  //       console.log("Success", response.data);
  //     })
  //     .catch((error) => {
  //       console.log("get메소드 에러");
  //       console.log(error);
  //       alert("요청에 실패하였습니다.");
  //     });
  // }
  function goToPostDB() {
    console.log("DB로 post보낼것임");
    console.log(`prev_axios_markers`, markers);
    let postMarkers;
    const selectedMarkers = markers.filter(
      (marker) => marker.completed === true
    );
    if (selectedMarkers.length > 0) {
      postMarkers = selectedMarkers;
      // console.log('selectedMarkers', selectedMarkers);
    } else {
      postMarkers = markers;
      // console.log('markers', markers);
    }
    const payload = { list: postMarkers };
    console.log("new_axios_markers", payload);
    axios
      .post(server_addr + "/bookmarker", {
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

  function downloadGet() {
    console.log("call getMethod()");
    const method = "GET";
    const url = server_addr + "/downloadpath";
    axios
      .request({
        url,
        method,
        responseType: "blob",
      })
      .then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "영상파일과 같은 위치에서 압축을 풀어주세요.zip");
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  }

  const handleKeyPress = (event, id) => {
    if (event.key === "Enter") {
      console.log("enter press here! ");
      addMemoEdit(id);
    }
  };

  function deleteCall() {
    console.log("다운로드 완료, 삭제요청");
    axios.get(server_addr + "/flask/download", {});
  }

  function goToDownload() {
    console.log("서버로 post보낼것임");
    let postMarkers;
    const selectedMarkers = markers.filter(
      (marker) => marker.completed === true
    );
    if (selectedMarkers.length > 0) {
      postMarkers = selectedMarkers;
      // console.log('selectedMarkers', selectedMarkers);
    } else {
      postMarkers = markers;
      // console.log('markers', markers);
    }
    const payload = { list: postMarkers };
    console.log("컷을 요청한 북마크", payload);
    axios
      .post(server_addr + "/flask/download", {
        status: "download_start",
        bookmarks: payload,
      })
      .then((response) => {
        console.log("Success", response.data);
        downloadGet();
        deleteCall();
      })
      .catch((error) => {
        console.log("get메소드 에러");
        console.log(error);
        alert("요청에 실패하였습니다.");
      });
  }

  return (
    <div className="BookMarkerContainer">
      <h2>컷 보관함</h2>
      <h3>드래그로 선택한 구간을 컷으로 저장할 수 있어요 (Ctrl+Shift+S)</h3>
      <>
        <button onClick={handleClick}>
          {isStart
            ? "북마크종료"
            : replayRef?.current.isReplay
            ? "북마크저장"
            : "북마크시작"}
        </button>

        {markers.map((marker) => (
          <div key={marker.id}>
            <input
              type="checkbox"
              onChange={() => toggleComplete(marker.id)}
              checked={marker.completed}
            />

            <button onClick={() => playVideo(marker.id)}>
              {format(marker.startPointer)}~{format(marker.endPointer)}
            </button>

            <button onClick={() => deleteMarker(marker.id)}>삭제</button>

            {addMarker === marker.id ? (
              <input
                type="text"
                onKeyPress={(e) => handleKeyPress(e, marker.id)}
                onChange={(e) => setEditingText(e.target.value)}
                value={editingText}
              />
            ) : (
              <div>{marker.text}</div>
            )}

            {addMarker === marker.id ? (
              <button onClick={() => addMemoEdit(marker.id)}>저장</button>
            ) : (
              <button onClick={() => setAddMarker(marker.id)}>
                한줄메모 작성!
              </button>
            )}
          </div>
        ))}
        <br></br>
        {/* <button onClick={goToGetDB}>DB로 get 보내기</button> */}
        <button onClick={goToPostDB}>post 보내기</button>

        <button onClick={goToDownload}>다운로드</button>
      </>
    </div>
  );
}

export default BookMarker;
