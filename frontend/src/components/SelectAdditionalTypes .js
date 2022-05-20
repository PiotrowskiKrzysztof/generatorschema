import React, { useState, useEffect } from "react";
import '../styles/SelectedProp.css';
import SelectTypesOptions from "./SelectTypesOptions";


function SelectAdditionalTypes({ allElements, propsNoNested, type, prop, selectPropAdditional, additionalTypes, idElement }) {
    
    const thisProp = propsNoNested.find(item => item.nameShort === prop);
    const uniqueTypes = [...new Set(additionalTypes.map(item => item.types))];
    
    const arrayUniqueByKey = [];
    additionalTypes.forEach(element => {
        if(!arrayUniqueByKey.some(e => e === element)) {
            arrayUniqueByKey.push(element);
        }
    });

    console.log(thisProp);

    return(
        <div>
            <div className="addProperty">
                <p className='propertyText'>Add property to { thisProp.nameShort }:</p>
                <select name={ thisProp.nameShort + ' ' + idElement } onChange={ selectPropAdditional } defaultValue='empty'>
                    <option value='empty' disabled hidden>Select property</option>
                    {
                            arrayUniqueByKey.map(element => {
                                if(element.prop === thisProp.nameShort) {
                                    return (
                                        <optgroup label={ '--- Properties from ' + element.types + ' ---' } key={element.types + element.prop}>
                                            <SelectTypesOptions 
                                                allElements={ allElements }
                                                element={ element.types }
                                                firstType={ element.lastChild }
                                            />
                                        </optgroup>
                                    )
                                }
                        })
                    }
                </select>
            </div>
        </div>
    );
}

export default SelectAdditionalTypes