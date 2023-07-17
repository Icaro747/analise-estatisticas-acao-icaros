/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import * as S from "./style";

import { AlertContext } from "../../contexts/AlertContext";
import Api from "../../services/Api";

function Home() {
  const navigate = useNavigate();
  const { NotificationMessage } = useContext(AlertContext);
  const [NomeCarteira, setNomeCarteira] = useState("");
  const [ListaCarteiras, setListaCarteiras] = useState([]);

  const GatAllCareira = async () => {
    try {
      const R = await Api.Get("/Carteira");
      setListaCarteiras(R.data);
    } catch (error) {
      NotificationMessage("error", "algo deu errado carregado de informações");
    }
  };

  const AddCareira = async () => {
    try {
      const payload = {
        nome: NomeCarteira
      };
      const R = await Api.Post("/Carteira", payload);
      GatAllCareira();
    } catch (error) {
      NotificationMessage("error", "algo deu errado cadastrar as informações");
    }
  };

  useEffect(() => {
    return () => GatAllCareira();
  }, []);

  return (
    <div className="bg-DarkMode-1">
      <div className="container">
        <h1 className="cor-titulo-branco">Carteira</h1>
        <S.FormCartier className="bg-DarkMode-2">
          <h2>Nova Carteira</h2>
          <S.BoxItensFrom>
            <span className="p-float-label">
              <InputText
                value={NomeCarteira}
                onChange={(e) => setNomeCarteira(e.target.value)}
                id="nome"
              />
              <label htmlFor="nome">Nome</label>
            </span>
            <Button
              type="button"
              label="Cadastra"
              onClick={() => {
                if (NomeCarteira !== "") AddCareira();
              }}
            />
          </S.BoxItensFrom>
        </S.FormCartier>
      </div>
      <div className="bg-DarkMode-2">
        <div className="container">
          <h2>Lista Carteira</h2>
          {ListaCarteiras.length > 0 && (
            <div className="card">
              <DataTable
                selectionMode="single"
                onSelectionChange={(e) => navigate(`/carteira/${e.value.id}`)}
                value={ListaCarteiras}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column field="id" header="id" sortable />
                <Column field="nome" header="nome" sortable />
              </DataTable>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
