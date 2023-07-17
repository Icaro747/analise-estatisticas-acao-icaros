import { useState, useContext } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import Api from "../../../../services/Api";
import { AlertContext } from "../../../../contexts/AlertContext";

const Movimentacao = ({ id }) => {
  const { NotificationMessage } = useContext(AlertContext);

  const [Operacao, setOperacao] = useState({ name: null });
  const [Data, setData] = useState(new Date());
  const [Valor, setValor] = useState(null);
  const [Taxa, setTaxa] = useState(null);
  const [Qtd, setQtd] = useState(null);

  const ValidaCampos = (payload) => {
    if (payload.operacao === null) return false;
    if (payload.valor === null) return false;
    if (payload.taxa === null) return false;
    if (payload.qtd === null) return false;

    return true;
  };

  const CleanAll = () => {
    setOperacao({ name: null });
    setData(new Date());
    setValor(null);
    setTaxa(null);
    setQtd(null);
  };

  const Add = async () => {
    try {
      const payload = {
        idPapel: id,
        data: moment(Data).format("MM/DD/YYYY"),
        operacao: Operacao.name,
        qtd: Operacao.name === "Venda" ? Qtd * -1 : Qtd,
        valor: Valor,
        taxa: Taxa
      };
      if (ValidaCampos(payload)) {
        const R = await Api.Post("/Movimentacao", payload);
        if (R.status === 201) {
          CleanAll();
          NotificationMessage("success", "Movimentacao adicionado com sucesso");
        }
      } else {
        NotificationMessage("warn", "algum dos Campos não foram preenchidos");
      }
    } catch (error) {
      NotificationMessage("error", "algo deu errado cadastrar as informações");
    }
  };

  return (
    <form className="form-cartier bg-DarkMode-2">
      <h2>Nova movimentação</h2>
      <div className="box-alinha-item-form">
        <div className="box-50-width">
          <div className="box-itens-from">
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
          </div>
          <div className="box-itens-from">
            <span className="p-float-label">
              <Calendar
                value={Data}
                onChange={(e) => setData(e.value)}
                dateFormat="dd/mm/yy"
                id="Data"
              />
              <label htmlFor="Data">Data</label>
            </span>
          </div>
        </div>
        <div className="box-50-width">
          <div className="box-itens-from">
            <span className="p-float-label">
              <InputNumber
                value={Qtd}
                onValueChange={(e) => setQtd(e.value)}
                useGrouping={false}
                id="Qtd"
              />
              <label htmlFor="Qtd">Quantidade</label>
            </span>
          </div>
          <div className="box-itens-from">
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
          </div>
          <div className="box-itens-from">
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
          </div>
        </div>
      </div>
      <div className="box-btn-form box-btn-salvar">
        <Button type="button" label="Cadastra" onClick={Add} />
      </div>
    </form>
  );
};

Movimentacao.propTypes = {
  id: PropTypes.string.isRequired
};

export default Movimentacao;
