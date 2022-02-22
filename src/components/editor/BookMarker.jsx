import React from "react";
// import * as Y from "yjs";
// import create from "zustand";
// import yjs from "zustand-middleware-yjs";
// import { WebrtcProvider } from "y-webrtc";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";

// const ydoc = new Y.Doc();

// new WebrtcProvider("your-room-name", ydoc);

// // Create the Zustand store.
// create(yjs(ydoc, "shared", (set) => ({})));

// const useTagsStore = create(
//   yjs(ydoc, "tags", (set) => ({
//     tags: [""],
//     addTag: (tag) =>
//       set((state) => ({
//         // tags: [...state.tags, tag],
//         tags: [...state.tags, tag],
//       })),
//     removeTag: (index) =>
//       set((state) => ({
//         tags: state.tags.filter((t, _i) => index !== _i),
//       })),
//   }))
// );

// const Tags = () => {
//   const { tags } = useTagsStore();

//   return (
//     <>
//       {tags.map((tag, index) => (
//         <Tag tag={tag} index={index} key={tag + index} />
//       ))}
//     </>
//   );
// };

// const Tag = ({ tag, index }) => {
//   const { removeTag } = useTagsStore();
//   if (tag === 0) {
//   }
//   return (
//     <div>
//       {tag}
//       <button onClick={() => removeTag(index)}>Remove</button>
//     </div>
//   );
// };

function BookMarker() {
  const { pointer } = React.useContext(EditorTimePointerContext);
  // const { addTag } = useTagsStore();
  // const temp = [];

  return (
    <div>
      <h1>북마커 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <h3>유저 클릭 북마크의 start 값으로 Time Pointer 변경</h3>

      {/* <button onClick={() => addTag(pointer)}>북마크</button> */}
      {/* 콘솔에러나서 주석처리해둡니다 - 지훈 */}
      {/* <button onClick={(pointer)}>북마크</button> */}
      {/* <Tags /> */}
    </div>
  );
}

export default BookMarker;