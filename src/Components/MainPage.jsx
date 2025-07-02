import React from "react";
import Navbar from "../Navbar/Navbar";
import Search from "./HomePageComponents/Search";
import HomePage from "./HomePage";
import Footer from "./Footer";

const MainPage = () => {
  return (
    <>
      <Navbar />
      {/* <Search /> */}
      <HomePage />
      <Footer />
    </>
  );
};

export default MainPage;
