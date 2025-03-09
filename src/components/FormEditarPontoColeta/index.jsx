import React, { useState } from "react";
import './style.css';
import axiosWithAuth from "../../utils/axiosWithAuth";
import { getAddressByZipCode } from "../../utils/api";

const FormEditarPontoColeta = ({ pontoColeta, mostrarFormulario }) => {

//Parei aqui
  const [formData, setFormData] = useState({
    nomePonto: pontoColeta.nomePonto || "",
    cep: pontoColeta.cep.replace('-', '') || "",
    logradouro: pontoColeta.logradouro || "",
    numero: pontoColeta.numero || "",
    complemento: pontoColeta.complemento || "",
    bairro: pontoColeta.bairro || "",
    cidade: pontoColeta.cidade || "",
    estado: pontoColeta.estado || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosWithAuth().put(
        `http://localhost:5059/api/collectpoint/${pontoColeta.id}/update`,
        formData,
        console.log(formData)
      );
      
      
      mostrarFormulario();
      window.location.reload();
      } catch (error) {
        if (error.response) {
          alert(error.response.data)
        } else if (error.request) {
          console.error("Erro ao fazer a solicitação:", error.request);
        } else {
          console.error("Erro ao configurar a solicitação:", error.message);
        }
      }
  };

  const getAddress = async () => {
    await getAddressByZipCode(formData.cep, setFormData);
  };

  const handleCancelar = () => {
    mostrarFormulario();
  };

  return (
    <div className="cadastrar-ponto">
      <main>
        <div>
          <div className="box-admin">
            <div className="title-box">
              <p>Editar usuário:</p>
            </div>
            <div className="formulario-usuario">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Nome"
                      type="text"
                      id="nome"
                      name="nomePonto"
                      value={formData.nomePonto}
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
                      value={formData.cep.replace('-', '')}
                      onChange={handleChange}
                      maxLength={8}
                      inputMode="numeric"
                      onBlur={getAddress}
                      required
                    />
                  </div>
                  <div>
                    <input
                      placeholder="Rua"
                      type="text"
                      id="rua"
                      name="logradouro"
                      value={formData.logradouro}
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
                      value={formData.numero}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      placeholder="Complemento"
                      type="text"
                      id="complemento"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      placeholder="Bairro"
                      type="text"
                      id="bairro"
                      name="bairro"
                      value={formData.bairro}
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
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      placeholder="Estado"
                      type="text"
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="btn-editar-voltar">
                    <button className="btn-cadastrar-usuario" onClick={handleCancelar}>
                      Voltar
                    </button>
                    <button className="btn-cadastrar-usuario" type="submit">
                      Editar
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormEditarPontoColeta;
