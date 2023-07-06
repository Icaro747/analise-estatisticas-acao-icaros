/* eslint-disable no-shadow */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import cheerio from "cheerio";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function AnaliseAcao() {
  const [html, sethtml] = useState("");

  const [Cabesa, setCabesa] = useState([]);
  const [Corpo, setCorpo] = useState([]);
  const [CorpoAprovado, setCorpoAprovado] = useState([]);

  const [ShowAll, setShowAll] = useState(false);

  const Avaliacao = (item, valor) => {
    switch (item) {
      case "P/L":
        if (
          parseFloat(valor.replace(",", ".")) < 9 &&
          parseFloat(valor.replace(",", ".")) > 0
        ) {
          return "verde";
        }
        return "vermelho";

      case "P/VP":
        if (
          parseFloat(valor.replace(",", ".")) < 1.05 &&
          parseFloat(valor.replace(",", ".")) > 0
        ) {
          return "verde";
        }
        return "vermelho";

      case "Div.Yield":
        if (parseFloat(valor.replace(",", ".")) > 0) {
          return "verde";
        }
        return "vermelho";

      case "Mrg. Líq.":
        if (parseFloat(valor.replace(",", ".")) > 0) {
          return "verde";
        }
        return "vermelho";

      case "ROE":
        if (parseFloat(valor.replace(",", ".")) > 0) {
          return "verde";
        }
        return "vermelho";

      case "Dív.Líq/ Patrim.":
        if (parseFloat(valor.replace(",", ".")) < 0.5) {
          return "verde";
        }
        return "vermelho";

      case "Cresc. Rec.5a":
        if (parseFloat(valor.replace(",", ".")) > 0) {
          return "verde";
        }
        return "vermelho";

      default:
        return "";
    }
  };

  const AvaliacaoPontuacao = (item, valor, Pontuacao) => {
    let newValor = Pontuacao;
    switch (item) {
      case "P/L":
        if (
          !(
            parseFloat(valor.replace(",", ".")) < 9 &&
            parseFloat(valor.replace(",", ".")) > 0
          )
        ) {
          newValor += 1;
        }
        break;
      case "P/VP":
        if (
          !(
            parseFloat(valor.replace(",", ".")) < 1.05 &&
            parseFloat(valor.replace(",", ".")) > 0
          )
        ) {
          newValor += 1;
        }
        break;
      case "Div.Yield":
        if (!(parseFloat(valor.replace(",", ".")) > 0)) {
          newValor += 1;
        }
        break;
      case "Mrg. Líq.":
        if (!(parseFloat(valor.replace(",", ".")) > 0)) {
          newValor += 1;
        }
        break;
      case "ROE":
        if (!(parseFloat(valor.replace(",", ".")) > 0)) {
          newValor += 1;
        }
        break;
      case "Dív.Líq/ Patrim.":
        if (!(parseFloat(valor.replace(",", ".")) <= 0.5)) {
          newValor += 1;
        }
        break;
      case "Cresc. Rec.5a":
        if (!(parseFloat(valor.replace(",", ".")) > 0)) {
          newValor += 1;
        }
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }

    return newValor;
  };

  const vai = () => {
    try {
      const src = cheerio.load(html);
      const jsonData = {};

      jsonData.headings = [];
      src("h1").each((index, element) => {
        jsonData.headings.push(src(element).text());
      });

      // Exemplo: converter todos os links <a> para uma lista de objetos { texto, URL } no JSON
      jsonData.links = [];

      src("tr").each((index, element) => {
        jsonData.links.push({
          text: src(element).text(),
          index
        });
      });

      const camesario = [];

      const corpo = [];

      for (let index = 0; index < jsonData.links.length; index++) {
        if (index === 0) {
          jsonData.links[index].text.split("\n").forEach((element) => {
            if (element !== "" && element !== undefined) {
              camesario.push(element);
            }
          });
        } else {
          let newItem = {};
          jsonData.links[index].text.split("\n").forEach((element, i) => {
            newItem = { ...newItem, [camesario[i - 1]]: element };
          });
          newItem = { ...newItem, Pontuacao: 0 };
          corpo.push(newItem);
        }
      }

      for (let i = 0; i < corpo.length; i++) {
        let newPontuacao = corpo[i].Pontuacao;
        for (let j = 0; j < camesario.length; j++) {
          newPontuacao += AvaliacaoPontuacao(
            camesario[j],
            corpo[i][camesario[j]],
            corpo[i].Pontuacao
          );
        }
        corpo[i] = { ...corpo[i], Pontuacao: newPontuacao };
      }

      setCorpo(corpo);
      setCabesa(camesario);

      const novaLista = corpo.filter((objeto) => objeto.Pontuacao === 0);
      setCorpoAprovado(novaLista);
    } catch (error) {
      console.error(error);
    }
  };

  const GatPapel = async (thisDataPapel) => {
    try {
      const returns = await axios.post(
        `https://brapi.dev/api/quote/${thisDataPapel.Papel}?range=1d&interval=1d&fundamental=true&dividends=true`
      );

      returns.data.results.forEach((elementResult) => {
        let Dividend = 0;
        elementResult.dividendsData.cashDividends.forEach((elementDividend) => {
          Dividend += elementDividend.rate;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const htmlToJson = (valorHtml) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(valorHtml, "text/html");

      const elementItemTable = (element, TypeItem) => {
        const listaItem = [];
        const children = element.childNodes;

        if (children.length > 0) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
              if (TypeItem === "thead") {
                listaItem.push(child.innerText);
              } else if (TypeItem === "tbody") {
                listaItem.push(child.innerText);
              }
            }
          }
        }

        return listaItem;
      };

      const elementTabela = (element, TypeItem) => {
        const children = element.childNodes;
        if (children.length > 0) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
              if (child.localName === "thead" && TypeItem === undefined) {
                elementTabela(child, "thead");
              }
              if (child.localName === "tbody" && TypeItem === undefined) {
                elementItemTable(child, "tbody");
              }
              if (TypeItem === "thead") {
                setCabesa(elementItemTable(child, TypeItem));
              }
              if (TypeItem === "tbody") {
              }
            }
          }
        }
      };

      const elementToJson01 = (element) => {
        const children = element.childNodes;
        if (children.length > 0) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
              if (child.localName === "div") {
                elementToJson01(child);
              }
              if (child.localName === "table") {
                elementTabela(child);
              }
            }
          }
        }
      };

      const json = elementToJson01(doc.body);
      return json;
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  return (
    <div className="App">
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              {Cabesa.map((item) => (
                <th key={`Cabesa-${item}`}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Corpo.map((item, i) => (
              <tr
                key={`Corpo-${Cabesa[i]}`}
                className={`item ${
                  !ShowAll && `Pontuacao-${Corpo[i].Pontuacao}`
                }`}
                onClick={() => GatPapel(item)}
              >
                {Cabesa.map((x) => (
                  <td
                    key={`Corpo-${Cabesa[i]}-item-${item[x]}`}
                    className={Avaliacao(x, item[x])}
                  >
                    {item[x]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {CorpoAprovado.length > 0 && (
          <div className="card">
            <DataTable value={CorpoAprovado} tableStyle={{ minWidth: "50rem" }}>
              {Cabesa.map((item) => (
                <Column
                  key={`Column-${item}`}
                  field={item}
                  header={item}
                  sortable
                />
              ))}
            </DataTable>
          </div>
        )}

        <div>
          <textarea
            value={html}
            onChange={(e) => {
              sethtml(e.target.value);
            }}
            id="w3review"
            name="w3review"
            rows="4"
            cols="50"
          />
          <button type="button" onClick={() => vai(html)}>
            Go
          </button>
          <button type="button" onClick={() => setShowAll((e) => !e)}>
            Show All
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnaliseAcao;
