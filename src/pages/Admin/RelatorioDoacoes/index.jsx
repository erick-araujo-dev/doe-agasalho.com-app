import { useEffect, useRef, useState } from "react";
import BoxTitleSection from "../../../components/BoxTitleSection";
import SidebarAdmin from "../../../components/SidebarAdmin";
import "./style.css";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import { printReport } from "../../../components/Print/printReportDonation";
import { verifyAuthenticationAdmin } from "../../../utils/verifyAuthentication";

const RelatorioDoacoes = () => {
  const [collectPoints, setCollectPoints] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const containerRef = useRef(null);

  verifyAuthenticationAdmin();

  useEffect(() => {
    const collectPoint = document.getElementById("ponto-coleta").value;

    getCollectPoints();
    getUsers(collectPoint);
  }, []);

  const getCollectPoints = async () => {
    try {
      const response = await axiosWithAuth().get(
        `http://localhost:5059/api/collectpoint/byuser`
      );
      const points = response.data.$values || [];

      setCollectPoints(points);
    } catch (error) {
      console.error("Erro ao buscar os pontos de coletas:", error);
    }
  };

  const getUsers = async (collectPointId) => {
    try {
      const response = await axiosWithAuth().get(
        `http://localhost:5059/api/users?collectPointId=${collectPointId}`
      );
      const users = response.data.$values || [];
      setUsers(users);
    } catch (error) {
      console.error("Erro ao buscar os usuarios:", error);
    }
  };

  const handleSelectChange = (event) => {
    const { id, value } = event.target;
    const collectPoint =
      id === "ponto-coleta"
        ? value
        : document.getElementById("ponto-coleta").value;
    getUsers(collectPoint);
  };

  const handleFetch = async () => {
    const collectPoint = document.getElementById("ponto-coleta").value;
    const user = document.getElementById("usuario").value;
    const typeOfMovement = document.getElementById("tipo-movimento").value;
    const [month, year] = selectedMonthYear.split("/");

    if (selectedMonthYear === "") {
      alert("Selecione um período válido.");
      return;
    }

    try {
      const response = await axiosWithAuth().get(
        `http://localhost:5059/api/donations?collectPointId=${collectPoint}&userId=${user}&typeOfMovement=${typeOfMovement}&month=${month}&year=${year}`
      );

      const products = response.data.$values || [];
      setResults(products);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar os produtos:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePrintButton = () => {
    printReport(containerRef, selectedMonthYear);
  };

  const generateMonthOptions = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let month = currentMonth; month >= 6; month--) {
      const year = month === currentMonth ? currentYear : currentYear;
      const monthString = month.toString().padStart(2, "0");
      const optionValue = `${monthString}/${year}`;
      const optionLabel = `${monthString}/${year}`;

      options.push(
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      );
    }

    return options;
  };

  const calculateTotals = () => {
    let totalEntrada = 0;
    let totalSaida = 0;
    let totalItens = 0;

    results.forEach((r) => {
      if (r.tipoMovimento === "entrada") {
        totalEntrada += r.quantidade;
      } else if (r.tipoMovimento === "saida") {
        totalSaida += r.quantidade;
      } else if (r.tipoMovimento === "cadastro") {
        totalItens++;
      }
    });

    return { totalEntrada, totalSaida, totalItens };
  };

  const totals = calculateTotals();

  return (
    <div className="relatorio-doacao">
      <SidebarAdmin />
      <main>
        <BoxTitleSection titulo={"Relatório de doações"} />

        <div className="section-box">
          <div className="container-select-busca">
            <div className="select-busca">
              <label htmlFor="ponto-coleta">Unidade: </label>
              <select id="ponto-coleta" onChange={handleSelectChange}>
                <option value="">Todas</option>
                {collectPoints.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.nomePonto}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-busca">
              <label htmlFor="usuario">Usuário: </label>
              <select id="usuario" onChange={handleSelectChange}>
                <option value="">Todos</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-busca">
              <label htmlFor="tipo-movimento">Movimento:</label>
              <select id="tipo-movimento">
                <option value="">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
                <option value="cadastro">Cadastro</option>
              </select>
            </div>
            <div className="select-busca">
              <label htmlFor="data-movimento">Data:</label>
              <select
                id="data-movimento"
                value={selectedMonthYear}
                onChange={(e) => setSelectedMonthYear(e.target.value)}
              >
                <option value="">Selecione Período</option>
                {generateMonthOptions()}
              </select>
            </div>
            <button
              type="button"
              className="btn-buscar-cadastrar"
              onClick={handleFetch}
            >
              Buscar
            </button>
          </div>
          <div className="box-admin">
            <div className="title-box">
              <p>Relatório de doações:</p>
            </div>
            <div className="container-table">
              <table className="table-editar-usuario" ref={containerRef}>
                <thead >
                  <tr>
                    <th >Unidade</th>
                    <th>Tipo</th>
                    <th>Tam.</th>
                    <th>Estilo</th>
                    <th>Movimento</th>
                    <th>Qntd.</th>
                    <th>Usuário</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.$id}>
                      <td>{r.pontoColeta}</td>
                      <td>{r.tipo}</td>
                      <td>{r.tamanho}</td>
                      <td> {r.caracteristica}</td>
                      <td>{r.tipoMovimento}</td>
                      <td>{r.quantidade}</td>
                      <td>{r.usuario}</td>
                      <td>{formatDate(r.dataMovimento)}</td>
                    </tr>
                  ))}
                  {totals.totalEntrada > 0 && (
                    <tr className="row-result row-result-first">
                      <td colSpan={5}>Total de entradas:</td>
                      <td>{totals.totalEntrada}</td>
                      <td colSpan={2}></td>
                    </tr>
                  )}
                  {totals.totalSaida > 0 && (
                    <tr className="row-result">
                      <td colSpan={5}>Total de saídas:</td>
                      <td>{totals.totalSaida}</td>
                      <td colSpan={2}></td>
                    </tr>
                  )}
                  {totals.totalItens > 0 && (
                    <tr className="row-result">
                      <td colSpan={5}>Itens cadastrados:</td>
                      <td>{totals.totalItens}</td>
                      <td colSpan={2}></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="btn-buscar-cadastrar"
              onClick={handlePrintButton}
            >
              Imprimir
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RelatorioDoacoes;
