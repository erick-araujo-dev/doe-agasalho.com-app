import React, { useState } from "react";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import BoxTitleSection from "../../../components/BoxTitleSection";
import { useNavigate } from "react-router-dom";
import { verifyAuthenticationNormal } from "../../../utils/verifyAuthentication";
import { Eye, EyeClosed } from "phosphor-react"; 
import SideBarNormal from "../../../components/SidebarNormal";


const AlterarSenhaNormal = () => {
  const [data, setData] = useState({
    senhaAtual: "",
    novaSenha: "",
    ShowCurrentPassword: false, 
    showNewPassword: false,
  });
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const navigate = useNavigate();

  verifyAuthenticationNormal(); //verifica se o user esta autenticado

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = {
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha,
      };

      const response = await axiosWithAuth().put(
        `http://localhost:5059/api/users/${localStorage.getItem(
          "usuarioId"
        )}/changepassword`,
        requestBody
      );
      setRegistrationCompleted(true);
      setData({
        senhaAtual: "",
        novaSenha: "",
        ShowCurrentPassword: false,
        showNewPassword: false,
      });
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      } else if (error.request) {
        console.error("Erro ao fazer a solicitação:", error.request);
      } else {
        console.error("Erro ao configurar a solicitação:", error.message);
      }
    }
  };

  const hadleToggleShowCurrentPassword = () => {
    setData((prevState) => ({
      ...prevState,
      ShowCurrentPassword: !prevState.ShowCurrentPassword,
    }));
  };

  const handleToggleShowNewPassword = () => {
    setData((prevState) => ({
      ...prevState,
      showNewPassword: !prevState.showNewPassword,
    }));
  };


  const handleVoltar = () => {
    navigate(-1);
  };
  return (
    <div className="cadastrar-usuario">
      <SideBarNormal />
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
                      placeholder="Senha atual"
                      type={data.ShowCurrentPassword ? "text" : "password"}
                      name="senhaAtual"
                      value={data.senhaAtual}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={hadleToggleShowCurrentPassword}
                      className="icon-button"
                    >
                      {data.ShowCurrentPassword ? (
                        <EyeClosed className="i-eye" /> 
                      ) : (
                        <Eye className="i-eye" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <input
                      placeholder="Nova Senha"
                      type={data.showNewPassword ? "text" : "password"} 
                      name="novaSenha"
                      value={data.novaSenha}
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

                <div className="btn-editar-voltar">
                  <button
                    className="btn-cadastrar-usuario"
                    onClick={handleVoltar}
                  >
                    Voltar
                  </button>
                  <button className="btn-cadastrar-usuario" type="submit">
                    Alterar
                  </button>
                </div>
              </form>
            </div>
            {registrationCompleted && (
              <div
                className="overlay"
                onClick={() => setRegistrationCompleted(false)}
              >
                <div className="mensagem-doacao-efetuada">
                  <p>SENHA ALTERADA COM SUCESSO!</p>
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
      </main>
    </div>
  );
};

export default AlterarSenhaNormal;
