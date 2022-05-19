import React, { useState } from "react";
import SelectedPropContent from "./SelectedPropContent";
import '../styles/SelectedProp.css';
import { BsArrowDown, BsXLg } from 'react-icons/bs';
import SelectedPropAdditional from './SelectedPropAdditional';


function SelectedProp({ element, propsNoNested, deleteProp, newTypeProp, deleteType, fetchMargin, chosenPropsAdditional, deletePropAdditional, additionalTypes, handleValueProp, fullElement, resetValueProp }) {
    
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

    console.log(fullElement);
    
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
            {childrenTypes.length === 0 && <p className="selectedProp__delete" onClick={ () => {deleteProp(selectedProp); } }><BsXLg /></p> }
                <div className={correctStyle()}>   
                    {selectedProp.types.map(item => {
                         return (
                            <SelectedPropContent
                                key={ item }
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
            // console.log(e);
            // console.log(element);
            if(e.startProp === element) {
                return(
                    <SelectedPropAdditional 
                        element={ element }
                        thisProp={ e }
                        propsNoNested= {propsNoNested}
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
        
        // chosenPropsAdditional.map(e => {
        //     if(e.parent !== element) {
        //         return(
        //             <SelectedPropAdditional 
        //                 element={ element }
        //                 thisProp={ e }
        //                 propsNoNested= {propsNoNested}
        //                 chosenPropsAdditional={ chosenPropsAdditional }
        //                 newTypeProp={ newTypeProp }
        //                 deleteType={ deleteType }
        //                 fetchMargin={ fetchMargin }
        //                 deletePropAdditional={ deletePropAdditional }
        //             />                    
        //         )
        //     }
        // })
        
        // <div className='selectedProp'>
        //     {chosenPropsAdditional !== null && chosenPropsAdditional.map(e => {
        //         if(e.parent === element) {
        //             return <p>{e.nameShort} - {e.parent}</p>
        //         }
        //     })}
        // </div>
    ];
}

export default SelectedProp;