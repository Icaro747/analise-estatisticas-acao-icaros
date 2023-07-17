/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import moment from "moment";
import Api from "../../../services/Api";
import { AlertContext } from "../../../contexts/AlertContext";

export const CarteiraContext = createContext();

const CarteiraProvider = ({ children }) => {
  const [Id, setId] = useState("");

  const { NotificationMessage } = useContext(AlertContext);

  // data Gráficos

  const [Visao, setVisao] = useState("Classe");
  const [MainData, setMainData] = useState([]);
  const [DataGraficoPie, setDataGraficoPie] = useState([]);
  const [ValorTotalPie, setValorTotalPie] = useState(0);
  const [DataGraficoBar, setDataGraficoBar] = useState([]);
  const [TitulosDividen, setTitulosDividen] = useState([]);
  const [ListSetor, setListSetor] = useState([]);
  const [Classe, setClasse] = useState("");
  const [Setor, setSetor] = useState("");

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
      NotificationMessage(
        "error",
        "algo deu errado cadastrar as informações de Setor"
      );
      return false;
    }
  };

  function compararPorDataTexto(a, b) {
    const textoA = a.country.toUpperCase();
    const textoB = b.country.toUpperCase();

    if (textoA < textoB) {
      return -1;
    }
    if (textoA > textoB) {
      return 1;
    }
    return 0;
  }

  const GetDividendos = async () => {
    try {
      const R = await Api.Get(`/Carteira/GetDividendosByCarteira`, {
        idCarteira: Id
      });
      const jsonOriginal = R.data;

      // Objeto para armazenar os dividendos formatados
      const dividendosFormatados = {};

      const newListaTitulosDividen = [];
      // Iterar sobre o JSON original e formatar os dividendos
      jsonOriginal.forEach((item) => {
        if (item.dividendos.length > 0) {
          newListaTitulosDividen.push(item.titulo);
          const { titulo } = item;
          item.dividendos.forEach((dividendo) => {
            const { data } = dividendo;
            const mes = data.slice(0, 7); // Extrair o ano e mês da data
            const { valor } = dividendo;
            if (!dividendosFormatados[mes]) {
              dividendosFormatados[mes] = {};
            }
            if (!dividendosFormatados[mes][titulo]) {
              dividendosFormatados[mes][titulo] = 0;
            }
            dividendosFormatados[mes][titulo] += valor;
          });
        }
      });
      setTitulosDividen(newListaTitulosDividen);

      // Criar o JSON final no formato desejado
      const jsonFinal = [];
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const mes in dividendosFormatados) {
        const item = {
          country: mes
        };
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const titulo in dividendosFormatados[mes]) {
          item[titulo] = dividendosFormatados[mes][titulo];
        }
        jsonFinal.push(item);
      }

      // Exibir o JSON final
      setDataGraficoBar(jsonFinal.sort(compararPorDataTexto));
    } catch (error) {
      NotificationMessage(
        "error",
        "algo deu errado carrega as informações do grafico"
      );
    }
  };

  function obterObjetoPorNome(name) {
    return MainData.find((obj) => {
      return obj.name === name;
    });
  }

  const GetData = async () => {
    try {
      if (MainData.length > 0) {
        const oldData = obterObjetoPorNome("GroupedByClasses");
        if (oldData !== undefined) {
          setDataGraficoPie(oldData.data);
          setValorTotalPie(oldData.total);
          return true;
        }
      }

      const R = await Api.Get(`/Papel/GroupedByClasses`, {
        idCarteira: Id
      });

      const newData = [];
      let newTotal = 0;

      R.data.forEach((item) => {
        newData.push({
          id: item.classe,
          label: item.classe,
          value: item.valor
        });
        newTotal += item.valor;
      });

      setDataGraficoPie(newData);
      setValorTotalPie(newTotal);
      const oldMainData = MainData;
      oldMainData.push({
        name: "GroupedByClasses",
        data: newData,
        total: newTotal
      });
      setMainData(oldMainData);

      return true;
    } catch (error) {
      NotificationMessage(
        "error",
        "algo deu errado carrega as informações do grafico"
      );
      return false;
    }
  };

  const GatPapelsGroupedBySertoFilterByClasses = async (thisClasse) => {
    try {
      if (MainData.length > 0) {
        const oldData = obterObjetoPorNome(
          `GroupedBySertoFilterByClasses${thisClasse}`
        );
        if (oldData !== undefined) {
          setDataGraficoPie(oldData.data);
          setValorTotalPie(oldData.total);
          return true;
        }
      }

      const R = await Api.Get(`/Papel/GroupedBySertoFilterByClasses`, {
        idCarteira: Id,
        classe: thisClasse
      });

      const newData = [];
      let newTotal = 0;

      R.data.forEach((item) => {
        newData.push({
          id: item.classe,
          label: item.classe,
          value: item.valor
        });
        newTotal += item.valor;
      });

      setDataGraficoPie(newData);
      setValorTotalPie(newTotal);
      const oldMainData = MainData;
      oldMainData.push({
        name: `GroupedBySertoFilterByClasses${thisClasse}`,
        data: newData,
        total: newTotal
      });
      setMainData(oldMainData);

      return true;
    } catch (error) {
      NotificationMessage(
        "error",
        "algo deu errado carrega as informações do grafico"
      );
      return false;
    }
  };

  const GetPapelsGroupedByTituloFilterByClasseAndSetor = async (thisSetor) => {
    try {
      if (MainData.length > 0) {
        const oldData = obterObjetoPorNome(
          `GetPapelsGroupedByTituloFilterByClasseAndSetor${thisSetor}`
        );
        if (oldData !== undefined) {
          setDataGraficoPie(oldData.data);
          setValorTotalPie(oldData.total);
          return true;
        }
      }

      const R = await Api.Get(`/Papel/GroupedByTituloFilterByClasseAndSetor`, {
        idCarteira: Id,
        classe: Classe,
        setor: thisSetor
      });

      const newData = [];
      let newTotal = 0;

      R.data.forEach((item) => {
        newData.push({
          id: item.titulo,
          label: item.titulo,
          value: item.valor
        });
        newTotal += item.valor;
      });

      setDataGraficoPie(newData);
      setValorTotalPie(newTotal);
      const oldMainData = MainData;
      oldMainData.push({
        name: `GetPapelsGroupedByTituloFilterByClasseAndSetor${thisSetor}`,
        data: newData,
        total: newTotal
      });
      setMainData(oldMainData);

      return true;
    } catch (error) {
      NotificationMessage(
        "error",
        "algo deu errado carrega as informações do grafico"
      );
      return false;
    }
  };

  const ModoVisao = (e) => {
    const thisSetor =
      ListSetor.includes(e.id.toLowerCase()) || ListSetor.includes(e.id);
    if (thisSetor) {
      GetPapelsGroupedByTituloFilterByClasseAndSetor(e.id);
      setSetor(e.id);
    } else {
      setSetor("");
      if (e.id === "FII" || e.id === "Ação") {
        GatPapelsGroupedBySertoFilterByClasses(e.id);
        setClasse(e.id);
        setVisao(e.id);
      } else {
        setVisao("Classe");
        GetData();
      }
    }
  };

  // fim data Gráficos

  // data Carteira

  const [ListaPapels, setListaPapels] = useState([]);
  const [NomeCareira, setNomeCareira] = useState("");

  const GatThisCareira = async () => {
    try {
      const R = await Api.Get(`/Carteira/${Id}`);

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

  // fim data Carteira

  const GetAllData = async () => {
    if (Id !== "") {
      await GetData();
      await GetAllSetor();
      await GetDividendos();
      await GatThisCareira();
    }
  };

  useEffect(() => {
    GetAllData();
  }, [Id]);

  return (
    <CarteiraContext.Provider
      value={{
        Id,
        setId,
        ModoVisao,
        Visao,
        DataGraficoPie,
        ValorTotalPie,
        DataGraficoBar,
        TitulosDividen,
        Setor,
        NomeCareira,
        ListaPapels,
        ListSetor
      }}
    >
      {children}
    </CarteiraContext.Provider>
  );
};

export default CarteiraProvider;
