import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";

import * as S from "../../home/style";
import Api from "../../../services/Api";
import { AlertContext } from "../../../contexts/AlertContext";

const AddPapels = ({ id }) => {
  const { NotificationMessage } = useContext(AlertContext);

  const [Operacao, setOperacao] = useState({ name: null });
  const [Classe, setClasse] = useState({ name: null });
  const [Data, setData] = useState(new Date());
  const [Titulo, setTitulo] = useState(null);
  const [Valor, setValor] = useState(null);
  const [Setor, setSetor] = useState(null);
  const [Taxa, setTaxa] = useState(null);
  const [Qtd, setQtd] = useState(null);

  const [ListTitulo, setListTitulo] = useState([]);
  const [ListSetor, setListSetor] = useState([]);

  const ValidaCampos = (payload) => {
    if (payload.Operacao === null) return false;
    if (payload.Titulo === null) return false;
    if (payload.Classe === null) return false;
    if (payload.Setor === null) return false;
    if (payload.Valor === null) return false;
    if (payload.Taxa === null) return false;
    if (payload.Qtd === null) return false;

    return true;
  };

  const CleanAll = () => {
    setOperacao({ name: null });
    setClasse({ name: null });
    setData(new Date());
    setTitulo(null);
    setValor(null);
    setSetor(null);
    setTaxa(null);
    setQtd(null);
  };

  const AddPapel = async () => {
    try {
      const payload = {
        IdCarteira: id,
        Data: moment(Data).format("MM/DD/YYYY"),
        Operacao: Operacao.name,
        Titulo,
        Classe: Classe.name,
        Qtd,
        Valor,
        Taxa,
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
      console.error(error);
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
      console.error(error);
      return false;
    }
  };

  const GetAllSetor = async () => {
    try {
      const R = await Api.Get("/Papel/AllSetor");
      const newLista = [];
      R.data.forEach((element) => {
        newLista.push(element.setor);
      });
      setListSetor(newLista);
      return true;
    } catch (error) {
      return false;
    }
  };

  const ControllerStart = async () => {
    await GetAllTitulo();
    await GetAllSetor();
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
    <div className="container">
      <S.FormCartier className="bg-DarkMode-2">
        <h2>Nova Careira</h2>
        <S.BoxAlinhaItemForm>
          <S.BoxFormItem50>
            <S.BoxItensFrom>
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
            </S.BoxItensFrom>
            <S.BoxItensFrom>
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
            </S.BoxItensFrom>
            <S.BoxItensFrom>
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
            </S.BoxItensFrom>
            <S.BoxItensFrom>
              <span className="p-float-label">
                <Dropdown
                  value={Operacao}
                  onChange={(e) => setOperacao(e.value)}
                  options={[
                    { name: "Compra", code: "compra" },
                    { name: "Venda", code: "venda" }
                  ]}
                  optionLabel="name"
                  id="Operacao"
                />
                <label htmlFor="Operacao">Operacao</label>
              </span>
            </S.BoxItensFrom>
            <S.BoxItensFrom>
              <span className="p-float-label">
                <Calendar
                  value={Data}
                  onChange={(e) => setData(e.value)}
                  dateFormat="dd/mm/yy"
                  id="Data"
                />
                <label htmlFor="Data">Data</label>
              </span>
            </S.BoxItensFrom>
          </S.BoxFormItem50>
          <S.BoxFormItem50>
            <S.BoxItensFrom>
              <span className="p-float-label">
                <InputNumber
                  value={Qtd}
                  onValueChange={(e) => setQtd(e.value)}
                  useGrouping={false}
                  id="Qtd"
                />
                <label htmlFor="Qtd">Quantidade</label>
              </span>
            </S.BoxItensFrom>
            <S.BoxItensFrom>
              <span className="p-float-label">
                <InputNumber
                  value={Taxa}
                  onChange={(e) => setTaxa(e.value)}
                  minFractionDigits={2}
                  currency="BRL"
                  mode="currency"
                  id="Taxa"
                />
                <label htmlFor="Taxa">Taxa</label>
              </span>
            </S.BoxItensFrom>
            <S.BoxItensFrom>
              <span className="p-float-label">
                <InputNumber
                  value={Valor}
                  onValueChange={(e) => setValor(e.value)}
                  minFractionDigits={2}
                  currency="BRL"
                  mode="currency"
                  id="Valor"
                />
                <label htmlFor="Valor">Valor</label>
              </span>
            </S.BoxItensFrom>
          </S.BoxFormItem50>
        </S.BoxAlinhaItemForm>
        <S.BoxBtnForm>
          <Button
            type="button"
            label="Cadastra"
            onClick={() => {
              AddPapel();
            }}
          />
        </S.BoxBtnForm>
      </S.FormCartier>
    </div>
  );
};

AddPapels.propTypes = {
  id: PropTypes.string.isRequired
};

export default AddPapels;
