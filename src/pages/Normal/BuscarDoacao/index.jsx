import React, { useState, useEffect } from "react";
import SidebarUser from "../../../components/SidebarNormal";
import "./style.css";
import BoxTitleSection from "../../../components/BoxTitleSection";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import {
  getCharacteristics,
  getGenders,
  getSizes,
  getTypes,
} from "../../../utils/api";
import { verifyAuthenticationNormal } from "../../../utils/verifyAuthentication";
import { Pencil, Plus } from "phosphor-react";
import FormEditarProduto from "../../../components/FormEditarProduto";
import { Link } from "react-router-dom";

const BuscarDoacao = () => {
  const [results, setResults] = useState([]);
  const [confirmedDonation, setConfirmedDonation] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [donationCompleted, setDonationCompleted] = useState(false);
  const [donationNotFound, setDonationNotFound] = useState(false);
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [genders, setGenders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [displayForm, setDisplayForm] = useState(false);

  const [amount, setAmount] = useState(1);

  verifyAuthenticationNormal();

  useEffect(() => {
    const getValueById = (elementId) => {
      return document.getElementById(elementId).value;
    };
    const type = getValueById("tipo");
    const size = getValueById("tamanho");
    const gender = getValueById("genero");
    const characteristic = getValueById("caracteristica");

    getTypes(setTypes, size, gender, characteristic);
    getSizes(setSizes, type, gender, characteristic);
    getCharacteristics(setCharacteristics, type, size, gender);
    getGenders(setGenders, type, size, characteristic);
    handleFetch();
  }, []);

  const handleSelectChange = (event) => {
    const { id, value } = event.target;
    const type = id === "tipo" ? value : document.getElementById("tipo").value;
    const size =
      id === "tamanho" ? value : document.getElementById("tamanho").value;
    const gender =
      id === "genero" ? value : document.getElementById("genero").value;
    const characteristic =
      id === "caracteristica"
        ? value
        : document.getElementById("caracteristica").value;

    getTypes(setTypes, size, gender, characteristic);
    getSizes(setSizes, type, gender, characteristic);
    getCharacteristics(setCharacteristics, type, size, gender);
    getGenders(setGenders, type, size, characteristic);
  };

  const handleFetch = async () => {
    setDonationCompleted(false);
    const type = document.getElementById("tipo").value;
    const characteristic = document.getElementById("caracteristica").value;
    const size = document.getElementById("tamanho").value;
    const gender = document.getElementById("genero").value;

    try {
      const response = await axiosWithAuth().get(
        "http://localhost:5059/api/products?type=" +
          type +
          "&size=" +
          size +
          "&gender=" +
          gender +
          "&characteristic=" +
          characteristic
      );

      const products = response.data.$values || [];
      setResults(products);
      setConfirmedDonation(false);
      setItemSelected(null);
      setDonationNotFound(products.length === 0);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar os produtos:", error);
    }
  };

  const handleStockUpdate = async () => {
    const type = document.getElementById("tipo").value;
    const characteristic = document.getElementById("caracteristica").value;
    const size = document.getElementById("tamanho").value;
    const gender = document.getElementById("genero").value;

    try {
      const response = await axiosWithAuth().get(
        "http://localhost:5059/api/products?type=" +
          type +
          "&size=" +
          size +
          "&gender=" +
          gender +
          "&characteristic=" +
          characteristic
      );

      setResults(response.data.$values || []);
      setConfirmedDonation(false);
      setItemSelected(null);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar os produtos:", error);
    }
  };

  const handleDonate = (item) => {
    if (item.estoque < 1) {
      alert("Não há estoque disponível para esta doação.");
      return;
    }

    setItemSelected(item);
    setConfirmedDonation(true);
    setDonationCompleted(false);
  };

  const handleCancelDonate = () => {
    setConfirmedDonation(false);
    setItemSelected(null);
  };

  const handleConfirmDonate = async () => {
    try {
      const response = await axiosWithAuth().post(
        "http://localhost:5059/api/donations/inventory/exit",
        {
          produtoId: itemSelected.id,
          quantidade: amount,
        }
      );

      setConfirmedDonation(false);
      setItemSelected(null);
      setDonationCompleted(true);
      handleStockUpdate();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          alert(data);
        } else if (status === 500) {
          console.log("Erro interno do servidor");
        }
      } else {
        console.log("Erro na requisição:", error.message);
      }
    }
  };

  const editProduct = (id) => {
    const productFound = results.find((p) => p.id === id);
    setSelectedProduct(productFound);
    setDisplayForm(true);
  };

  return (
    <div className="buscar-doacao">
      <SidebarUser />
      <main>
        <BoxTitleSection titulo={"Buscar doaçao"} />
        <div className="container-select-busca">
          <div className="select-busca">
            <label htmlFor="tipo">Tipo:</label>
            <select id="tipo" onChange={handleSelectChange}>
              <option value="">Selecionar</option>
              {types.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="select-busca">
            <label htmlFor="caracteristica">Estilo:</label>
            <select id="caracteristica" onChange={handleSelectChange}>
              <option value="">Selecionar</option>
              {characteristics.map((characteristic) => (
                <option key={characteristic} value={characteristic}>
                  {characteristic}
                </option>
              ))}
            </select>
          </div>
          <div className="select-busca">
            <label htmlFor="tamanho">Tamanho:</label>
            <select id="tamanho" onChange={handleSelectChange}>
              <option value="">Selecionar</option>
              {sizes.map((size) => (
                <option value={size.id} key={size.id}>
                  {size.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="select-busca">
            <label htmlFor="genero">Gênero:</label>
            <select id="genero" onChange={handleSelectChange}>
              <option value="">Selecionar</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender === "M"
                    ? "Masculino"
                    : gender === "F"
                    ? "Feminino"
                    : "Unissex"}
                </option>
              ))}
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
        <div className="box-busca-cadastro">
          {displayForm ? (
            <FormEditarProduto
              produto={selectedProduct}
              mostrarFormulario={() => setDisplayForm(false)}
            />
          ) : (
            <React.Fragment>
              <div className="box-header-busca-cadastro">
                <p>Resultado:</p>
              </div>
              <div className="lista-resultado-busca">
                {donationNotFound ? (
                  <div className="doacao-nao-encontrada">
                    <p>Item indisponível em estoque!</p>
                  </div>
                ) : (
                  <div className="container-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Estilo</th>
                          <th>Tamanho</th>
                          <th>Gênero</th>
                          <th>Estoque</th>
                          <th>Doar</th>
                          <th>Editar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((item) => (
                          <tr
                            key={item.$id}
                            className={item.estoque === 0 ? "out-of-stock" : ""}
                          >
                            <td>{item.tipo}</td>
                            <td>{item.caracteristica}</td>
                            <td>{item.tamanho}</td>
                            <td>
                              {item.genero === "M"
                                ? "Masculino"
                                : item.genero === "F"
                                ? "Feminino"
                                : "Unissex"}
                            </td>
                            <td>{item.estoque}</td>
                            <td>
                              {item.estoque === 0 ? (
                                <button className="btn-doar" disabled>
                                  Esgotado
                                </button>
                              ) : (
                                <button
                                  className="btn-doar"
                                  onClick={() => handleDonate(item)}
                                >
                                  Doar
                                </button>
                              )}
                            </td>
                            <td>
                              <Pencil
                                className="icon-edit-delete"
                                onClick={() => editProduct(item.id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Link to="/doacao/cadastrar"
                          className="link-cadastrar-usuario" >
                            <Plus/>
                    </Link>
                  </div>
                )}
              </div>
              <div className="container-doacao-confirmada">
                {confirmedDonation && itemSelected && (
                  <div className="overlay">
                    <div className="doacao-confirmada">
                      <h2>CONFIRMAR DOAÇÃO</h2>
                      <p>Você está prestes a doar o seguinte item:</p>
                      <table>
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Estilo</th>
                            <th>Tamanho</th>
                            <th>Gênero</th>
                            <th>Estoque</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{itemSelected.tipo}</td>
                            <td>{itemSelected.caracteristica}</td>
                            <td>{itemSelected.tamanho}</td>
                            <td>
                              {itemSelected.genero === "M"
                                ? "Masculino"
                                : itemSelected.genero === "F"
                                ? "Feminino"
                                : "Unissex"}
                            </td>
                            <td>{itemSelected.estoque}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="box-quantidade">
                        <p>Quantidade: </p>
                        <input
                          type="number"
                          value={amount}
                          id="quantidade"
                          onChange={(e) => setAmount(Number(e.target.value))}
                        />
                      </div>

                      <div className="botoes-confirmacao">
                        <button onClick={handleCancelDonate}>Cancelar</button>
                        <button onClick={handleConfirmDonate}>Confirmar</button>
                      </div>
                    </div>
                  </div>
                )}
                {donationCompleted && (
                  <div
                    className="overlay"
                    onClick={() => setDonationCompleted(false)}
                  >
                    <div className="mensagem-doacao-efetuada">
                      <p>DOAÇÃO EFETUADA COM SUCESSO!</p>
                      <span
                        className="fechar"
                        onClick={() => setDonationCompleted(false)}
                      >
                        x
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuscarDoacao;
