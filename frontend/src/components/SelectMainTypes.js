import React from "react";
import '../styles/SelectedProp.css';
import SelectTypesOptions from "./SelectTypesOptions";


function SelectMainTypes({ allElements, selectProp, usedTypes }) {    
    return(
        <div>
            <div className="addProperty">
                <p className='propertyText'>Add property to {usedTypes[usedTypes.length - 1].nameShort}:</p>
                <div className="selectContainer">
                    <select onChange={selectProp} value='emptyMainTypes'>
                        <option value='emptyMainTypes' disabled hidden>Select property</option>
                        <optgroup label='--- Properties from Thing ---'>
                            {allElements[allElements.indexOf(allElements.find(e => e.nameShort === 'Thing'))].properties.map( (element, index) => {
                                return <option key={ element + index } >{ element }</option>                    
                            })}
                        </optgroup>
                        {
                            usedTypes.map(element => {
                                return (
                                    <optgroup label={ '--- Properties from' + element.nameShort + ' ---' } key={element.types + element.prop}>
                                        <SelectTypesOptions
                                            allElements={ allElements }
                                            element={ element.nameShort }
                                        />
                                    </optgroup>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
        </div>
    );
}

export default SelectMainTypes