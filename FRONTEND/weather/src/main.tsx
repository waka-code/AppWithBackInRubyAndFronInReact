import React from "react";
import ReactDOM from "react-dom/client";
import { WeatherDisplay } from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WeatherDisplay />
  </React.StrictMode>
);
