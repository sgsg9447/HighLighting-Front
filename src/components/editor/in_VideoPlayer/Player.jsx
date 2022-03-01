import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Duration from "./Duration";
import EditorTimePointerContext from "../../../contexts/EditorTimePointerContext";
import "./Player.scss";
function Player({url}) {
  const { changePointer, isplaying, setIsplaying, seeking, setSeeking, played, setPlayed, setPlayerRef } = React.useContext(EditorTimePointerContext);
  const [controls] = useState(false);
  const [volume, setVolume] = useState(0.8);
  // const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate] = useState(1.0);
  // const [seeking, setSeeking] = useState(false);
  const [loop] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setPlayerRef(ref.current);
  }, []);

  const handlePlayPause = () => {
    setIsplaying(!isplaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlay = () => {
    setIsplaying(true);
  };

  const handlePause = () => {
    setIsplaying(false);
  };

  const handleSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    ref.current.seekTo(parseFloat(e.target.value));
  };

  const handleProgress = (state) => {
    if (!seeking) {
      // console.log(state)
      setPlayed(state.played);
      setLoaded(state.loaded);
      changePointer(Math.round(duration * played));
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleEnded = () => {
    setIsplaying(loop);
  };
  
  return (
    <div>
      <div className="player-wrapper">
        <ReactPlayer
          ref={ref}
          className="react-player"
          url={url}
          playing={isplaying}
          controls={controls}
          playbackRate={playbackRate}
          volume={volume}
          loop={loop}
          onReady={() => console.log("onReady")}
          onStart={() => console.log("onStart")}
          onPlay={handlePlay}
          onPause={handlePause}
          onBuffer={() => console.log("onBuffer")}
          onSeek={(e) => console.log("onSeek", e)}
          onEnded={handleEnded}
          onError={(e) => console.log("onError", e)}
          onProgress={handleProgress}
          onDuration={handleDuration}
        />
      </div>

      <div className='hide'>
        <table>
          <tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={handlePlayPause}>
                  {isplaying ? "Pause" : "Play"}
                </button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='hide'>
        <table>
          <tbody>
            <tr>
              <th>url</th>
              <td className={!url ? "faded" : ""}>
                {(url instanceof Array ? "Multiple" : url) || "null"}
              </td>
            </tr>
            <tr>
              <th>isplaying</th>
              <td>{isplaying ? "true" : "false"}</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{played.toFixed(3)}</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{loaded.toFixed(3)}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td>
                <Duration seconds={duration} />
              </td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td>
                <Duration seconds={duration * played} />
              </td>
            </tr>
            <tr>
              <th>remaining</th>
              <td>
                <Duration seconds={duration * (1 - played)} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Player;