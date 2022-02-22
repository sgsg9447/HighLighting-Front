import React from "react";
import Header from "../components/Header/Header";

import VideoPlayer from "../components/editor/VideoPlayer";
import ChatViewer from "../components/editor/ChatViewer";
import DataChart from "../components/editor/DataChart";
import BookMarker from "../components/editor/BookMarker";
import CommunicationTool from "../components/editor/CommunicationTool";
import EditorTimePointerProvider from "../providers/EditorTimePointerProvider";
import "./Editor.scss";

import useResult from "../hooks/useResult";
import { useState, useEffect } from "react";

function Editor() {

  const { url, chatDistribution, audio, video } = useResult();
  const [chatData, setChatData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [propUrl, setPropUrl] = useState();

  // 채팅 데이터 수신
  useEffect(() => {
    // console.log('useEffectChat-arrived');
    console.time("mapValueToObj-Chart-Chat");


    // 로컬스토리지에서 데이터 받아올 때
    if (!chatDistribution) {
      const localChat = localStorage.getItem("localChatDistribution");
      const arrayChat = JSON.parse("[" + localChat + "]");
      const objChat = arrayChat.map((value, index) => ({ x: index, y: value }));
      setChatData(objChat);
    }
    // POST를 통해 직접 받아올 때
    else {
      setChatData(
        chatDistribution.map((value, index) => ({ x: index, y: value }))
      );
    }
    console.timeEnd("mapValueToObj-Chart-Chat");
  }, []);

  // 비디오 데이터 수신
  useEffect(() => {
    console.time("mapValueToObj-Chart-Video");
    if (!video) {
      const localVideo = localStorage.getItem("localVideo");
      const arrayVideo = JSON.parse("[" + localVideo + "]");
      const objVideo = arrayVideo.map((value, index) => ({
        x: index,
        y: value,
      }));
      setVideoData(objVideo);
      console.log("videoData <- localVideo");
    } else {
      setVideoData(video.map((value, index) => ({ x: index, y: value })));
    }
    console.timeEnd("mapValueToObj-Chart-Video");
  }, []);

  // 오디오 데이터 수신
  useEffect(() => {
    console.time("mapValueToObj-Chart-Audio");
    if (!audio) {
      const localAudio = localStorage.getItem("localAudio");
      const arrayAudio = JSON.parse("[" + localAudio + "]");
      const objAudio = arrayAudio.map((value, index) => ({
        x: index,
        y: value,
      }));
      setAudioData(objAudio);
      console.log("AudioData <- localAudio");
    } else {
      setAudioData(audio.map((value, index) => ({ x: index, y: value })));
    }
    console.timeEnd("mapValueToObj-Chart-Audio");
  }, []);

  // URL 주소(url: AppStateProvider으로부터, localUrl: 로컬스토리지로부터)
  useEffect(() => {
    if (!url) {
      const tmpLocalUrl = localStorage.getItem("prevUrl");
      setPropUrl(tmpLocalUrl);
      console.log("UrlData <- localUrl", tmpLocalUrl);
    } else {
      setPropUrl(url);
    }
  }, []);

  return (
    <>
      <Header />
      <EditorTimePointerProvider>
        <div className="upperlayer">
          <div className="VideoPlayerCover">
            <VideoPlayer />
          </div>

          <div className="ChatViewerCover">
            <ChatViewer />
          </div>

          <div className="CommunicationToolCover">
            <CommunicationTool />
          </div>
        </div>

        <div className="lowerlayer">
          <div className="BookMarkerCover">
            <BookMarker />
          </div>

          <div className="DataChartCover">
            <DataChart
              id="DataChart"
              title="TrippleChartPlayer"
              dataSets={[chatData, videoData, audioData]}
              url={propUrl}
            />
          </div>
        </div>
      </EditorTimePointerProvider>
    </>
  );
}

export default Editor;
