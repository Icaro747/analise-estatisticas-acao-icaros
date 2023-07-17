import { useContext, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { SelectButton } from "primereact/selectbutton";
import { ResponsiveBar } from "@nivo/bar";
import { CarteiraContext } from "../../context";
import * as S from "./style";

const Graficos = () => {
  const {
    ModoVisao,
    Visao,
    DataGraficoPie,
    ValorTotalPie,
    DataGraficoBar,
    TitulosDividen,
    Setor
  } = useContext(CarteiraContext);

  const typesOpts = ["Porcentagem", "Monetário"];
  const [TypeValor, setTypeValor] = useState("porcentagem");

  return (
    <div className="container">
      <S.BoxG>
        <S.BoxTitolo>
          <h1>Grafico</h1>
          <h2>
            Visão por {Visao}
            {Setor !== "" ? ` Setor ${Setor}` : ""}
          </h2>
        </S.BoxTitolo>
        <ResponsivePie
          onClick={ModoVisao}
          data={DataGraficoPie}
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
                ? `${(
                    ((ValorTotalPie - e.value) / ValorTotalPie - 1) *
                    -1 *
                    100
                  ).toFixed(2)}%`
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
          data={DataGraficoBar}
          keys={TitulosDividen}
          indexBy="country"
          margin={{ top: 30, right: 60, bottom: 60, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "category10" }}
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

export default Graficos;
