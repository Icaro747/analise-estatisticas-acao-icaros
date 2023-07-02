import {
  Navigate,
  createBrowserRouter,
  RouterProvider
  // useRouteError
} from "react-router-dom";

import AlertProvider from "../contexts/AlertContext";

import Body from "./pages/MainBody";
import NotFound from "./pages/NotFound";

import Home from "../pages/home";
import AnaliseAcao from "../pages/AnaliseAcao";
import Careira from "../pages/Careira";

import "../assets/styles/main.scss";

/**
 * lista das Rotas
 */
const listRoutes = createBrowserRouter([
  {
    exact: true,
    path: "/",
    element: <Navigate to="/home" />
  },
  {
    exact: true,
    path: "/",
    element: (
      <AlertProvider>
        <Body />
      </AlertProvider>
    ),
    children: [
      {
        path: "home",
        element: <Home />
      },
      {
        path: "AnaliseAcao",
        element: <AnaliseAcao />
      },
      {
        path: "Careira/:id",
        element: <Careira />
      }
    ]
  },
  {
    path: "*", // <-- Erro de rota 404
    element: <NotFound />
  }
]);

function Router() {
  return <RouterProvider router={listRoutes} />;
}

export default Router;
