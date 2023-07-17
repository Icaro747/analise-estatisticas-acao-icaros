import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Graficos from "./graficos";
import { CarteiraContext } from "../context";
import FormAddPapels from "./forms/AddPapels";
import UpdatePapels from "./updataPapels";

const ModuleCarteira = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setId, NomeCareira, ListaPapels } = useContext(CarteiraContext);

  useEffect(() => {
    return () => {
      setId(id);
    };
  }, []);

  return (
    <div>
      <div className="container">
        <h1 className="cor-titulo-branco">Carteira: {NomeCareira}</h1>
      </div>
      <Graficos />
      <div className="container">
        <div className="row ">
          <div className="col-6">
            <FormAddPapels />
          </div>
          <div className="col-6">
            <UpdatePapels />
          </div>
        </div>
      </div>
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
};

export default ModuleCarteira;
