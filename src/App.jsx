import React, {useEffect} from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import MainPage from "./Components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./RoutesConfig/routesConfig";
import { AuthProvider } from "./auth/AuthContext";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
 
  return (
    <PrimeReactProvider>
      <AuthProvider>
        <Toaster position="bottom-center" />
        <Router>
          <MainPage>
            <Routes>
              {routes.map(({ path, element, fallback }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <React.Suspense fallback={fallback}>
                      {element}
                    </React.Suspense>
                  }
                />
              ))}
            </Routes>
          </MainPage>
        </Router>
      </AuthProvider>
    </PrimeReactProvider>
  );
}

export default App;
