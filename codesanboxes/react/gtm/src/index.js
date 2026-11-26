import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Home from "./pages/Home";
import Actor from "./pages/Actor";
import Category from "./pages/Category";
import Movie from "./pages/Movie";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Confirmation from "./pages/Confirmation";
import Chat from "./components/Chat";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import "./chat.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Header />
    <div className="px-4  md:px-16 pb-24  pt-30  relative z-10">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:movieId" element={<Movie />} />
        <Route
          path="/category/:categoryPageIdentifier"
          element={<Category />}
        />
        <Route path="/actor/:actorName" element={<Actor />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </div>

    <Chat />
  </BrowserRouter>
);
