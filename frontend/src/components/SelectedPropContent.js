import React, { useState, useEffect } from "react";
import '../styles/SelectedPropContent.css';
import { BsXLg } from 'react-icons/bs';


function SelectedPropContent({ item, newTypeProp, changeMargin, thisProp, margin, fetchMargin, addChildrenTypes, deleteChildrenTypes, selectedProp, deleteType, additionalTypes, chosenProps, chosenPropsAdditional, handleValueProp, fullElement, blockInputs, handleBlockInuts, notBlockedTypes, changeNotBlockedTypes, resetValueProp }) {

    const [valueNumber, setValueNumber] = useState(0);
    const [valueFloat, setValueFloat] = useState(0);
    const [valueInteger, setValueInteger] = useState();
    const [addedNewType, setAddedNewType] = useState(false);
    const [canDeleteType, setCanDeleteType] = useState(true);
    const [valueText, setValueText] = useState('');
    const [valueUrl, setValueUrl] = useState('');

    const handleChangeText = (evt) => {
        setValueText(evt.target.value);
    }

    const handleChangeUrl = (evt) => {
        setValueUrl(evt.target.value);
    }

    const handleChangeNumber = (evt) => {
        const { value } = evt.target;
        if (value.match(/\./g)) {
          const [, decimal] = value.split('.');
          if (decimal?.length > 5) {
            return;
          }
        }
        setValueNumber(value);    
    }

    const handleChangeFloat = (evt) => {
        const { value } = evt.target;
        if (value.match(/\./g)) {
          const [, decimal] = value.split('.');
          if (decimal?.length > 2) {
            return;
          }
        }
        setValueFloat(value);    
    }

    const handleChangeInteger = (evt) => {  
        const value = evt.target.value.replace(/[^0-9]/g, '');
        setValueInteger(value);
    }
    
    useEffect(() => {        
            console.log(chosenPropsAdditional);
            console.log(chosenProps);
            console.log(fullElement);
            console.log(thisProp);
            console.log((chosenPropsAdditional.some(e => Number(e.parentID) === fullElement._id)));
            if(chosenPropsAdditional.some(e => Number(e.parentID) === fullElement._id)) setCanDeleteType(false);
            else setCanDeleteType(true);
    }) 

    if(item === 'Text') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='text' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } value={ valueText } onChange={ e=> { handleValueProp(e); handleChangeText(e) }}></input>
            </div>
        );
    } else if(item === 'URL') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='url' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } value={ valueUrl } onChange={ e=> { handleValueProp(e); handleChangeUrl(e) }}></input>
            </div>
        )
    } else if(item === 'Boolean') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <select disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } onChange={ handleValueProp }>
                    <option value='true'>true</option>
                    <option value='false'>false</option>
                </select>
            </div>
        )
    } else if(item === 'Date') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='date' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } onChange={ handleValueProp }></input>
            </div>
        )
    } else if(item === 'DateTime') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='datetime-local' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } onChange={ handleValueProp }></input>
            </div>
        )
    } else if(item === 'Number') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='number' step='.00001' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } value={ valueNumber } onChange={ e => { handleChangeNumber(e); handleValueProp(e) }}></input>
            </div>
        )
    } else if(item === 'Integer') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='text' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } value={ valueInteger } onChange={ e => { handleChangeInteger(e); handleValueProp(e) }}></input>
            </div>
        )
    } else if(item === 'Float') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='number' step='.01' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } value={ valueFloat } onChange={ e => { handleChangeFloat(e); handleValueProp(e) }}></input>
            </div>
        )
    } else if(item === 'Time') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='time' disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } onChange={ handleValueProp }></input>
            </div>
        )
    } else if(item === 'CssSelectorType') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='text' placeholder="Make sure that the entered data are correct!" disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } onChange={ handleValueProp }></input>
            </div>
        )
    } else if(item === 'PronounceableText') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='text' placeholder="Make sure that the entered data are correct!" disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } onChange={ handleValueProp }></input>
            </div>
        )
    } else if(item === 'XPathType') {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>
                <input type='text' placeholder="Make sure that the entered data are correct!" disabled={ blockInputs } name={ fullElement.nameShort + " " + fullElement.parent + " " + fullElement._id } onChange={ handleValueProp }></input>
            </div>
        )
    } else {
        return(
            <div className='selectedProp__context'>
                <p>{ item }</p>                
                {(notBlockedTypes.some(e => e === item)) ? (!addedNewType ? <p className="buttonNewTypeProp" onClick={ () => { newTypeProp(item, fullElement); setAddedNewType(true); changeMargin(); fetchMargin(margin, thisProp); addChildrenTypes(item); handleBlockInuts(true); changeNotBlockedTypes(item); resetValueProp(fullElement); } }>Add Type</p>
                : canDeleteType ? <p className="typeAdded">Type added <BsXLg onClick={ () => {deleteChildrenTypes(item); setAddedNewType(!addedNewType); deleteType(fullElement, item); handleBlockInuts(false); changeNotBlockedTypes(selectedProp.types)}} /></p>
                : <p className="typeAdded">Type added</p>) : <p className="typeAdded">You added other type</p>}
            </div>
        )
    }
}

export default SelectedPropContent;