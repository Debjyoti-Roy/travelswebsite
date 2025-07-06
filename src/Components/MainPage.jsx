import React from "react";
import Navbar from "./Navbar";
// import Search from "../Components/HomePageComponents/Search";
// import HomePage from "../Components/HomePage";
import Footer from "./Footer";
import HomePage from "../Pages/HomePage";

const MainPage = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* <HomePage /> */}
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainPage;
