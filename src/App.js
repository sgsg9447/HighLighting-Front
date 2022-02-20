import React from "react";
import { Route, Switch } from "react-router-dom";

import AppStateProvider from "./providers/AppStateProvider";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Loading from "./pages/Loading";
import Editor from "./pages/Editor";

import "./App.css";

const App = () => {
  return (
    <>
      <AppStateProvider>
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/loading" component={Loading} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/editor" component={Editor} />
        </Switch>
      </AppStateProvider>
    </>
  );
};

export default App;
