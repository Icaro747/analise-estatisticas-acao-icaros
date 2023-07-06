import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as S from "./style";

import edit from "../../assets/icon/edit-2-32.png";
import pause from "../../assets/icon/pause-32.png";
import play from "../../assets/icon/play-32.png";
import trash from "../../assets/icon/trash-32.png";
import view from "../../assets/icon/eye-32.png";
import Sort from "../../assets/icon/sort.png";

const Table = ({
  cabecario,
  colunas,
  nameItemStatus,
  isEdit,
  onClickEdit,
  toEdit,
  onClickView,
  widthSiza,
  reorderItems
}) => {
  const [DataTabela, setDataTabela] = useState([]);
  const [ShowTabela, setShowTabela] = useState(false);
  const [Ordem, setOrdem] = useState("");

  useEffect(() => {
    setShowTabela(DataTabela.length > 0);
  }, [DataTabela]);

  useEffect(() => {
    if (colunas.length > 0) {
      const newTabela = [];
      colunas.forEach((element, i) => {
        newTabela.push({ ...element, index: i });
      });
      setDataTabela(newTabela);
    }
  }, [colunas]);

  const Reordenar = (topico) => {
    if (reorderItems.length > 0 && reorderItems.length - 1 >= topico) {
      setShowTabela(false);
      const newData = DataTabela;

      if (Ordem !== reorderItems[topico]) {
        newData.sort((a, b) => {
          if (
            a[reorderItems[topico]].toUpperCase() <
            b[reorderItems[topico]].toUpperCase()
          ) {
            return -1;
          }
          if (
            a[reorderItems[topico]].toUpperCase() >
            b[reorderItems[topico]].toUpperCase()
          ) {
            return 1;
          }
          return 0;
        });
        setOrdem(reorderItems[topico]);
      } else {
        newData.sort((a, b) => {
          if (
            a[reorderItems[topico]].toUpperCase() <
            b[reorderItems[topico]].toUpperCase()
          ) {
            return 1;
          }
          if (
            a[reorderItems[topico]].toUpperCase() >
            b[reorderItems[topico]].toUpperCase()
          ) {
            return -1;
          }
          return 0;
        });
        setOrdem("");
      }
      setDataTabela(newData);
      setTimeout(() => {
        setShowTabela(true);
      }, 10);
    }
  };

  const RenderItensLinha = useCallback(
    (lista) => {
      if (lista.length > 0) {
        const nameColunas = Object.getOwnPropertyNames(lista[0]);
        const indexRemocao = nameColunas.indexOf("onClickStatus");
        if (indexRemocao > -1) nameColunas.splice(indexRemocao, 1);

        return lista.map((item, i) => (
          <S.Linha key={`linha-${i + 1}`} corSecundaria={i % 2 === 0}>
            {nameColunas.map(
              (variable, j) =>
                variable !== "index" && (
                  <S.Celula key={`linha-${i + 1}-colona-${j + 1}`}>
                    <p>{item[variable]}</p>
                  </S.Celula>
                )
            )}
            {isEdit === true && (
              <S.Celula>
                <S.BoxAcoes>
                  {onClickView && (
                    <S.BoxIMG>
                      <S.Image
                        src={view}
                        alt="view"
                        title="visualizar"
                        onClick={() => onClickView(item.index)}
                      />
                    </S.BoxIMG>
                  )}
                  {toEdit !== undefined ? (
                    <S.BoxIMG>
                      <Link to={toEdit.to + toEdit.listId[item.index]}>
                        <S.Image src={edit} alt="edit" title="Editar" />
                      </Link>
                    </S.BoxIMG>
                  ) : (
                    <S.BoxIMG>
                      <S.Image
                        src={edit}
                        alt="edit"
                        title="Editar"
                        onClick={() => onClickEdit(item.index)}
                      />
                    </S.BoxIMG>
                  )}
                </S.BoxAcoes>
              </S.Celula>
            )}
            {nameItemStatus !== undefined && item.Status !== undefined && (
              <S.Celula>
                <S.BoxAcoes>
                  {toEdit !== undefined ? (
                    <S.BoxIMG disabled={item.Status === nameItemStatus}>
                      <Link
                        to={
                          item.Status === nameItemStatus
                            ? "#"
                            : toEdit.to + toEdit.listId[item.index]
                        }
                      >
                        <S.Image
                          src={edit}
                          alt="edit"
                          title="Editar"
                          disabled={item.Status === nameItemStatus}
                        />
                      </Link>
                      <p>
                        Para efetuar essa ação é necessário que campanha esteja
                        no status de Inativo
                      </p>
                    </S.BoxIMG>
                  ) : (
                    <S.BoxIMG disabled={item.Status === nameItemStatus}>
                      <S.Image
                        src={edit}
                        alt="edit"
                        title="Editar"
                        disabled={item.Status === nameItemStatus}
                        onClick={() => {
                          if (item.Status !== nameItemStatus)
                            onClickEdit(item.index);
                        }}
                      />
                      <p>
                        Para efetuar essa ação é necessário que campanha esteja
                        no status de Inativo
                      </p>
                    </S.BoxIMG>
                  )}

                  {item.Status === nameItemStatus ? (
                    <S.Image
                      src={pause}
                      alt="pause"
                      title="Pausar"
                      onClick={item.onClickStatus}
                    />
                  ) : (
                    <S.Image
                      src={play}
                      alt="play"
                      title="Continoar"
                      onClick={item.onClickStatus}
                    />
                  )}
                  <S.BoxIMG disabled={item.Status === nameItemStatus}>
                    <S.Image
                      src={trash}
                      alt="trash"
                      title="Deletar"
                      disabled={item.Status === nameItemStatus}
                    />
                    <p>
                      Para efetuar essa ação é necessário que campanha esteja no
                      status de Inativo
                    </p>
                  </S.BoxIMG>
                </S.BoxAcoes>
              </S.Celula>
            )}
          </S.Linha>
        ));
      }
      return null;
    },
    [DataTabela]
  );

  const Cabesario = useCallback(
    (Cabecario) => (
      <tr>
        {Cabecario.map((item, i) => (
          <th key={`cabecario-${item}`}>
            <S.BoxCabesario>
              <S.Titulo>{item}</S.Titulo>
              {reorderItems[i] !== undefined && (
                <button type="button" onClick={() => Reordenar(i)}>
                  <img src={Sort} alt="sort" />
                </button>
              )}
            </S.BoxCabesario>
          </th>
        ))}
      </tr>
    ),
    [cabecario, Ordem]
  );

  return (
    <S.BoxTabela widthSiza={widthSiza}>
      <S.Tabela>
        <S.Cabesario>{Cabesario(cabecario)}</S.Cabesario>
        {ShowTabela && <S.Corpo>{RenderItensLinha(DataTabela)}</S.Corpo>}
      </S.Tabela>
    </S.BoxTabela>
  );
};

Table.propTypes = {
  cabecario: PropTypes.array.isRequired,
  colunas: PropTypes.array.isRequired,
  nameItemStatus: PropTypes.string,
  isEdit: PropTypes.bool,
  onClickEdit: PropTypes.func,
  toEdit: PropTypes.object,
  widthSiza: PropTypes.string,
  onClickView: PropTypes.func,
  reorderItems: PropTypes.array
};

Table.defaultProps = {
  nameItemStatus: undefined,
  isEdit: false,
  onClickEdit: () => {},
  toEdit: undefined,
  widthSiza: undefined,
  onClickView: undefined,
  reorderItems: []
};

export default Table;
