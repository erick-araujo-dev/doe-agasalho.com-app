import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../../components/SidebarAdmin";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import BoxTitleSection from "../../../components/BoxTitleSection";
import { useNavigate } from "react-router-dom";
import { verifyAuthenticationAdmin } from "../../../utils/verifyAuthentication";

const EditarUsernameAdmin = () => {
  const [username, setUsername] = useState("");
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const navigate = useNavigate();

  verifyAuthenticationAdmin(); //verifica se o user esta autenticado

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const response = await axiosWithAuth().get(
          `http://localhost:5059/api/users/${localStorage.getItem("usuarioId")}`
        );
        const username = response.data.nome;
        setUsername(username);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    getAuthUser();
  }, []);

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = {
        nome: username,
      };

      const response = await axiosWithAuth().put(
        `http://localhost:5059/api/users/${localStorage.getItem(
          "usuarioId"
        )}/updateusername`,
        requestBody
      );
      setRegistrationCompleted(true);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      } else if (error.request) {
        console.error("Erro ao fazer a solicitação:", error.request);
      } else {
        console.error("Erro ao configurar a solicitação:", error.message);
      }
    }
  };

  const handleBack = () =>{
    navigate(-1)
  }

  const handleCloseSucess = () => {
    setRegistrationCompleted(false);
    window.location.reload();
  }
  return (
    <div className="cadastrar-usuario">
      <SidebarAdmin />
      <main>
        <BoxTitleSection titulo={"Editar dados"} />
        <div>
          <div className="box-admin">
            <div className="title-box">
              <p>Editar nome do usuário</p>
            </div>
            <div className="formulario-usuario">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Nome Completo Usuário"
                      type="text"
                      value={username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="btn-editar-voltar">
                  <button className="btn-cadastrar-usuario" onClick={handleBack}>
                    Voltar
                  </button>
                  <button className="btn-cadastrar-usuario" type="submit">
                    Alterar
                  </button>
                </div>
              </form>
            </div>
            {registrationCompleted && (
                <div className="overlay" onClick={() => handleCloseSucess()}>
                  <div className="mensagem-doacao-efetuada">
                    <p>NOME ALTERADO COM SUCESSO!</p>
                    <span
                      className="fechar"
                      onClick={() => handleCloseSucess()}
                    >
                      x
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditarUsernameAdmin;
