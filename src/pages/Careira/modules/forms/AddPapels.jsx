import { useState, useEffect, useContext } from "react";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";

import Api from "../../../../services/Api";
import { AlertContext } from "../../../../contexts/AlertContext";
import { CarteiraContext } from "../../context";

const FormAddPapels = () => {
  const { Id, ListSetor } = useContext(CarteiraContext);
  const { NotificationMessage } = useContext(AlertContext);

  const [Classe, setClasse] = useState({ name: null });
  const [Titulo, setTitulo] = useState(null);
  const [Setor, setSetor] = useState(null);

  const [ListTitulo, setListTitulo] = useState([]);

  const ValidaCampos = (payload) => {
    if (payload.Titulo === null) return false;
    if (payload.Classe === null) return false;
    if (payload.Setor === null) return false;

    return true;
  };

  const CleanAll = () => {
    setClasse({ name: null });
    setTitulo(null);
    setSetor(null);
  };

  const AddPapel = async () => {
    try {
      const payload = {
        IdCarteira: Id,
        Titulo,
        Classe: Classe.name,
        Setor
      };
      if (ValidaCampos(payload)) {
        const R = await Api.Post("/Papel", payload);
        if (R.status === 201) {
          CleanAll();
          NotificationMessage("success", "Papel adicionado com sucesso");
        }
      } else {
        NotificationMessage("warn", "algum dos Campos não foram preenchidos");
      }
    } catch (error) {
      NotificationMessage("error", "algo deu errado cadastrar as informações");
    }
  };

  const GetAllTitulo = async () => {
    try {
      const R = await Api.Get(`/Papel/AllTitulo`);
      const newLista = [];
      R.data.forEach((element) => {
        newLista.push(element.titulo);
      });
      setListTitulo(newLista);
      return true;
    } catch (error) {
      NotificationMessage(
        "error",
        "algo deu errado cadastrar as informações de Titulo"
      );
      return false;
    }
  };

  const ControllerStart = async () => {
    await GetAllTitulo();
  };

  useEffect(() => {
    return () => ControllerStart();
  }, []);

  const [ItensAutoCompleteTitulo, setItensAutoCompleteTitulo] = useState([]);
  const [ItensAutoCompleteSetor, setItensAutoCompleteSetor] = useState([]);

  const SearchTitulo = (event) => {
    setItensAutoCompleteTitulo(
      ListTitulo.filter((objeto) =>
        objeto.toLowerCase().includes(event.query.toLowerCase())
      )
    );
  };
  const SearchSetor = (event) => {
    const showItem = ListSetor.filter((objeto) =>
      objeto.toLowerCase().includes(event.query.toLowerCase())
    );
    setItensAutoCompleteSetor(showItem);
  };

  return (
    <form className="form-cartier bg-DarkMode-2">
      <h2>Nova Papel</h2>
      <div className="box-alinha-item-form">
        <div className="box-100-width">
          <div className="box-itens-from">
            <span className="p-float-label">
              <AutoComplete
                value={Titulo}
                suggestions={ItensAutoCompleteTitulo}
                completeMethod={SearchTitulo}
                onChange={(e) => setTitulo(e.value)}
                id="Titulo"
              />
              <label htmlFor="Titulo">Titulo</label>
            </span>
          </div>
          <div className="box-itens-from">
            <span className="p-float-label">
              <Dropdown
                value={Classe}
                onChange={(e) => setClasse(e.value)}
                options={[
                  { name: "FII", code: "fii" },
                  { name: "Ação", code: "acao" }
                ]}
                optionLabel="name"
                id="Classe"
              />
              <label htmlFor="Classe">Classe</label>
            </span>
          </div>
          <div className="box-itens-from">
            <span className="p-float-label">
              <AutoComplete
                value={Setor}
                suggestions={ItensAutoCompleteSetor}
                completeMethod={SearchSetor}
                onChange={(e) => setSetor(e.value)}
                id="Setor"
              />
              <label htmlFor="Setor">Setor</label>
            </span>
          </div>
        </div>
      </div>
      <div className="box-btn-form box-btn-salvar">
        <Button
          type="button"
          label="Cadastra"
          onClick={() => {
            AddPapel();
          }}
        />
      </div>
    </form>
  );
};

export default FormAddPapels;
