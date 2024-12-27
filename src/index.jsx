import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./theme/index.css"; // Chemin mis à jour pour pointer vers le nouveau fichier CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    console.log('Reconnect WebSocket...');
  });
}
