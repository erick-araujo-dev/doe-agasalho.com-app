import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { Pencil, Plus, Trash } from "phosphor-react";
import BoxTitleSection from "../../../components/BoxTitleSection";
import axiosWithAuth from "../../../utils/axiosWithAuth";
import FormEditarUsuario from "../../../components/FormEditarUsuario";
import { verifyAuthenticationAdmin } from "../../../utils/verifyAuthentication";
import { Link } from "react-router-dom";

const EditarUsuario = () => {
  const [users, setUsers] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  verifyAuthenticationAdmin(); //verifica se o user esta autenticado

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosWithAuth().get(
        "http://localhost:5059/api/users/active"
      );
      setUsers(response.data.$values);
    } catch (error) {
      console.error("Erro ao obter usuários:", error);
    }
  };

  const editUser = (id) => {
    const userFound = users.find((u) => u.id === id);
    setSelectedUser(userFound);
    setDisplayForm(true);
  };

  const deleteUser = (id) => {
    const userFound = users.find((u) => u.id === id);
    setSelectedUser(userFound);
    setShowConfirmation(true);
  };

  const confirmDeletion = async () => {
    try {
      await axiosWithAuth().put(
        `http://localhost:5059/api/users/${selectedUser.id}/deactivate`
      );
      setShowConfirmation(false);
      await getUsers();
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

  const handleCancelDeletion = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="editar-usuario">
      <SidebarAdmin />
      <main>
        <BoxTitleSection titulo={"Editar usuário"} />

        <div className="section-box">
          {displayForm ? (
            <FormEditarUsuario
              usuario={selectedUser}
              mostrarFormulario={() => setDisplayForm(false)}
            />
          ) : (
            <div className="box-admin">
              <div className="title-box">
                <p>Usuários cadastrados:</p>
              </div>
              {showConfirmation ? (
                <div className="doacao-confirmada">
                  <h2>CONFIRMAR EXCLUSÃO!</h2>
                  <p>
                    Você está prestes a excluir o usuário:
                    <br />
                    <strong>{selectedUser.nome}</strong> <br />
                    Após realizar a exclusão o usuário não terá mais acesso ao sistema.
                    <br />
                    Esta ação é irreversível, certifique-se de que esteja certo
                    disso.
                  </p>
                  <div className="botoes-confirmacao">
                    <button onClick={handleCancelDeletion}>Cancelar</button>
                    <button onClick={confirmDeletion}>Confirmar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="container-table">
                    <table className="table-editar-usuario">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Ponto de Coleta</th>
                          <th>Tipo</th>
                          <th>Editar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                          key={user.id}>
                            <td>{user.nome}</td>
                            <td>
                              {user.pontoColeta !== ""
                                ? user.pontoColeta
                                : "---------------"}
                            </td>
                            <td>{user.tipo}</td>
                            <td>
                              {user.tipo !== "admin" && (
                                <Pencil
                                className="icon-edit-delete"
                                onClick={() => editUser(user.id)}
                              />
                                )}
                                {user.tipo !== "admin" && (
                                  <Trash
                                  className="icon-edit-delete"
                                  onClick={() => deleteUser(user.id)}
                                  />
                                )}
                                {user.tipo === "admin" && (
                                "-----------"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Link to="/usuario/cadastrar"
                          className="link-cadastrar-usuario" >
                            <Plus/>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditarUsuario;
