import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import Api from "../../services/Api";

import FormAddPapels from "./forms/AddPapels";

function Careira() {
  const { id } = useParams();
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
      console.error(error);
    }
  };

  useEffect(() => {
    return () => GatThisCareira();
  }, []);

  return (
    <div>
      <FormAddPapels id={id} />
      <div className="bg-DarkMode-2">
        <div className="container">
          <h1>{NomeCareira}</h1>
          {ListaPapels.length > 0 && (
            <div>
              <h2>Operações</h2>
              <div className="card">
                <DataTable
                  value={ListaPapels}
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column field="titulo" header="Papel" sortable />
                  <Column field="classe" header="Classe" sortable />
                  <Column field="setor" header="Setor" sortable />
                  <Column field="qtd" header="Quantidade" sortable />
                  <Column field="valor" header="Valor Total" sortable />
                  <Column field="taxa" header="Taxa" sortable />
                  <Column field="operacao" header="Operação" sortable />
                  <Column field="data" header="Data" sortable />
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
