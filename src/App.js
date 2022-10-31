import { BrowserRouter, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import { Suspense } from "react";
import { Dashboard } from "./layout";
import Loading from "./components/Loading";

import "./App.css";
import "./Reset.css";
import "antd/dist/antd.css";
import { AppContextProvider } from "./context/AppContext";
import { lazy } from "react";

window.Buffer = window.Buffer || require("buffer").Buffer; 
const ModelEdit = lazy(() => import("./pages/model-edit"));

function App() {
  const renderPublicRoutes = () => {
    return publicRoutes.map((route, index) => {
      return <Route key={index} path={route.path} element={route.component} />;
    });
  };

  const renderPrivateRoutes = () => {
    return privateRoutes.map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <AppContextProvider>
              <Dashboard>{route.component}</Dashboard>
            </AppContextProvider>
          }
        />
      );
    });
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {renderPublicRoutes()}
          {renderPrivateRoutes()}
          <Route path="/types/:id" element={<ModelEdit />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
