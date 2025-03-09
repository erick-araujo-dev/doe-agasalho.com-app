import logo_sidebar from "../../assets/images/logo-doe-agasalho.png";
import { House, PlusCircle, MagnifyingGlass, SignOut, TShirt } from "phosphor-react";
import { Link,  useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/helpers";

const SideBarNormal = () => {
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
                        <li  className={location.pathname === "/home" ? "active-route" : ""}>
                            <i>
                                <House />
                            </i>
                            <Link
                                to="/home"
                               
                            >
                                Página Inicial
                            </Link>
                        </li>
                        <li className={location.pathname === "/doacao" || location.pathname === "/doacao/cadastrar"? "active-route" : ""}>
                            <i>
                                <TShirt/>
                            </i>
                            <Link
                                to="/doacao"
                                
                            >
                                Doação
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

export default SideBarNormal;
