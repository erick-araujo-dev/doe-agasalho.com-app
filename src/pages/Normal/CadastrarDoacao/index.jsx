import React, { useEffect, useState } from "react";
import SidebarUser from "../../../components/SidebarNormal";
import "./style.css";
import BoxTitleSection from "../../../components/BoxTitleSection";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import { getCharacteristics, getSizes, getTypes } from "../../../utils/api";
import { verifyAuthenticationNormal } from "../../../utils/verifyAuthentication";
import { Link } from "react-router-dom";

const CadastrarDoacao = () => {
  const [donationCompleted, setDonationCompleted] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [typeSelected, setType] = useState("");
  const [otherType, setOtherType] = useState(false);
  const [otherTypeValue, setOtherTypeValue] = useState("");
  const [sizeSelected, setSize] = useState("");
  const [otherSize, setOtherSize] = useState(false);
  const [otherSizeValue, setOtherSizeValue] = useState("");
  const [characteristicSelected, setCharacteristic] = useState("");
  const [otherCharacteristic, setOtherCharacteristic] = useState(false);
  const [otherCharacteristicValue, setOtherCharacteristicValue] = useState("");
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [amount, setAmount] = useState(1);

  verifyAuthenticationNormal();

  useEffect(() => {
    const getValueById = (elementId) => {
      return document.getElementById(elementId).value;
    };
    const type = getValueById("tipo");
    const size = getValueById("tamanho");
    const characteristic = getValueById("caracteristica");

    getTypes(setTypes, size, characteristic);
    getSizes(setSizes, type, characteristic);
    getCharacteristics(setCharacteristics, type, size);
  }, []);

  const handleOtherChange = (event, setValue, setOther, setOtherValue) => {
    const { value } = event.target;
    if (value === "outro") {
      setValue("");
      setOther(true);
    } else {
      setValue(value);
      setOther(false);
      setOtherValue("");
    }
  };

  const handleCadastrar = async () => {
    const type = otherType ? otherTypeValue : typeSelected;
    const size = otherSize ? otherSizeValue : sizeSelected;
    const characteristic = otherCharacteristic ? otherCharacteristicValue : characteristicSelected;
    const gender = document.getElementById("genero").value;

    try {
      await getProducts(type, size, gender, characteristic);
    } catch (error) {
      console.log(type, size, characteristic, gender);
      console.log(error);
    }
  };

  const getProducts = async (type, size, gender, characteristic) => {
    const response = await axiosWithAuth().get(
      `http://localhost:5059/api/products/filter?type=${type}&size=${size}&gender=${gender}&characteristic=${characteristic}`
    );

    const result = response.data.$values || [];
    if (result.length > 0) {
      const productFound = result[0];
      const item = {
        tipo: productFound.tipo,
        tamanho: productFound.tamanho,
        genero: productFound.genero,
        caracteristica: productFound.caracteristica,
        estoque: productFound.estoque,
        produtoId: productFound.id,
      };

      setItemSelected(item);
      setDonationCompleted(true);
      setRegistrationCompleted(false);
    } else {
      console.log("Nenhum produto encontrado!");
      await createProduct(type, size, gender, characteristic);
    }
  };

  const createProduct = async (type, size, gender, characteristic) => {
    try {
      const requestBody = {
        tipo: type,
        tamanho: size,
        caracteristica: characteristic,
        genero: gender,
      };

      const response = await axiosWithAuth().post(
        "http://localhost:5059/api/products/create",
        requestBody
      );

      console.log(response.data);
      await getProducts(type, size, gender, characteristic);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelRegistration = () => {
    setDonationCompleted(false);
    setItemSelected(null);
  };

  const confirmRegistration = async () => {
    try {
      const response = await axiosWithAuth().post(
        "http://localhost:5059/api/donations/inventory/entry",
        {
          produtoId: itemSelected.produtoId,
          quantidade: amount,
        }
      );

      setDonationCompleted(false);
      setRegistrationCompleted(true);
      console.log(response.data);
      console.log(itemSelected);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          alert(data);
        } else if (status === 500) {
          console.log('Erro interno do servidor');
        }
      } else {
        console.log('Erro na requisição:', error.message);
      }
    }
  };

  const handleCloseConfirmedDonation = () => {
    setRegistrationCompleted(false);
    window.location.reload();
  };

  return (
    <div className="cadastrar-doacao">
      <SidebarUser />
      <main>
        <BoxTitleSection titulo={"Cadastrar doaçao"} />
        <div>
          <h2>Preencha todos os campos para cadastrar uma nova doação:</h2>
        </div>
        <div className="box-busca-cadastro">
          <div className="box-header-busca-cadastro">
            <p>Novo item:</p>
          </div>
          <div className="box-resultado">
            <div className="container-select-cadastro">
              <div className="select-cadastro">
                <label htmlFor="tipo"></label>
                {otherType ? (
                  <input
                  className="capitalize" 
                    type="text"
                    id="tipo"
                    placeholder="Digite Tipo"
                    value={otherTypeValue}
                    onChange={(e) => setOtherTypeValue(e.target.value)}
                  />
                ) : (
                  <select
                  className="capitalize" 
                    id="tipo"
                    value={typeSelected}
                    onChange={(e) =>
                      handleOtherChange(
                        e,
                        setType,
                        setOtherType,
                        setOtherTypeValue
                      )
                    }
                  >
                    <option value="">Selecione Tipo</option>
                    {types.map((tipo) => (
                      <option key={tipo.id} value={tipo.nome}>
                        {tipo.nome}
                      </option>
                    ))}
                    <option value="outro">Outro</option>
                  </select>
                )}
              </div>
              <div className="select-cadastro">
                <label htmlFor="caracteristica"></label>
                {otherCharacteristic ? (
                  <input
                  className="capitalize" 
                    type="text"
                    id="caracteristica"
                    placeholder="Digite Estilo"
                    value={otherCharacteristicValue}
                    onChange={(e) =>
                      setOtherCharacteristicValue(e.target.value)
                    }
                  />
                ) : (
                  <select
                  className="capitalize" 
                    id="caracteristica"
                    value={characteristicSelected}
                    onChange={(e) =>
                      handleOtherChange(
                        e,
                        setCharacteristic,
                        setOtherCharacteristic,
                        setOtherCharacteristicValue
                      )
                    }
                  >
                    <option value="">Selecione Estilo</option>
                    {characteristics.map((characteristic) => (
                      <option key={characteristic} value={characteristic}>
                        {characteristic}
                      </option>
                    ))}
                    <option value="outro">Outro</option>
                  </select>
                )}
              </div>
              <div className="select-cadastro">
                <label htmlFor="tamanho"></label>
                {otherSize ? (
                  <input
                  className="capitalize" 
                    type="text"
                    id="tamanho"
                    placeholder="Digite Tamanho"
                    value={otherSizeValue}
                    onChange={(e) => setOtherSizeValue(e.target.value)}
                  />
                ) : (
                  <select
                  className="capitalize" 
                    id="tamanho"
                    value={sizeSelected}
                    onChange={(e) =>
                      handleOtherChange(
                        e,
                        setSize,
                        setOtherSize,
                        setOtherSizeValue
                      )
                    }
                  >
                    <option value="">Selecione Tamanho</option>
                    {sizes.map((size) => (
                      <option value={size.nome} key={size.id}>
                        {size.nome}
                      </option>
                    ))}
                    <option value="outro">Outro</option>
                  </select>
                )}
              </div>
              <div className="select-cadastro">
                <label htmlFor="genero"></label>
                <select id="genero">
                  <option value="">Selecione Gênero</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="U">Unissex</option>
                </select>
              </div>
              <div className="box-btn-cadastrar-listar">
                  <div className="link-listar-usuario">
                    <Link to="/doacao">Buscar doação</Link>
                  </div>
                 <button className="btn-cadastrar-usuario" onClick={handleCadastrar}>
                   Cadastrar
                 </button>
               </div>
            </div>
            <div className="container-doacao-confirmada">
              {donationCompleted && itemSelected && (
                <div className="overlay">
                  <div className="doacao-confirmada">
                    <h2>CONFIRMAR CADASTRO DE DOAÇÃO!</h2>
                    <p>Você está prestes a cadastrar o seguinte item:</p>
                    <table>
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Estilo</th>
                          <th>Tamanho</th>
                          <th>Gênero</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="capitalize" >
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
                        </tr>
                      </tbody>
                    </table>
                    <div className="box-quantidade">
                      <p>Quantidade: </p>
                      <input
                        type="number"
                        value={amount}
                        id="quantidade"
                        onChange={(e) => setAmount(Number(e.target.value))}/>
                    </div>
                    <div className="botoes-confirmacao">
                      <button onClick={handleCancelRegistration}>Cancelar</button>
                      <button onClick={confirmRegistration}>Confirmar</button>
                    </div>
                  </div>
                </div>
              )}
              {registrationCompleted && (
                <div className="overlay" onClick={handleCloseConfirmedDonation}>
                  <div className="mensagem-doacao-efetuada">
                    <p>ITEM ABAIXO CADASTRADO COM SUCESSO!</p>
                    <div className="lista-resultado-busca">
                      <table className="table">
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
                          <tr className="capitalize" >
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
                            <td>
                              {amount + itemSelected.estoque}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <span
                      className="fechar"
                      onClick={handleCloseConfirmedDonation}
                    >
                      x
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CadastrarDoacao;
