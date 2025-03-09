import SidebarUser from '../../../components/SidebarAdmin';
import logo_home from "../../../assets/images/logo-doe-agasalho.png";
import {verifyAuthenticationAdmin} from '../../../utils/verifyAuthentication';
import BoxTitleSection from '../../../components/BoxTitleSection';

const HomePageAdmin = () => {

    verifyAuthenticationAdmin(); //verifica se o user esta autenticado

    return(
        <div className="home-page">
            <SidebarUser/>
            <div className="container-home">
                <BoxTitleSection titulo={"Página inicial"} />
                <div className='box-home'>
                    <div className="content-box-home">
                        <img src={logo_home} alt="Logo Doe Agasalho" title="Logo Doe Agasalho" className='logo-home'/>
                        <p>
                            Bem vindo(a) ao sistema de gerencimanto de doações da Doe Agasalho
                        </p>
                        <p>
                            Essa é a pagina inicial de administrador do sistema, aqui você poderá gerenciar os usuarios com acesso ao sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageAdmin;