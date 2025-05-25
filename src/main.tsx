import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserAndProject from "./selectProject/UserAndProject";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserAndProject />
  </React.StrictMode>,
);
