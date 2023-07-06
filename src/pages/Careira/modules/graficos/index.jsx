import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ResponsivePie } from "@nivo/pie";
import { SelectButton } from "primereact/selectbutton";

import Api from "../../../../services/Api";
import { AlertContext } from "../../../../contexts/AlertContext";

import * as S from "./style";

const Graficos = ({ id }) => {
  const { NotificationMessage } = useContext(AlertContext);

  const [Visao, setVisao] = useState("Classe");

  const [DataG, setDataG] = useState([]);
  const [Total, setTotal] = useState(0);

  const typesOpts = ["Porcentagem", "monetário"];
  const [TypeValor, setTypeValor] = useState("porcentagem");

  const GetData = async () => {
    try {
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
    } catch (error) {
      NotificationMessage(
        "error",
        "algo deu errado carrega as informações do grafico"
      );
    }
  };

  const GatPapelsByFilterClasse = async (Classe) => {
    try {
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
    } catch (error) {
      NotificationMessage(
        "error",
        "algo deu errado carrega as informações do grafico"
      );
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

  useEffect(() => {
    return () => GetData();
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
      <div className="box-btn-form">
        <SelectButton
          value={TypeValor}
          onChange={(e) => setTypeValor(e.value)}
          options={typesOpts}
        />
      </div>
    </div>
  );
};

Graficos.propTypes = {
  id: PropTypes.string.isRequired
};

export default Graficos;
