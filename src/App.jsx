import React from "react";
import WebtorPlayer from "./components/WebtorPlayer";
import MovieList from "./components/MovieList";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
      <Route path="/player/:id" element={<WebtorPlayer />} />
    </Routes>
  );
}

export default App;
