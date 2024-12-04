import ReactDOM from "react-dom/client";  // Asegúrate de importar 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);  // Usa createRoot en lugar de render
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);