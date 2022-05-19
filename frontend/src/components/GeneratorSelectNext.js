import React from "react";

function GeneratorSelectNext({ allElements, currentElement, selectedElement, deeph }) {

    // let currentValue = selectedElement.nameShort || 'empty';

    if(!allElements.some(e => e.parentShort === currentElement)) {
        return null;
    }

    return(
        <select onChange={selectedElement} className='customSelect' defaultValue='empty'>
            <option deeph={ deeph } value='empty' disabled={true} >Select type</option>
            {allElements.map(element => {                    
                if(element.parentShort === currentElement){
                    return(
                        <option deeph={ deeph } key={ element.nameShort } value={ element.nameShort }>{ element.nameShort }</option>
                    )
                }
            })}
        </select>
    );
}

export default GeneratorSelectNext;