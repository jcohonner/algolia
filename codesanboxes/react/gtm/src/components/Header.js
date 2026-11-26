import Autocomplete from "./Autocomplete";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WatchListIcon = () => (
  <svg
    fill="#FFFFFF"
    width="64px"
    height="64px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M3,22H21a1,1,0,0,0,1-1.077l-1-13A1,1,0,0,0,20,7H17A5,5,0,0,0,7,7H4a1,1,0,0,0-1,.923l-1,13A1,1,0,0,0,3,22ZM12,4a3,3,0,0,1,3,3H9A3,3,0,0,1,12,4ZM4.926,9H7v2a1,1,0,0,0,2,0V9h6v2a1,1,0,0,0,2,0V9h2.074l.846,11H4.08Z"></path>
    </g>
  </svg>
);

export default function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[#17012c]"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="px-4 md:px-16 py-6 flex flex-col gap-4 flex-row md:items-center md:gap-8">
        <div className="flex items-center space-x-8 w-full md:w-auto">
          <img
            src="/assets/logo-algoflix-darkBG-small.svg"
            alt="Algoflix"
            className="h-5"
            onClick={() => navigate("/")}
          />
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#"
              onClick={() => navigate("/")}
              className="text-sm font-light hover:text-gray-300"
            >
              Home
            </a>
            <a
              href="#"
              onClick={() => navigate("/category/action")}
              className="text-sm font-light hover:text-gray-300"
            >
              Action
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:flex-1 md:ml-auto">
          <Autocomplete />

          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-full hover:bg-white/10 transition text-white"
            aria-label="Cart"
          >
            <WatchListIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}
