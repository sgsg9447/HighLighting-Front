import { useContext } from "react";
import AppStateContext from "../contexts/AppStateContext";

export default function useRoute() {
  const {
    getMethod,
    goEditor,
    goLoading,
    goNotFound,
    requestResult,
    objChart,
    setObjChart,
  } = useContext(AppStateContext);

  return {
    getMethod,
    goEditor,
    goLoading,
    goNotFound,
    requestResult,
    objChart,
    setObjChart,
  };
}
