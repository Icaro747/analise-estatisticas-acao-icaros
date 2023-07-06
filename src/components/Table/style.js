import styled, { css } from 'styled-components';

export const BoxTabela = styled.div`
  max-height: 700px;
  overflow: overlay;
  ${({ widthSiza }) => widthSiza && css`
    width: ${widthSiza};
  `}
`;

export const Tabela = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 10px;
`;

export const Cabesario = styled.thead`
  font-size: 18px;

  tr{
    th{
      text-align: inherit;
      padding: 10px 0px 10px 5px;
      min-width: 60px;
    }
  }
`;

export const Corpo = styled.tbody`
  color: #000;
  tr{
    transition: all .3s;
    :hover{
      background-color: #cdcdcd;
    }
  }
`;

export const Linha = styled.tr`
  td{
    p,div{
      ${({ corSecundaria }) => corSecundaria ? css`
        background-color: #e8e8e8;
      `: css`
        background-color: #fff;
      `}
    }
  }
`;

export const Celula = styled.td`
  p{
    min-width: max-content;
    width: 100%;
    padding: 10px 0px 10px 5px;
    margin: 1px 0px;
    background-color: white;
  }
`;

export const BoxAcoes = styled.div`
  height: 42px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

export const BoxIMG = styled.div`
  display: flex;
  align-items: center;
  p{
    display: none;
    border: solid 1px #ff0;
  }
  :hover{ 
    p{
      ${({ disabled }) => disabled && css`
        display:block;
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translatex(-50%);
        width: auto;
        padding: 5px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 2px 2px 2px 1px rgb(0 0 0 / 20%);
      `}
    }
  }
`;

export const Image = styled.img`
  width: 16px;
  margin: 0px;
  padding: 0px;
  cursor: pointer;
  ${({ disabled }) => disabled && css`
    cursor: no-drop;
  `}
`;

export const BoxCabesario = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  img{
    width: 15px;
    margin-left: 10px;
    cursor: pointer;
  }
`;

export const Titulo = styled.b`
`;