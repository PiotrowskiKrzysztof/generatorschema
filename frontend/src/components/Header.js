import React from "react";
import '../styles/Header.css';
import { ReactComponent as Logo } from '../assets/logo-dark.svg';
import axios from '../axios';


function Header() {    
    return(
        <div className="fixedContainer">
            <div className="headerContainer">
                <Logo width='180'/>
                <div>
                    <button className="selected"><a href="/">Generator</a></button>
                </div>
                
            </div>
        </div>
    );
}

export default Header