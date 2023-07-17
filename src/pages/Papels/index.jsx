import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import Api from "../../services/Api";
import { AlertContext } from "../../contexts/AlertContext";
import Movimentacao from "./modules/froms/movimentacao";
import Table from "../../components/Table";
import Dividendos from "./modules/froms/Dividendos";
import Graficos from "./modules/graficos";
import * as S from "./style";

const Papel = () => {
  const { id } = useParams();
  const { NotificationMessage } = useContext(AlertContext);

  const [PapelData, setPapelData] = useState({});
  const [Movimento, setMovimento] = useState([]);
  const [ListaDividendos, setListaDividendos] = useState([]);

  function CompararPorDataTexto(a, b) {
    const textoA = a.x.toUpperCase();
    const textoB = b.x.toUpperCase();

    if (textoA < textoB) {
      return -1;
    }
    if (textoA > textoB) {
      return 1;
    }
    return 0;
  }

  function CompararPorDataMovimento(a, b) {
    const DataA = a.data.toUpperCase();
    const DataB = b.data.toUpperCase();

    if (DataA > DataB) {
      return -1;
    }
    if (DataA < DataB) {
      return 1;
    }
    return 0;
  }

  const GetData = async () => {
    try {
      const R = await Api.Get(`/Papel/AllData`, { id });

      const newListaMovimento = [];
      const newListaDividendos = [];
      R.data.movimentacoes.forEach((element) => {
        newListaMovimento.push({
          data: moment(element.data).format("MM/DD/YYYY"),
          operacao: element.operacao,
          qtd: element.qtd,
          taxa: element.taxa,
          valor: element.valor.toFixed(2).replace(".", ",")
        });
      });

      R.data.dividendos.forEach((element) => {
        newListaDividendos.push({
          y: element.valor,
          x: moment(element.data).format("MM/DD/YYYY")
        });
      });

      setPapelData(R.data);
      setMovimento(newListaMovimento.sort(CompararPorDataMovimento));
      setListaDividendos([
        {
          id: "Dividendos",
          data: newListaDividendos.sort(CompararPorDataTexto)
        }
      ]);
    } catch (error) {
      console.error(error);
      NotificationMessage("error", "algo deu errado carrega as informações");
    }
  };

  useEffect(() => {
    return () => {
      GetData();
    };
  }, []);

  return (
    <div className="container">
      <S.BoxTitolo>
        <h1 className="cor-titulo-branco">Pepal</h1>
        <div>
          <h2 className="cor-titulo-branco">Título: {PapelData.titulo}</h2>
          <h2 className="cor-titulo-branco">Setor: {PapelData.setor}</h2>
        </div>
      </S.BoxTitolo>
      <Movimentacao id={id} />
      <Dividendos id={id} />
      <div>
        {ListaDividendos.length > 0 && <Graficos data={ListaDividendos} />}
        <S.BoxTable>
          {Movimento.length > 0 && (
            <Table
              cabecario={["Data", "Operação", "Quantidade", "Taxa", "Valor"]}
              colunas={Movimento}
            />
          )}
        </S.BoxTable>
      </div>
    </div>
  );
};

export default Papel;
