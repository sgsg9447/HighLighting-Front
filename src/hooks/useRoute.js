import { useContext } from "react";
import AppStateContext from "../contexts/AppStateContext";

export default function useRoute() {
  const {
    getMethodHello,
    goEditor,
    goLoading,
    goNotFound,
    requestResult,
  } = useContext(AppStateContext);

  return {
    getMethodHello,
    goEditor,
    goLoading,
    goNotFound,
    requestResult,
  };
}
