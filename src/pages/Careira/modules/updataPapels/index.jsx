/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useState, useContext } from "react";
import { Button } from "primereact/button";

import Api from "../../../../services/Api";
import { AlertContext } from "../../../../contexts/AlertContext";
import { CarteiraContext } from "../../context";
import ContentProgressBar from "../../../../components/ContentProgressBar";

import * as S from "./style";

const UpdatePapels = () => {
  const { NotificationMessage } = useContext(AlertContext);
  const { ListaPapels } = useContext(CarteiraContext);

  const [UpdateList, setUpdateList] = useState([]);
  const [ItemLogin, setItemLogin] = useState(0);

  const GetNewValorListPapeps = async () => {
    try {
      const newLita = [];
      for (const element of ListaPapels) {
        const R = await Api.Get(
          `/api/quote/${element.titulo}?range=1d&interval=1d&fundamental=true&dividends=true`,
          undefined,
          "https://brapi.dev"
        );
        newLita.push({
          data: R.data.requestedAt,
          valro: R.data.results[0].regularMarketPrice,
          titulo: R.data.results[0].symbol
        });
        setItemLogin((e) => e + 1);
      }
      setUpdateList(newLita);
    } catch (error) {
      NotificationMessage("error", "algo deu errado cadastrar as informações");
    }
  };

  const Updata = async () => {
    try {
      setItemLogin(0);
      for (let index = 0; index < UpdateList.length; index++) {
        const payload = {
          acao: UpdateList[index].titulo,
          valorAtual: UpdateList[index].valro,
          dataObtida: UpdateList[index].data
        };
        await Api.Post("/Cotacao", payload);
        setItemLogin((e) => e + 1);
      }
      NotificationMessage(
        "success",
        "valor das ações foram atualizadas com sucesso"
      );
    } catch (error) {
      NotificationMessage("error", "algo deu errado cadastrar as informações");
    }
  };

  return (
    <form className="form-cartier bg-DarkMode-2">
      <h2>Atualizar valor dos papéis</h2>
      {ListaPapels !== undefined && (
        <ContentProgressBar
          currentProgress={ItemLogin}
          fullStop={ListaPapels.length}
        />
      )}
      <div className="box-alinha-item-form">
        {ListaPapels !== undefined && UpdateList.length === 0 && (
          <S.ListItem>
            {ListaPapels.map((item) => (
              <li key={item.id}>{item.titulo}</li>
            ))}
          </S.ListItem>
        )}
        {UpdateList.length > 0 && (
          <S.ListItem>
            {UpdateList.map((item) => (
              <li key={item.titulo}>
                <p>{item.titulo}</p>
                <p>R$ {item.valro.toFixed(2).replace(".", ",")}</p>
              </li>
            ))}
          </S.ListItem>
        )}
      </div>
      <div className="box-btn-form box-btn-salvar">
        <Button type="button" label="Atualizar" onClick={Updata} />
        <Button type="button" label="Buscar" onClick={GetNewValorListPapeps} />
      </div>
    </form>
  );
};

export default UpdatePapels;
