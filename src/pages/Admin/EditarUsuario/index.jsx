import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { Pencil, Plus, Trash } from "phosphor-react";
import BoxTitleSection from "../../../components/BoxTitleSection";
import FormEditarUsuario from "../../../components/FormEditarUsuario";
import { verifyAuthenticationAdmin } from "../../../utils/verifyAuthentication";
import { Link } from "react-router-dom";
import { getUsers, deactivateUser } from "../../../api/users";

const EditarUsuario = () => {
  const [users, setUsers] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  verifyAuthenticationAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUsers();
  }, []);

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
      await deactivateUser(selectedUser.id); 
      setShowConfirmation(false);
      window.location.reload()
    } catch (error) {
      console.error(error.message);
      alert(error.message); 
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
                          <tr key={user.id}>
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
                              {user.tipo === "admin" && "-----------"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Link to="/usuario/cadastrar" className="link-cadastrar-usuario">
                      <Plus />
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
