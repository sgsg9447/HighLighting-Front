import React, { useEffect, useState, useRef, useContext } from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import FFmpegContext from "../../contexts/FFmpegContext";
import { format } from "./in_VideoPlayer/Duration";
import axios from "axios";

import "./BookMarker.scss";
import useResult from "../../hooks/useResult";
import "./cardbox.scss";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

// const IS_CUTTING_FROM_BACK = false; // 내보내기 버튼은 백(true) 또는 프론트(false)에서 가능
function BookMarker({ url, duration, bookmarker }) {
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

  const fileMp3Html = useRef(null);
  const ffmpeg = useContext(FFmpegContext);
  const [downloadLink, setDownloadLink] = useState("");
  const bookscroll = document.querySelector("#bookmarkScroll");

  // localstorage 불러오기
  useEffect(() => {
    const temp = localStorage.getItem("markers");
    const loadedMarkers = JSON.parse(temp);

    if (loadedMarkers) {
      setMarkers(loadedMarkers);
    }
  }, []);

  // localstorage 저장하기
  useEffect(() => {
    const temp = JSON.stringify(markers);
    localStorage.setItem("markers", temp);
  }, [markers]);

  // DB로부터 들어온 북마크
  useEffect(() => {
    if (!bookmarker) return;
    setMarkers(bookmarker);
  }, [bookmarker]);

  // 함수 담아서 다른 컴포넌트로 보낼 준비
  useEffect(() => {
    if (!replayRef) return;
    replayRef.current.saveMarker = handleClick;
    replayRef.current.cutMarker.doExport = doExport;
  }, [url, markers]);

  // 내보내기 위해 원본 파일명 읽기
  const getFile = (file) => {
    if (file.current && file.current.files && file.current.files.length !== 0) {
      console.log(
        "file.current",
        file.current,
        "file.current.files",
        file.current.files
      );
      return file.current.files[0];
    } else {
      return null;
    }
  };

  // 선택된 북마크들로부터 시간 리스트로 읽기
  const getMarkerTime = (markerList) => {
    const selectedMarkers = [...markers].filter(
      (marker) => marker.completed === true
    );
    const cutTimeList = selectedMarkers?.map((marker) => ({
      start: marker.startPointer,
      end: marker.endPointer,
    }));
    console.log(
      "markers",
      markerList,
      "selectedMarkers",
      selectedMarkers,
      "getMarkerTime",
      cutTimeList
    );
    return cutTimeList;
  };

  // 내보내기 위해 원본파일 이름에서 시퀸스 번호 붙이기
  const inputToOutName = (inputName, index) => {
    if (inputName) {
      const [name, ext] = inputName.split(".");
      return name + "-" + (index + 1) + "." + ext;
    }
  };

  // 내보내기 작업 함수
  const doExport = async () => {
    replayRef.current.cutMarker.message = "Loading ffmpeg-core.js";
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    const mp4 = getFile(fileMp3Html);
    if (mp4) {
      ffmpeg.FS(
        "writeFile",
        "input.mp4",
        new Uint8Array(await mp4.arrayBuffer())
      );
      replayRef.current.cutMarker.message = "Start Export";
      // setMessage("Start Export");
      console.log("markers in mp4 in async", markers);
      const cutTimeList = getMarkerTime(markers);
      let i = 0;
      // 북마크 개수만큼 자르자!
      while (i < cutTimeList.length) {
        console.log("while", "i", i, "cutTimeList", cutTimeList);
        //   ffmpeg -ss 00:00:00 -to 01:00:00  -i input.mp4 -c copy out.mp4
        const outName = inputToOutName(mp4.name, i);
        const start = format(cutTimeList[i].start);
        const end = format(cutTimeList[i].end);
        const args = [
          "-ss",
          start,
          "-to",
          end,
          "-i",
          "input.mp4",
          "-c",
          "copy",
          "outfile.mp4",
        ];
        await ffmpeg.run(...args);
        replayRef.current.cutMarker.message = `Complete ${
          i + 1
        }개 파일을 받았습니다.`;
        console.log("outName", outName);
        const data = ffmpeg.FS("readFile", "outfile.mp4");
        URL.revokeObjectURL(downloadLink);
        const tmpDownloadlink = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
        setDownloadLink(tmpDownloadlink);
        const link = document.createElement("a");
        link.href = tmpDownloadlink;
        link.setAttribute("download", outName);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        // 인덱스 +1
        i++;
      }
      ffmpeg.FS("unlink", "input.mp4");
      ffmpeg.FS("unlink", "outfile.mp4");
    } else {
    }
  };

  // 북마크 저장
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
        completed: true,
        isPlaying: false,
      };
      setMarkers([...markers].concat(newMarker));
      goToPostDB();
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
          completed: true,
          isPlaying: false,
        };
        setIsStart(true);
        setMarkers([...markers].concat(newMarker));
        goToPostDB();
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
    goToPostDB();
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
        setRelay((prev) => (prev = true));
        console.log("marker click play", replayRef.current);
      }
    });
    console.log("seekto 함수로 영상재생");
  }

  function goToPostDB() {
    console.log("DB로 post보낼것임");
    console.log(`prev_axios_markers`, markers);
    let postMarkers;
    const selectedMarkers = markers.filter(
      (marker) => marker.completed === true
    );
    if (selectedMarkers.length > 0) {
      postMarkers = selectedMarkers;
    } else {
      postMarkers = markers;
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

  const handleKeyPress = (event, id) => {
    if (event.key === "Enter") {
      console.log("enter press here! ");
      addMemoEdit(id);
    }
  };

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      if (markers.length !== 0) {
        bookscroll.lastChild.scrollIntoView();
      }
    }
  }, [markers]);

  return (
    <>
      <div className="BookMarkerContainer">
        <h2> 컷 보관함 📁</h2>
        <h3>드래그로 선택한 구간을 컷으로 저장할 수 있어요 (Ctrl+Shift+S)</h3>
        <div className="hello" id="bookmarkScroll">
          {markers.map((marker) => (
            <div key={marker.id}>
              <div className="card">
                <div
                  className="card-header"
                  onClick={(e) => {
                    e.preventDefault();
                    playVideo(marker.id);
                  }}
                >
                  <div
                    className="thumbnail"
                    style={{
                      background: `url(${server_addr}/${
                        url?.split("=")[1]
                      }.jpg)`,
                      width: "176px",
                      height: "100px",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: `  ${
                        -177 *
                          Math.floor(
                            Math.floor(marker.startPointer % 60) / 10
                          ) -
                        1
                      }px  ${-100 * Math.floor(marker.startPointer / 60)}px`,
                    }}
                  />
                </div>
                <div className="card-body">
                  <div className="bookmarkTime">
                    {format(marker.startPointer)}~{format(marker.endPointer)}
                  </div>
                  {addMarker === marker.id ? (
                    <input
                      className="tt"
                      type="text"
                      onKeyPress={(e) => handleKeyPress(e, marker.id)}
                      onChange={(e) => setEditingText(e.target.value)}
                      value={editingText}
                    />
                  ) : marker.text ? (
                    <div className="ttt">{marker.text}</div>
                  ) : (
                    <div className="tt"></div>
                  )}

                  <input
                    className="inputCheckbox"
                    type="checkbox"
                    onChange={() => toggleComplete(marker.id)}
                    checked={marker.completed}
                  />

                  <div className="memoAndDelete">
                    {addMarker === marker.id ? (
                      <button
                        className="saveButton"
                        onClick={() => addMemoEdit(marker.id)}
                      >
                        저장
                      </button>
                    ) : (
                      <BorderColorIcon onClick={() => setAddMarker(marker.id)}>
                        메모
                      </BorderColorIcon>
                    )}
                    <DeleteForeverOutlinedIcon
                      onClick={() => deleteMarker(marker.id)}
                    >
                      삭제
                    </DeleteForeverOutlinedIcon>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BookMarker;
