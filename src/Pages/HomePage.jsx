import React, { useEffect, useRef } from "react";
import Search from "./HomePageComponents/Search";
import Query from "./HomePageComponents/Query";

const HomePage = () => {
  const topRef = useRef(null);

useEffect(() => {
  if (topRef.current) {
    const navbarHeight = 80; // px height of your navbar
    const elementTop = topRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementTop - navbarHeight,
      behavior: "smooth",
    });
  }
}, []);

  return (
    <>
      <Search ref={topRef} />
      <Query />
    </>
  );
};

export default HomePage;
