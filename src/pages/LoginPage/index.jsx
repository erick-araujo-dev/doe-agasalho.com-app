import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logo_login from "../../assets/images/logo-doe-agasalho.png";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5059/api/login/signin",
        {
          email: email,
          senha: password,
        }
      );

      const token = response.data.token;
      const usuarioTipo = response.data.usuario.tipo;
      const usuarioId = response.data.usuario.id;
      const usuarioNome = response.data.usuario.nome;

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioTipo", usuarioTipo);
      localStorage.setItem("usuarioId", usuarioId);
      localStorage.setItem("usuarioNome", usuarioNome);
      setErrorMessage("");

      if (usuarioTipo === "normal") {
        navigate("/home");
      } else if (usuarioTipo === "admin") {
        navigate("/homeadmin");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          // Usuário não encontrado
          setErrorMessage(error.response.data);
        } else if (error.response.status === 400) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("Erro no servidor.");
        }
      } else if (error.request) {
        // Erro na solicitação (sem resposta do servidor)
        setErrorMessage("Erro na solicitação.");
      } else {
        setErrorMessage("Erro desconhecido.");
      }
      setUsername("");
      setPassword("");
    }
  };

  const getInputClassName = () => {
    return errorMessage ? "password-input error" : "password-input";
  };

  return (
    <div className="banner-login">
      <div className="login-container">
        <img src={logo_login} alt="Logo Doe Agasalho" className="logo-login" />
        <div>
          <h2>Entrar</h2>
          {errorMessage && <p className="mensagem-erro">{errorMessage}</p>}
          <form>
            <div>
              <input
                placeholder="Digite o usuário"
                type="text"
                value={email}
                className={getInputClassName()}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                placeholder="Digite a senha"
                type="password"
                value={password}
                className={getInputClassName()}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleLogin}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
