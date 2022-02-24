import { useContext } from "react";
import AppStateContext from "../contexts/AppStateContext";

export default function useRoute() {
  const {
    getMethod,
    goEditor,
    goLoading,
    goNotFound,
    requestResult,
  } = useContext(AppStateContext);

  return {
    getMethod,
    goEditor,
    goLoading,
    goNotFound,
    requestResult,
  };
}
