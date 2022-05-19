import React, { useState } from "react";
import '../styles/SelectedProp.css';


function SelectMainTypesOption({ allElements, element, firstType }) {    

    return [
        allElements[allElements.indexOf(allElements.find(e => e.nameShort === element))].properties.map( subElement => {
            return <option typeaaa={ firstType } key={ subElement }>{subElement}</option>
        })
    ]
}

export default SelectMainTypesOption