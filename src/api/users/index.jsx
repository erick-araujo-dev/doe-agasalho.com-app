import axiosWithAuth from "../../utils/axiosWithAuth";

const API_URL = "http://localhost:5059/api/users";

export const getUsers = async () => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}/active`);
    return response.data.$values;
  } catch (error) {
    throw new Error("Erro ao obter usuários: " + error.message);
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await axiosWithAuth().put(
      `${API_URL}/${userId}/deactivate`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao desativar o usuário: " + error.message);
  }
};

