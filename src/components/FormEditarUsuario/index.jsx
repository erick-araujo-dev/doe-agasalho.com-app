import React, { useState, useEffect } from "react";
import axiosWithAuth from "../../utils/axiosWithAuth";
import "./style.css"

const FormEditarUsuario = ({ usuario, mostrarFormulario }) => {
  const [formData, setFormData] = useState({
    nome: usuario.nome || "",
    email: usuario.email || "",
    tipo: usuario.tipo || "",
    pontoColeta: usuario.pontoColeta || "",
  });
  const [pontosColeta, setPontosColeta] = useState([]);

  useEffect(() => {
    buscarPontosColeta();

    if (usuario.pontoColetaId) {
      setFormData((prevData) => ({
        ...prevData,
        pontoColetaId: usuario.pontoColetaId,
      }));
    }
  }, []);

  const buscarPontosColeta = async () => {
    try {
      const response = await axiosWithAuth().get(
        "http://localhost:5059/api/collectpoint"
      );
      setPontosColeta(response.data.$values);
    } catch (error) {
      console.error("Erro ao obter pontos de coleta:", error);
    }
  };

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
        `http://localhost:5059/api/users/${usuario.id}/changecollectpoint`,
        { pontoColetaId: formData.pontoColetaId }
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

  const handleCancelar = () => {
    mostrarFormulario();
  };

  return (
    <div className="cadastrar-usuario">
      <main>
        <div>
          <div className="box-admin">
            <div className="title-box">
              <p>Alterar ponto de coleta do usuário:</p>
            </div>
            <div className="formulario-usuario">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="read-only">
                    <input
                      placeholder="Nome Completo Usuário"
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      readOnly
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div  className="read-only">
                    <input
                      placeholder="Email"
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <select
                      name="pontoColetaId"
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                              Selecione um ponto de coleta
                            </option>
                      {pontosColeta.map((ponto) => (
                        <option
                          key={ponto.id}
                          value={ponto.id}
                          selected={ponto.nomePonto === formData.pontoColeta}
                        >
                          {ponto.nomePonto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="btn-editar-voltar">
                  <button
                    className="btn-cadastrar-usuario"
                    onClick={handleCancelar}
                  >
                    Voltar
                  </button>
                  <button className="btn-cadastrar-usuario" type="submit">
                    Alterar
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

export default FormEditarUsuario;
