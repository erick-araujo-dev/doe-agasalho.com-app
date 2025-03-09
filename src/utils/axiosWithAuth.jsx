import axios from "axios";

const axiosWithAuth = () => {
  const token = localStorage.getItem("token"); // Obtenha o token armazenado no local storage

  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`, // Adicione o token Bearer ao cabeçalho da requisição
    },
  });

  return instance;
};

export default axiosWithAuth;