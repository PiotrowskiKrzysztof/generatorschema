import React, { useState } from "react";
import SelectedPropContent from "./SelectedPropContent";
import '../styles/SelectedProp.css';
import { BsArrowDown, BsXLg } from 'react-icons/bs';


function SelectedPropAdditional({ element, thisProp, propsNoNested, newTypeProp, deleteType, fetchMargin, chosenPropsAdditional, deletePropAdditional, additionalTypes, handleValueProp, fullElement, resetValueProp }) {
    
    const selectedProp = propsNoNested.find(e => e.nameShort === thisProp.nameShort);
    const [show, setShow] = useState(true);
    const [marginChanged, setMarginChanged] = useState(false);
    const [childrenTypes, setChildrenTypes] = useState([]);
    const [margin, setMargin] = useState(0);
    const [blockInputs, setBlockInputs] = useState(false);
    const [notBlockedTypes, setNotBlockedTypes] = useState(selectedProp.types);

    function changeNotBlockedTypes(type) {
        if(typeof type === 'object') {
            setNotBlockedTypes(type);
        } else {
            setNotBlockedTypes([type]);
        }
        
    }
    
    if(chosenPropsAdditional.length <= 0) {
        return null;
    }

    if(!chosenPropsAdditional.some(e => e.parent === element)) {
        return null;
    }

    function handleBlockInuts(value) {
        setBlockInputs(value);
    }

    function changeMargin() {
        if(marginChanged === false) {
            setMargin(margin + 10);
            setMarginChanged(true);            
        }
    }

    function addChildrenTypes(typesToAdd) {
        setChildrenTypes(arr => [...arr, typesToAdd]);
    }

    function deleteChildrenTypes(item) {
        setChildrenTypes([...childrenTypes].filter(types => types !== item));
    }

    const correctStyle = () => {
        if(show === false) return 'hide';
        else return 'selectedPropContent';
    }

    return(
        <div className='selectedProp' style={{ marginLeft: thisProp.margin*2 }}>
            <p className="selectedProp__icon" onClick={() => setShow(!show)}><BsArrowDown /></p>            
            <label>{thisProp.nameShort} - {thisProp.parent}</label>
            {childrenTypes.length === 0 && <p className="selectedProp__delete" onClick={ () => {deletePropAdditional(fullElement); } }><BsXLg /></p> }
            <div className={correctStyle()}>   
                {selectedProp.types.map(item => {
                        return (
                        <SelectedPropContent
                            key={ item }
                            item={ item }
                            newTypeProp={ newTypeProp }
                            changeMargin={ changeMargin }
                            thisProp={ thisProp.nameShort }
                            margin={ margin }
                            fetchMargin={ fetchMargin }
                            addChildrenTypes= { addChildrenTypes }
                            deleteChildrenTypes={ deleteChildrenTypes }
                            selectedProp={ selectedProp }
                            deleteType={ deleteType }
                            additionalTypes={ additionalTypes }
                            chosenPropsAdditional={ chosenPropsAdditional }
                            handleValueProp={ handleValueProp }
                            fullElement={ fullElement }
                            blockInputs={ blockInputs }
                            handleBlockInuts={ handleBlockInuts }
                            notBlockedTypes={ notBlockedTypes }
                            changeNotBlockedTypes={ changeNotBlockedTypes }
                            resetValueProp={ resetValueProp }
                        />
                    )
                })}

            </div>
        </div>
    );
}

export default SelectedPropAdditional;