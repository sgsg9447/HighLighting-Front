import { useState } from "react";
import AppStateContext from "../contexts/AppStateContext";
import { useHistory } from "react-router-dom";
import axios from "axios";

const AppStateProvider = ({ children }) => {
  const [url, setUrl] = useState();
  const [result, setResult] = useState();
  const [audio, setAudio] = useState();
  const [video, setVideo] = useState();
  const [chatDistribution, setChatDistribution] = useState();
  const [chatSet, setChatSet] = useState();
  const [chatSuper, setChatSuper] = useState();
  const [objAudio, setObjAudio] = useState();
  const [objChat, setObjChat] = useState();
  const [objVideo, setObjVideo] = useState();
  const [objChart, setObjChart] = useState();
  const [title, setTitle] = useState();
  const [thumbnail, setThumNail] = useState();

  const history = useHistory();
  const goEditor = () => {
    history.push("/editor");
  };

  const goLoading = () => {
    history.push("/loading");
  };

  const goNotFound = () => {
    history.push("/notfound");
  };

  function getMethod(e) {
    console.log("call getMethod()");
    axios
      .get("http://143.248.193.110:5000/flask/hello")
      .then((response) => {
        console.log("Success", response.data);
      })
      .catch((error) => {
        console.log("get메소드 에러");
        console.log(error);
        alert("요청에 실패하였습니다.");
      });
  }

  function requestResult(url) {
    console.log("request start");
    console.time("requestTime");

    axios
      .post("http://143.248.193.110:5000/flask/hello", {
        url: url,
      })
      .then((response) => {
        console.log("Success", response.data);
        // const result = response.data.result;
        localStorage.setItem("prevUrl", url);

        // console.time("mapValueToObj-Audio");
        // objAudio = mapValueToObj(response.data.result.audio);
        // console.timeEnd("mapValueToObj-Audio");
        localStorage.setItem("localAudio", response.data.result.audio);
        setAudio(response.data.result.audio);

        // console.time("mapValueToObj-Chat");
        // objChat = mapValueToObj(response.data.result.chat);
        // console.timeEnd("mapValueToObj-Chat");
        localStorage.setItem(
          "localChatDistribution",
          response.data.result.chat[0]
        );
        setChatDistribution(response.data.result.chat[0]);
        localStorage.setItem(
          "localChatSet",
          JSON.stringify(response.data.result.chat[1])
        );
        setChatSet(response.data.result.chat[1]);
        localStorage.setItem("localChatSuper", response.data.result.chat[2]);
        setChatSuper(response.data.result.chat[2]);

        // console.time("mapValueToObj-Video");
        // objVideo = mapValueToObj(response.data.result.video);
        // console.timeEnd("mapValueToObj-Video");
        localStorage.setItem("localVideo", response.data.result.video);
        setVideo(response.data.result.video);

        // console.log({ 'objAudio': objAudio, 'objVideo': objVideo, 'objChat': objChat });
        console.timeEnd("requestTime");
        console.log("gobefore");

        const title = response.data.result.title;
        setTitle(title);
        console.log(title);
        const thumbnail = response.data.result.thumbnail;
        setThumNail(thumbnail);
        console.log(thumbnail);

        goEditor();
      })
      .catch((error) => {
        console.log(error);
        goNotFound();
      });
    goLoading();
  }

  function mapValueToObj(raw) {
    return raw.map((value, index) => ({ name: index, value: value }));
  }

  return (
    <AppStateContext.Provider
      value={{
        url,
        result,
        audio,
        video,
        chatDistribution,
        chatSet,
        chatSuper,
        objAudio,
        objChat,
        objVideo,
        title,
        thumbnail,
        setTitle,
        setThumNail,

        setUrl,
        setResult,
        setAudio,
        setVideo,
        setChatDistribution,
        setChatSet,
        setChatSuper,
        setObjAudio,
        setObjChat,
        setObjVideo,
        mapValueToObj,

        requestResult,
        getMethod,
        goEditor,
        goLoading,
        goNotFound,

        objChart,
        setObjChart,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
