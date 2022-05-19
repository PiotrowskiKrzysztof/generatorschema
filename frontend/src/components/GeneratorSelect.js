import React from "react";
import '../styles/GeneratorSelect.css';

function GeneratorSelect({ allElements, selectedElement }) {
    // let currentValue = selectedElement.nameShort || 'empty';
    return(
        <select onChange={ selectedElement } className='customSelect' defaultValue='empty'>
            <option value='empty' disabled={true} >Select type</option>
                {allElements.map(element => {
                    return(
                        <option key={ element.nameShort } value={ element.nameShort }>{ element.nameShort }</option>
                    )
                })}
        </select>
    );
}

export default GeneratorSelect;