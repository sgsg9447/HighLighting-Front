import { useContext } from "react";
import AppStateContext from "../contexts/AppStateContext";

const useResult = () => {
  return useContext(AppStateContext);
};

export default useResult;
