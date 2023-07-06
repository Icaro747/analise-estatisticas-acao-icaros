import { Calendar } from "primereact/calendar";
import { useState, useContext } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import Api from "../../../../services/Api";
import { AlertContext } from "../../../../contexts/AlertContext";

const Dividendos = ({ id }) => {
  const { NotificationMessage } = useContext(AlertContext);

  const [Data, setData] = useState(new Date());
  const [Valor, setValor] = useState(null);

  const CleanAll = () => {
    setData(new Date());
    setValor(null);
  };

  const Add = async () => {
    try {
      const payload = {
        idPapel: id,
        data: moment(Data).format("MM/DD/YYYY"),
        valor: Valor
      };
      if (payload.valor !== null) {
        const R = await Api.Post("/Dividendos", payload);
        if (R.status === 201) {
          CleanAll();
          NotificationMessage("success", "Dividendos adicionado com sucesso");
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
      <h2>Adicional dividendos</h2>
      <div className="box-alinha-item-form">
        <div className="box-50-width">
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

Dividendos.propTypes = {
  id: PropTypes.string.isRequired
};

export default Dividendos;
