import { useState } from "react";
import AppStateContext from "../contexts/AppStateContext";
import { useHistory } from "react-router-dom";
import axios from "axios";

const AppStateProvider = ({ children }) => {
  const [url, setUrl] = useState();
  const [audio, setAudio] = useState();
  const [video, setVideo] = useState();
  const [duration, setDuration] = useState();
  const [chatDistribution, setChatDistribution] = useState();
  const [chatSet, setChatSet] = useState();
  const [chatSuper, setChatSuper] = useState();
  const [chatKeywords, setChatKeywords] = useState();
  const [isChatSuper, setIsChatSuper] = useState(-1);
  const [isChatKeywords, setIsChatKeywords] = useState(-1);
  const [isKeywordsDownload, setIsKeywordsDownload] = useState(0);
  const [title, setTitle] = useState();
  const [thumbnail, setThumNail] = useState();
  const [bookmarker, setBookmarker] = useState();
  const [markers, setMarkers] = useState([]);
  const [relay, setRelay] = useState(false);
  const [receivedDataSetList, setReceivedDataSetList] = useState();
  const [logged, setLogged] = useState(false);

  const server_addr = "http://143.248.193.175:5000";

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

  function getMethodHello(e) {
    console.log("call getMethod()");
    axios
      .get(server_addr + "/flask/hello")
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
      .post(server_addr + "/flask/hello", {
        url: url,
      })
      .then((response) => {
        console.log("Success", response.data);
        localStorage.setItem("localDuration", response.data.result.duration);
        setDuration(response.data.result.duration);
        console.log(`duration`, response.data.result.duration);

        localStorage.setItem("prevUrl", url);

        localStorage.setItem(
          "markers",
          JSON.stringify(response.data.bookmarker)
        );

        setBookmarker(response.data.bookmarker);
        console.log(response.data.bookmarker);

        localStorage.setItem("localAudio", response.data.result.audio);
        setAudio(response.data.result.audio);

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

        localStorage.setItem("localVideo", response.data.result.video);
        setVideo(response.data.result.video);

        console.timeEnd("requestTime");
        console.log("gobefore");

        const title = response.data.result.title;
        setTitle(title);
        console.log("set Title :", title);

        const thumbnail = response.data.result.thumbnail;
        setThumNail(thumbnail);
        console.log("set thumbnail : ", thumbnail);

        console.log("Go Editor");
        goEditor();
      })
      .catch((error) => {
        console.log("에러 감지");
        console.log(error);
        goNotFound();
      });
    goLoading();
  }

  function getMethodKeywords(e) {
    console.log("call getMethod()");
    axios
      .get(server_addr + "/flask/keywords")
      .then((response) => {
        console.log("Success", response.data);
      })
      .catch((error) => {
        console.log("get메소드 에러");
        console.log(error);
        alert("요청에 실패하였습니다.");
      });
  }

  function requestKeywordsData(url, keywords) {
    console.log("call getMethod()");
    axios
      .post(server_addr + "/flask/keywords", {
        url: url,
        keywords: keywords,
      })
      .then((response) => {
        console.log("Success", response.data);
        const objChatKeywords = response.data.result.distribution.map(
          (value, index) => ({ x: index, y: value })
        );
        setChatKeywords(objChatKeywords);
        setIsKeywordsDownload((prev) => prev + 1);
      })
      .catch((error) => {
        console.log("keyword 요청실패");
        console.log(error);
        alert("키워드 검색요청에 실패하였습니다.");
      });
  }

  function onLogin() {
    setLogged(true);
  }

  const onLogout = () => {
    setLogged(false);
    history.push("/");
  };

  function mapValueToObj(raw) {
    return raw.map((value, index) => ({ name: index, value: value }));
  }

  return (
    <AppStateContext.Provider
      value={{
        relay,
        markers,
        bookmarker,
        url,
        audio,
        video,
        duration,
        chatDistribution,
        chatSet,
        chatSuper,
        chatKeywords,
        isChatSuper,
        isChatKeywords,
        isKeywordsDownload,
        receivedDataSetList,
        title,
        thumbnail,
        logged,
        setLogged,
        setTitle,
        setThumNail,

        setRelay,
        setMarkers,
        setBookmarker,
        setUrl,
        setAudio,
        setVideo,
        setDuration,
        setChatDistribution,
        setChatSet,
        setChatSuper,
        setIsChatSuper,
        setChatKeywords,
        setIsChatKeywords,
        setIsKeywordsDownload,
        setReceivedDataSetList,

        mapValueToObj,
        onLogin,
        onLogout,
        requestKeywordsData,
        getMethodKeywords,
        requestResult,
        getMethodHello,
        goEditor,
        goLoading,
        goNotFound,
        server_addr,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
