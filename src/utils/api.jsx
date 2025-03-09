import axios from "axios";
import axiosWithAuth from "./axiosWithAuth";

//api extern
export const getAddressByZipCode = async (cep, setDados) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;

    if (data.erro) {
      return;
    }

    setDados((prevDados) => ({
      ...prevDados,
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
      cep: cep,
    }));
  } catch (error) {
    console.error("Erro ao buscar o CEP", error);
  }
};

//obter todos pontos de coletas
export const getCollectionPoints = async (setCollectionPoints) => {
  try {
    const response = await axiosWithAuth().get(
      "http://localhost:5059/api/collectpoint/"
    );
    setCollectionPoints(response.data.$values);
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

export const getTypes = async (setTypes, size = "", gender = "", characteristic = "") => {  
    try {
      const response = await axiosWithAuth().get(
        `http://localhost:5059/api/products/types?size=${size}&gender=${gender}&characteristic=${characteristic}`
      );
    const types = response.data.$values || [];
    const sortedTypes = types.sort((a, b) => a.nome.localeCompare(b.nome)); 
    setTypes(sortedTypes);
      setTypes(response.data.$values);
    } catch (error) {
      console.error("Erro ao buscar os tipos:", error);
    }
};
  

export const getSizes = async (setSizes, type = "", gender = "", characteristic = "") => {  
    try {
      const response = await axiosWithAuth().get(
        `http://localhost:5059/api/products/sizes?type=${type}&gender=${gender}&characteristic=${characteristic}`
      );
    const sizes = response.data.$values || [];
    const sortedSizes = sizes.sort((a, b) => a.nome.localeCompare(b.nome));
      setSizes(sortedSizes);
    } catch (error) {
      console.error("Erro ao buscar os tamanhos:", error);
    }
};

export const getCharacteristics = async (setCharacteristics, type = "", size = "", gender = "") => {
    try {
      const response = await axiosWithAuth().get(
        "http://localhost:5059/api/products/characteristics?type=" + type + "&size=" + size + "&gender=" + gender
      );
      const data = response.data;
      const values = data["$values"] || [];
      const sortedCharacteristic = values.sort((a, b) => a.localeCompare(b));
      setCharacteristics(sortedCharacteristic);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar as características:", error);
    }
  };

  
export const getGenders = async (setGenders, type = "", size = "", characteristic = "") => {
    try {
      const response = await axiosWithAuth().get(
        "http://localhost:5059/api/products/genders?type=" + type + "&size=" + size + "&characteristic=" + characteristic
      );
      const data = response.data;
      const values = data["$values"] || [];
      setGenders(values);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar as características:", error);
    }
  };