import React from "react";
import '../styles/Footer.css';
import { ReactComponent as Logo } from '../assets/logo-dark.svg';


function Footer() {    
    return(
        <div className="absoluteContainer">
            <div className="footerContainer">
                <p>&copy; 2022 Krzysztof Piotrowski</p>
                {/* <Logo width='180'/> */}
            </div>
        </div>
    );
}

export default Footer