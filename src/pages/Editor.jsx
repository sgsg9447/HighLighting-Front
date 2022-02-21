import React from "react";
import Header from "../components/Header/Header";

import VideoPlayer from "../components/editor/VideoPlayer";
import ChatViewer from "../components/editor/ChatViewer";
import DataChart from "../components/editor/DataChart";
import BookMarker from "../components/editor/BookMarker";
import CommunicationTool from "../components/editor/CommunicationTool";
import EditorTimePointerProvider from "../providers/EditorTimePointerProvider";
import "./Editor.scss";

function Editor() {
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

          <div className="CommunicationToocover">
            <CommunicationTool />
          </div>
        </div>

        <div className="lowerlayer">
          <div className="BookMarkecover">
            <BookMarker />
          </div>

          <div className="DataCharcover">
            <DataChart />
          </div>
        </div>
      </EditorTimePointerProvider>
    </>
  );
}

export default Editor;
