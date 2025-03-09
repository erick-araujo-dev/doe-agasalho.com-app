import SidebarUser from '../../../components/SidebarNormal';
import logo_home from "../../../assets/images/logo-doe-agasalho.png";
import { verifyAuthenticationNormal } from '../../../utils/verifyAuthentication';
import BoxTitleSection from '../../../components/BoxTitleSection';

const HomePageUser = () => {
    verifyAuthenticationNormal();

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
                            Com esse sistema será possível gerenciar todas as movimentações de entrada e saída de doações da organização
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageUser;