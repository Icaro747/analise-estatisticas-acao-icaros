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

  const [ValorTotalMovimento, setValorTotalMovimento] = useState(0);
  const [QtdTotal, setQtdTotal] = useState(0);
  const [TotalDividendos, setTotalDividendos] = useState(0);
  const [ValorAcao, setValorAcao] = useState(0);
  const [UtimaAtualizacao, setUtimaAtualizacao] = useState(null);
  const [ValorMedioCompra, setValorMedioCompra] = useState(0);

  const listaCabesario = ["Data", "Operação", "Quantidade", "Taxa", "Valor"];

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
      let newValorTotalMovimento = 0;
      let newQtdTotal = 0;
      let newdividendos = 0;
      let newQtdTotalCompra = 0;
      let newValorTotalCompra = 0;

      R.data.movimentacoes.forEach((element) => {
        newListaMovimento.push({
          data: moment(element.data).format("MM/DD/YYYY"),
          operacao: element.operacao,
          qtd: element.qtd,
          taxa: element.taxa,
          valor: element.valor.toFixed(2).replace(".", ",")
        });

        newValorTotalMovimento +=
          element.qtd <= 0 ? element.valor : element.valor * -1;

        newQtdTotal += element.qtd;

        if (element.operacao === "Compra") {
          newQtdTotalCompra += element.qtd;
          newValorTotalCompra += element.valor;
        }
      });

      R.data.dividendos.forEach((element) => {
        newListaDividendos.push({
          y: element.valor,
          x: moment(element.data).format("MM/DD/YYYY")
        });
        newdividendos += element.valor;
      });

      setValorMedioCompra(newValorTotalCompra / newQtdTotalCompra);
      setTotalDividendos(newdividendos);
      setQtdTotal(newQtdTotal);
      setValorTotalMovimento(newValorTotalMovimento);
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

  const GetAcao = async (acao) => {
    try {
      const R = await Api.Get(`/Cotacao/Acao`, { acao });
      setValorAcao(R.data.valorAtual);
      setUtimaAtualizacao(R.data.dataObtida);
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

  useEffect(() => {
    if (PapelData.titulo !== undefined) GetAcao(PapelData.titulo);
  }, [PapelData]);

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
        {ListaDividendos[0]?.data.length > 0 && (
          <Graficos data={ListaDividendos} />
        )}
        <S.BoxTable>
          <h3>Movimentações</h3>
          <div className="row">
            <div className="col">
              <p>
                <b>Posição atual: </b>
                R$
                {(ValorTotalMovimento + QtdTotal * ValorAcao)
                  .toFixed(2)
                  .replace(".", ",")}
              </p>
              <p>
                <b>Posição: </b>
                {(
                  ((ValorMedioCompra - ValorAcao) / ValorMedioCompra) *
                  100 *
                  -1
                ).toFixed(2)}
                %
              </p>
              <p>
                <b>Total de Dividendos: </b>
                R${TotalDividendos.toFixed(2).replace(".", ",")}
              </p>
              <p>
                <b>Balanço total: </b>
                R$
                {(ValorTotalMovimento + TotalDividendos + QtdTotal * ValorAcao)
                  .toFixed(2)
                  .replace(".", ",")}
              </p>
            </div>
            <div className="col">
              <p>
                <b>Valor médio de compra: </b>
                R${ValorMedioCompra.toFixed(2).replace(".", ",")}
              </p>
              <p>
                <b>Última Atualizacao: </b>
                {moment(UtimaAtualizacao)
                  .utcOffset(-6)
                  .format("DD/MM/YYYY HH:mm")}
              </p>
              <p>
                <b>Valor atual da ação: </b>
                R${ValorAcao.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
          {Movimento.length > 0 && (
            <Table cabecario={listaCabesario} colunas={Movimento} />
          )}
        </S.BoxTable>
      </div>
    </div>
  );
};

export default Papel;
