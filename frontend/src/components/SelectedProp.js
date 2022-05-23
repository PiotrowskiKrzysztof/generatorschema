import React, { useState } from "react";
import SelectedPropContent from "./SelectedPropContent";
import '../styles/SelectedProp.css';
import { BsArrowDown, BsXLg } from 'react-icons/bs';
import SelectedPropAdditional from './SelectedPropAdditional';


function SelectedProp({ element, propsNoNested, deleteProp, newTypeProp, deleteType, fetchMargin, chosenProps, chosenPropsAdditional, deletePropAdditional, additionalTypes, handleValueProp, fullElement, resetValueProp }) {
    
    const selectedProp = propsNoNested.find(e => e.nameShort === element);
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
    
    function changeMargin() {
        if(marginChanged === false) {
            setMargin(margin + 10);
            setMarginChanged(true);            
        }
    }

    function handleBlockInuts(value) {
        setBlockInputs(value);
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

    return[
        <div className='selectedProp'>
            <p className="selectedProp__icon" onClick={() => setShow(!show)}><BsArrowDown /></p>
            <label>{ element }</label>
            {childrenTypes.length === 0 &&
            <p className="selectedProp__delete" onClick={ () => {deleteProp(fullElement); } }>
                <svg height='0' width='0'>
                    <defs>
                        <linearGradient id="gradientDeleteBtn">
                            <stop stopColor="#FF53A5" offset='0%'></stop>
                            <stop stopColor="#00BFCC" offset='100%'></stop>
                        </linearGradient>
                    </defs>
                </svg>
                <BsXLg style={{ fill: 'url(#gradientDeleteBtn)' }}/>
            </p> }
                <div className={correctStyle()}>   
                    {selectedProp.types.map(item => {
                         return (
                            <SelectedPropContent
                                key={ element._id + item }
                                item={ item }
                                newTypeProp={ newTypeProp }
                                changeMargin={ changeMargin }
                                thisProp={ element }
                                margin={ margin }
                                fetchMargin={ fetchMargin }
                                addChildrenTypes= { addChildrenTypes }
                                deleteChildrenTypes={ deleteChildrenTypes }
                                selectedProp={ selectedProp }
                                deleteType={ deleteType }
                                additionalTypes={ additionalTypes }
                                chosenProps={ chosenProps }
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
        </div>,
        chosenPropsAdditional.map(e => {
            if(e.startPropID === (fullElement._id).toString()) {
                return(
                    <SelectedPropAdditional
                        key={ e._id + element } 
                        element={ element }
                        thisProp={ e }
                        propsNoNested= {propsNoNested}
                        chosenProps={ chosenProps }
                        chosenPropsAdditional={ chosenPropsAdditional }
                        newTypeProp={ newTypeProp }
                        deleteType={ deleteType }
                        fetchMargin={ fetchMargin }
                        deletePropAdditional={ deletePropAdditional }
                        additionalTypes={ additionalTypes }
                        handleValueProp={ handleValueProp }
                        fullElement={ e }
                        resetValueProp={ resetValueProp }
                    />                    
                )
            }
        }),
    ];
}

export default SelectedProp;