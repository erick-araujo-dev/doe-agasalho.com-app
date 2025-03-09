import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePageUser from "../pages/Normal/HomePageUser";
import LoginPage from "../pages/LoginPage";
import BuscarDoacao from "../pages/Normal/BuscarDoacao";
import CadastrarDoacao from "../pages/Normal/CadastrarDoacao";
import HomePageAdmin from "../pages/Admin/HomePageAdmin";
import EditarPontoColeta from "../pages/Admin/EditarPontoColeta";
import CadastrarPontoColeta from "../pages/Admin/CadastrarPontoColeta";
import EditarUsuario from "../pages/Admin/EditarUsuario";
import CadastrarUsuario from "../pages/Admin/CadastrarUsuario";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import RelatorioDoacoes from "../pages/Admin/RelatorioDoacoes";
import EditarUsernameNormal from "../pages/Normal/EditarUsernameNormal";
import EditarUsernameAdmin from "../pages/Admin/EditarUsernameAdmin";
import AlterarSenhaNormal from "../pages/Normal/AlterarSenhaNormal";
import AlterarSenhaAdmin from "../pages/Admin/AlterarSenhaAdmin";



export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route exact path="/home" element={<HomePageUser />} />
        <Route exact path="/doacao" element={<BuscarDoacao />} />
        <Route exact path="/doacao/cadastrar" element={< CadastrarDoacao/>} />
        <Route exact path="/homeadmin" element={<HomePageAdmin />} />
        <Route exact path="/pontocoleta" element={<EditarPontoColeta />} />
        <Route exact path="/pontocoleta/cadastrar" element={<CadastrarPontoColeta />} />
        <Route exact path="/usuario" element={<EditarUsuario />} />
        <Route exact path="/usuario/cadastrar" element={<CadastrarUsuario />} />
        <Route exact path="/doacoes/relatorio" element={<RelatorioDoacoes />} />
        <Route exact path="/normal/nome/editar" element={<EditarUsernameNormal />} />
        <Route exact path="/admin/nome/editar" element={<EditarUsernameAdmin />} />
        <Route exact path="/normal/senha/alterar" element={<AlterarSenhaNormal />} />
        <Route exact path="/admin/senha/alterar" element={<AlterarSenhaAdmin />} />
        <Route exact path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}
