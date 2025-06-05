import logo_sidebar from "../../assets/images/logo-doe-agasalho.png";
import { House, Scroll, SignOut, Storefront, Users} from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/helpers";

const SidebarAdmin = () => {
    const navigate = useNavigate();
    
    const handleLogoutClick = () => {
        handleLogout(navigate);
      };

    return (
        <div className="sidebar">
            <aside>
                <div>
                    <img
                        src={logo_sidebar}
                        alt="Logo Doe Agasalho"
                        title="Logo Doe Agasalho"
                        className="logo-sidebar"
                    />
                </div>
                <nav>
                    <ul>
                        <span>Menu</span>
                        <li  className={location.pathname === "/homeadmin" ? "active-route" : ""}>
                            <i>
                                <House />
                            </i>
                            <Link
                                to="/homeadmin"
                               
                            >
                                Página Inicial
                            </Link>
                        </li>
                        <li className={location.pathname === "/pontocoleta" || location.pathname === "/pontocoleta/cadastrar" ? "active-route" : ""}>
                            <i>
                                <Storefront />
                            </i>
                            <Link
                                to="/pontocoleta"
                            >
                                Pontos de Coletas
                            </Link>
                        </li>
                        <li className={location.pathname === "/usuario" || location.pathname === "/usuario/cadastrar" ? "active-route" : ""}>
                            <i>
                                <Users />
                            </i>
                            <Link
                                to="/usuario"
                                
                            >
                                Usuários
                            </Link>
                        </li>
                        <li className={location.pathname === "/doacoes/relatorio" ? "active-route" : ""}>
                            <i>
                                <Scroll />
                            </i>
                            <Link
                                to="/doacoes/relatorio"
                                
                            >
                                Relatório Doações
                            </Link>
                        </li>
                    </ul>

                    <ul>
                        <span>Geral</span>
                        <li onClick={handleLogoutClick}>
                            <i>
                                <SignOut /> 
                            </i>
                            <a>Sair</a>
                            
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
};

export default SidebarAdmin;
