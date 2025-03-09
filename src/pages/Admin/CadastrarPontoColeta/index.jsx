import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../../components/SidebarAdmin";
import "./style.css";
import BoxTitleSection from "../../../components/BoxTitleSection";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import {verifyAuthenticationAdmin} from "../../../utils/verifyAuthentication";
import { getAddressByZipCode } from "../../../utils/api";
import { Link } from "react-router-dom";

const CadastrarPontoColeta = () => {
  const [data, setData] = useState({
    nomePonto: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  verifyAuthenticationAdmin();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const parsedValue = name === "numero" ? parseInt(value) : value;
    setData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
    setRegistrationCompleted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = {
        nomePonto: data.nomePonto,
        cep: data.cep.replace('-', ''),
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
      };

      const response = await axiosWithAuth().post(
        "http://localhost:5059/api/collectpoint/create",
        requestBody
      );

      if (response.status === 200) {
        setRegistrationCompleted(true);
        setData({
          nomePonto: "",
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
        });
      }

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

  const getAddress = async () => {
    await getAddressByZipCode(data.cep, setData);
  };

  return (
    <div className="cadastrar-ponto">
      <SidebarAdmin />
      <main>
        <BoxTitleSection titulo={"Cadastrar ponto"} />
        <div>
          <div className="box-admin">
            <div className="title-box">
              <p>Cadastrar novo ponto</p>
            </div>
            <div className="formulario-usuario">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Nome do Ponto de Coleta"
                      type="text"
                      id="nome"
                      name="nomePonto"
                      value={data.nomePonto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="CEP"
                      type="text"
                      id="cep"
                      name="cep"
                      value={data.cep.replace('-', '')}
                      onChange={handleChange}
                      onBlur={getAddress}
                      maxLength={8}
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Rua"
                      type="text"
                      id="rua"
                      name="logradouro"
                      value={data.logradouro}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <input
                      placeholder="Número"
                      type="number"
                      id="numero"
                      name="numero"
                      value={data.numero}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                      <input
                        placeholder="Complemento"
                        type="text"
                        id="complemento"
                        name="complemento"
                        value={data.complemento}
                        onChange={handleChange}
                      />
                    </div>
                </div>
                  <div className="form-row">
                    <div>
                      <input
                        placeholder="Bairro"
                        type="text"
                        id="bairro"
                        name="bairro"
                        value={data.bairro}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Cidade"
                      type="text"
                      id="cidade"
                      name="cidade"
                      value={data.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                      <input
                        placeholder="Estado"
                        type="text"
                        id="estado"
                        name="estado"
                        value={data.estado}
                        onChange={handleChange}
                        maxLength={2}
                        required
                      />
                    </div>
                </div>
               <div className="box-btn-cadastrar-listar">
                  <div className="link-listar-usuario">
                    <Link to="/pontocoleta">Listar Pontos</Link>
                  </div>
                 <button className="btn-cadastrar-usuario" type="submit">
                   Cadastrar
                 </button>
               </div>
              </form>
              {registrationCompleted && (
                <div className="overlay" onClick={() => setRegistrationCompleted(false)}>
                  <div className="mensagem-doacao-efetuada">
                    <p>CADASTRO EFETUADO COM SUCESSO!</p>
                    <span
                      className="fechar"
                      onClick={() => setRegistrationCompleted(false)}
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

export default CadastrarPontoColeta;
