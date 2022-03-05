import { createContext } from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

export default createContext(
  createFFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    log: true,
  })
);
