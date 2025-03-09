 //Funcao para fazer logout
export const handleLogout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioTipo");
  localStorage.removeItem("usuarioId");
  localStorage.removeItem("usuarioNome");

  navigate("/login");
};
