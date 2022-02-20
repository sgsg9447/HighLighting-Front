import React from "react";
import Header from "../components/Header";
import Wrapper from "../components/editor/Wrapper";

import VideoPlayer from "../components/editor/VideoPlayer";
import ChatViewer from "../components/editor/ChatViewer";
import DataChart from "../components/editor/DataChart";
import BookMarker from "../components/editor/BookMarker";
import CommunicationTool from "../components/editor/CommunicationTool";

import EditorTimePointerProvider from "../providers/EditorTimePointerProvider";

function Editor() {
  return (
    <>
      <Header />
      <EditorTimePointerProvider>
        <Wrapper id="upperlayer">
          <Wrapper id="VideoPlayecover">
            <VideoPlayer />
          </Wrapper>

          <Wrapper id="ChatViewecover">
            <ChatViewer />
          </Wrapper>

          <Wrapper id="CommunicationToocover">
            <CommunicationTool />
          </Wrapper>
        </Wrapper>

        <Wrapper id="lowerlayer">
          <Wrapper id="BookMarkecover">
            <BookMarker />
          </Wrapper>

          <Wrapper id="DataCharcover">
            <DataChart />
          </Wrapper>
        </Wrapper>
      </EditorTimePointerProvider>
    </>
  );
}

export default Editor;
