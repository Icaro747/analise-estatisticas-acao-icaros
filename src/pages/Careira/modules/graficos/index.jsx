/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ResponsivePie } from "@nivo/pie";
import { SelectButton } from "primereact/selectbutton";
import { ResponsiveBar } from "@nivo/bar";
import Api from "../../../../services/Api";
import { AlertContext } from "../../../../contexts/AlertContext";

import * as S from "./style";

const Graficos = ({ id }) => {
  const { NotificationMessage } = useContext(AlertContext);

  const [Visao, setVisao] = useState("Classe");

  const [MainData, setMainData] = useState([]);

  const [DataG, setDataG] = useState([]);
  const [Total, setTotal] = useState(0);

  const typesOpts = ["Porcentagem", "Monetário"];
  const [TypeValor, setTypeValor] = useState("porcentagem");

  const [DataDividendos, setDataDividendos] = useState([]);
  const [TitulosDividen, setTitulosDividen] = useState([]);

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
      const R = await Api.Get(`/Cartier/GetDividendosByCarteira`, {
        idCarteira: id
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
      for (const mes in dividendosFormatados) {
        const item = {
          country: mes
        };
        for (const titulo in dividendosFormatados[mes]) {
          item[titulo] = dividendosFormatados[mes][titulo];
        }
        jsonFinal.push(item);
      }

      // Exibir o JSON final
      setDataDividendos(jsonFinal.sort(compararPorDataTexto));
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
        const oldData = obterObjetoPorNome("PapelsGroupedByClasses");
        if (oldData !== undefined) {
          setDataG(oldData.data);
          setTotal(oldData.total);
          return true;
        }
      }

      const R = await Api.Get(`/Cartier/PapelsGroupedByClasses`, {
        idCarteira: id
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

      setDataG(newData);
      setTotal(newTotal);
      const oldMainData = MainData;
      oldMainData.push({
        name: "PapelsGroupedByClasses",
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

  const GatPapelsByFilterClasse = async (Classe) => {
    try {
      if (MainData.length > 0) {
        const oldData = obterObjetoPorNome(
          `PapelsGroupedByTituloFilterByClasse${Classe}`
        );
        if (oldData !== undefined) {
          setDataG(oldData.data);
          setTotal(oldData.total);
          return true;
        }
      }

      const R = await Api.Get(`/Cartier/PapelsGroupedByTituloFilterByClasse`, {
        idCarteira: id,
        classe: Classe
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

      setDataG(newData);
      setTotal(newTotal);
      const oldMainData = MainData;
      oldMainData.push({
        name: `PapelsGroupedByTituloFilterByClasse${Classe}`,
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
    if (e.id === "FII" || e.id === "Ação") {
      GatPapelsByFilterClasse(e.id);
      setVisao(e.id);
    } else {
      setVisao("Classe");
      GetData();
    }
  };

  const GetAllData = async () => {
    await GetData();
    await GetDividendos();
  };

  useEffect(() => {
    return () => GetAllData();
  }, []);

  return (
    <div className="container">
      <S.BoxG>
        <S.BoxTitolo>
          <h1>Grafico</h1>
          <h2>Visão por {Visao}</h2>
        </S.BoxTitolo>
        <ResponsivePie
          onClick={ModoVisao}
          data={DataG}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.25}
          padAngle={2}
          cornerRadius={10}
          activeOuterRadiusOffset={20}
          colors={{ scheme: "category10" }}
          borderWidth={3}
          borderColor={{
            from: "color",
            modifiers: [["darker", "1"]]
          }}
          arcLinkLabelsTextOffset={10}
          arcLinkLabelsTextColor="#ffffff"
          arcLinkLabelsDiagonalLength={20}
          arcLinkLabelsStraightLength={20}
          arcLinkLabelsThickness={4}
          arcLinkLabelsColor={{ from: "color", modifiers: [] }}
          arcLabel={(e) =>
            `${
              TypeValor === typesOpts[0]
                ? `${(((Total - e.value) / Total - 1) * -1 * 100).toFixed(2)}%`
                : `R$ ${e.value.toFixed(2).replace(".", ",")}`
            }`
          }
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="black"
          motionConfig="wobbly"
          legends={[]}
        />
      </S.BoxG>
      <div className="box-btn-form mb-5">
        <SelectButton
          value={TypeValor}
          onChange={(e) => setTypeValor(e.value)}
          options={typesOpts}
        />
      </div>
      <S.BoxBar>
        <ResponsiveBar
          data={DataDividendos}
          keys={TitulosDividen}
          indexBy="country"
          margin={{ top: 30, right: 60, bottom: 60, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "category10" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={[
            {
              match: {
                id: "fries"
              },
              id: "dots"
            },
            {
              match: {
                id: "sandwich"
              },
              id: "lines"
            }
          ]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: "middle",
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: "middle",
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]]
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) =>
            `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`
          }
        />
      </S.BoxBar>
    </div>
  );
};

Graficos.propTypes = {
  id: PropTypes.string.isRequired
};

export default Graficos;
