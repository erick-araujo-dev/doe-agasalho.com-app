import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { handleLogout } from "../../utils/helpers";

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    
    const handleLogoutClick = () => {
        handleLogout(navigate);
      };
  return (
    <div className="unauthorized-page">
      <h1>401 - Acesso não autorizado</h1>
      <p>O seu nível de permissão não é suficiente para acessar essa rota.</p>
      <p>Faça login com um usuário autorizado.</p>
      <a className="btn-login" onClick={handleLogoutClick}>Fazer Login</a>
    </div>
  );
};

export default UnauthorizedPage;
