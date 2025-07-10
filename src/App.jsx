import { Toaster } from "react-hot-toast";
import "./App.css";
import MainPage from "./Components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./RoutesConfig/routesConfig";
import { Suspense } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";


function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Router>
        <MainPage>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Suspense>
        </MainPage>
      </Router>
    </>
  );
}

export default App;
