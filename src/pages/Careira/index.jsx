import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import Api from "../../services/Api";
import { AlertContext } from "../../contexts/AlertContext";

import FormAddPapels from "./modules/forms/AddPapels";
import Graficos from "./modules/graficos";

function Careira() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { NotificationMessage } = useContext(AlertContext);

  const [NomeCareira, setNomeCareira] = useState("");
  const [ListaPapels, setListaPapels] = useState([]);

  const GatThisCareira = async () => {
    try {
      const R = await Api.Get(`/Cartier/${id}`);

      setNomeCareira(R.data.nome);
      const newListaPapels = [];

      R.data.papels.forEach((elementPapels) => {
        const names = Object.getOwnPropertyNames(elementPapels);
        let newObj = {};
        names.forEach((element) => {
          if (element === "data") {
            newObj = {
              ...newObj,
              [element]: moment(elementPapels[element]).format("DD/MM/YYYY")
            };
          } else {
            newObj = { ...newObj, [element]: elementPapels[element] };
          }
        });
        newListaPapels.push(newObj);
      });

      setListaPapels(newListaPapels);
    } catch (error) {
      NotificationMessage("error", "algo deu errado carregado de informações");
    }
  };

  useEffect(() => {
    return () => GatThisCareira();
  }, []);

  return (
    <div>
      <div className="container">
        <h1 className="cor-titulo-branco">Carteira: {NomeCareira}</h1>
      </div>
      <Graficos id={id} />
      <FormAddPapels id={id} />
      <div className="bg-DarkMode-2">
        <div className="container">
          {ListaPapels.length > 0 && (
            <div>
              <h2>Papéis</h2>
              <div className="card">
                <DataTable
                  value={ListaPapels}
                  tableStyle={{ minWidth: "50rem" }}
                  selectionMode="single"
                  onSelectionChange={(e) => navigate(`/papel/${e.value.id}`)}
                >
                  <Column field="id" header="ID" sortable />
                  <Column field="titulo" header="Papel" sortable />
                  <Column field="classe" header="Classe" sortable />
                  <Column field="setor" header="Setor" sortable />
                </DataTable>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Careira;
