import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Messages } from "primereact/messages";

import * as S from "./style";

import Navbar from "../../../components/Navbar";
import { AlertContext } from "../../../contexts/AlertContext";

/**
 * O Body contém componentes que são comuns a todas as páginas do site
 * @returns {Component}
 */
function MainBody() {
  const { msgs } = useContext(AlertContext);

  return (
    <main className="MainBox bg-DarkMode-1">
      <Navbar />
      <S.BoxMessages>
        <Messages ref={msgs} />
      </S.BoxMessages>
      <Outlet />
    </main>
  );
}

export default MainBody;
