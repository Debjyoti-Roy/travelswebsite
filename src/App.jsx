import { Toaster } from "react-hot-toast";
import "./App.css";
import MainPage from "./Components/MainPage";

function App() {
  return (
    <>
    <Toaster position="bottom-center" />
      <MainPage />
    </>
  );
}

export default App;
