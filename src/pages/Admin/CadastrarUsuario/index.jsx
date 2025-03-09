import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../../components/SidebarAdmin";
import BoxTitleSection from "../../../components/BoxTitleSection";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import {verifyAuthenticationAdmin} from "../../../utils/verifyAuthentication";
import { getCollectionPoints } from "../../../utils/api";
import { Eye, EyeClosed } from "phosphor-react";
import { Link } from "react-router-dom";

const CadastrarUsuario = () => {
  const [data, setData] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "",
    pontoColetaId: "",
    showNewPassword: false
  });

  const [showCollectPoint, setShowColectPoint] = useState(true);
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  verifyAuthenticationAdmin(); //Verifica se o user esta autenticado

  useEffect(() => {
    getCollectionPoints(setCollectionPoints);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const parsedValue = name === "numero" ? parseInt(value) : value;
    setData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));

    if (name === "tipo" && value === "admin") {
      setShowColectPoint(false);
    } else {
      setShowColectPoint(true);
    }
    setRegistrationCompleted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        tipo: data.tipo,
        pontoColetaId: data.pontoColetaId,
      };

      const response = await axiosWithAuth().post(
        "http://localhost:5059/api/users/create",
        requestBody
      );

      if (response.status === 200) {
        setRegistrationCompleted(true);
        setData({
          nome: "",
          email: "",
          senha: "",
          tipo: "",
          pontoColetaId: "",
        });
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          alert(data);
        } else if (status === 401) {
          alert('Não autorizado');
        } else if (status === 404) {
          alert('Ponto de coleta não encontrado');
        } else if (status === 409) {
          alert(data);
        } else if (status === 500) {
          console.log('Erro interno do servidor');
        }
      } else {
        console.log('Erro na requisição:', error.message);
      }
    }
  };

  const handleToggleShowNewPassword = () => {
    setData((prevState) => ({
      ...prevState,
      showNewPassword: !prevState.showNewPassword,
    }));
  };

  return (
    <div className="cadastrar-usuario">
      <SidebarAdmin />
      <main>
        <BoxTitleSection titulo={"Cadastrar usuário"} />
        <div>
          <div className="box-admin">
            <div className="title-box">
              <p>Cadastrar novo usuário</p>
            </div>
            <div className="formulario-usuario">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Nome completo usuário"
                      type="text"
                      id="nome"
                      name="nome"
                      value={data.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="E-mail"
                      type="email"
                      id="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Senha forte"
                      type={data.showNewPassword ? "text" : "password"} 
                      id="senha"
                      name="senha"
                      value={data.senha}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleToggleShowNewPassword}
                      className="icon-button"
                    >
                      {data.showNewPassword ? (
                        <EyeClosed className="i-eye" /> 
                      ) : (
                        <Eye className="i-eye" /> 
                      )}
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <select
                      id="tipo"
                      name="tipo"
                      value={data.tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um tipo de usuário</option>
                      <option value="normal">Normal</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    {showCollectPoint && (
                      <div className="form-row">
                        <div>
                          <select
                            id="pontoColetaId"
                            name="pontoColetaId"
                            value={data.pontoColetaId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">
                              Selecione um ponto de coleta
                            </option>
                            {collectionPoints.map((ponto) => (
                              <option key={ponto.id} value={ponto.id}>
                                {ponto.nomePonto}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="box-btn-cadastrar-listar">
                  <div className="link-listar-usuario">
                    <Link to="/usuario">Listar usuários</Link>
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

export default CadastrarUsuario;
