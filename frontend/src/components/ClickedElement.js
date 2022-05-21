import React, { useState } from "react";
import SelectedProp from "./SelectedProp";
import SelectMainTypes from "./SelectMainTypes";
import SelectAdditionalTypes from "./SelectAdditionalTypes ";
import '../styles/ClickedElement.css';

function ClickedElement({ allElements, item, pathElements, propsNoNested }) {
    const selectedObject = allElements.find(e => e.nameShort === item);
    const subObjects = allElements.filter(e => e.parentShort === item);
    let path = 'Thing';
    const [chosenProps, setChosenProps] = useState([]);
    const [chosenPropsAdditional, setChosenPropsAdditional] = useState([]);
    const pathElementsObj = [];
    pathElements.forEach(function(item) {
        pathElementsObj.push(allElements.find(e => e.nameShort === item));
    })
    const [usedTypes, setUsedTypes] = useState(pathElementsObj);
    const [additionalTypes, setAdditionalTypes] = useState([]);
    const [additionalTypesNested, setAdditionalTypesNested] = useState([]);
    const [marginElements, setMarginElements] = useState([]);
    const [counter, setCounter] = useState(0);
    const [finallJSONLD, setFinalJSONLD] = useState('');
    const [finallJSONLDnoScript, setFinalJSONLDnoScript] = useState('');
    const [finallRDFa, setFinallRDFa] = useState('');
    const [finallNTriples, setFinalNTriples] = useState('');

    const generateChildList = subObjects.map(element =>
        <li key={ element.nameShort } >{ element.nameShort }</li>
    );

    const generatePath = pathElements.map(element => 
        path += ' > ' + element
    );

    function selectProp(e) {
        const tmpObj = propsNoNested.find(element => element.nameShort === e.target.value);
        setChosenProps( arr => [...arr, {name: tmpObj.name,
                                        nameShort: tmpObj.nameShort,
                                        _id: Math.floor((Math.random() * 999999999999) + 1),
                                        valueProp: null}]);
    }

    function handleValueProp(e) {
        let value = e.target.value;        
        if(!isNaN(value)) {
            if(value.includes('.')) {
                if(value.split('.')[1].length === 6) {
                    value = Number(value);
                    value = value.toFixed(5);
                } else if(value.split('.')[1].length === 3) {
                    value = Number(value);
                    value = value.toFixed(2);
                }
            }
        }
        const handleObjData = e.target.name.split(' ');
        if(handleObjData[1] === 'undefined') {
            const indexObj = chosenProps.findIndex(el => el._id === Number(handleObjData[2]));
            chosenProps[indexObj].valueProp = value;
        } else {
            console.log(handleObjData);
            const indexObj = chosenPropsAdditional.findIndex(el => el._id === Number(handleObjData[2]));
            // console.log(indexObj);
            console.log(chosenPropsAdditional);
            // console.log(chosenProps);
            chosenPropsAdditional[indexObj].valueProp = value;
        };
    }

    function resetValueProp(chosenObj) {
        if(chosenObj.parent === undefined) {
            const tmp = chosenProps.find(obj => obj === chosenObj);
            tmp.valueProp = null;
            
        } else {
            const tmp = chosenPropsAdditional.find(obj => obj === chosenObj);
            tmp.valueProp = null;
        }   
    }

    function selectPropAdditional(e) {
        const tmpParentData = e.target.name;
        const parentData = tmpParentData.split(' ');
        console.log(parentData);
        const tmpObj = propsNoNested.find(element => element.nameShort === e.target.value);
        const index = chosenPropsAdditional.indexOf(chosenPropsAdditional.find(el => el._id === Number(parentData[1])));
        console.log('>>>>>>>>>>> ' + index);
        const indexx = e.target.selectedIndex;
        const thisString = e.target[indexx].outerHTML;
        const type = thisString.slice(thisString.indexOf('"'), thisString.lastIndexOf('"')).substring(1);        
        if(index === -1) {
            setChosenPropsAdditional( arr => [...arr, {
                name: tmpObj.name,
                nameShort: tmpObj.nameShort,
                _id: Math.floor((Math.random() * 999999999999) + 1),
                parent: parentData[0],
                parentID: parentData[1],
                margin: 10,
                startProp: parentData[0],
                startPropID: parentData[1],
                mainType: type,
                valueProp: null,
                path: parentData[0] + ' ' + tmpObj.nameShort + ' '}]);
        } else if(chosenPropsAdditional.some(el => el.nameShort === parentData[0])) {
            const index2 = chosenPropsAdditional.findIndex(el => el.nameShort === parentData[0]) + 1;
            const lastIndex = chosenPropsAdditional.map(el => el.parent === parentData[0]).lastIndexOf(true);
            const fetchMainProp = chosenPropsAdditional.find(el => el.nameShort === parentData[0]); 
            const tmpArr = chosenPropsAdditional;
            if(lastIndex === -1) {
                tmpArr.splice(index2, 0, {
                    name: tmpObj.name,
                    nameShort: tmpObj.nameShort,
                    _id: Math.floor((Math.random() * 999999999999) + 1),
                    parent: parentData[0],
                    parentID: parentData[1],
                    margin: fetchMainProp.margin + 10,
                    startProp: fetchMainProp.startProp,
                    startPropID: fetchMainProp.startPropID,
                    mainType: type,
                    valueProp: null,
                    path: fetchMainProp.path + tmpObj.nameShort + ' '});
                setChosenPropsAdditional(tmpArr);
                setCounter(counter + 1);
            } else {
                tmpArr.splice(lastIndex + 1, 0, {
                    name: tmpObj.name,
                    nameShort: tmpObj.nameShort,
                    _id: Math.floor((Math.random() * 999999999999) + 1),
                    parent: parentData[0],
                    parentID: parentData[1],
                    margin: fetchMainProp.margin + 10,
                    startProp: fetchMainProp.startProp,
                    startPropID: fetchMainProp.startPropID,
                    mainType: type,
                    valueProp: null,
                    path: fetchMainProp.path + tmpObj.nameShort + ' '});
                setChosenPropsAdditional(tmpArr);
                setCounter(counter + 1);
            }
            
        }   
    }

    function deleteProp(e) {        
        const actualProps = [...chosenProps].filter(prop => prop._id !== e._id);
        setChosenProps(actualProps);
    }

    function deletePropAdditional(e) {        
        const actualProps = [...chosenPropsAdditional].filter(prop => prop._id !== e._id);
        setChosenPropsAdditional(actualProps);
        setCounter(counter - 1);
    }

    function deleteType(selectedProp, type) {
        setAdditionalTypes(additionalTypes.filter(e => e.lastChild !== type));
        const tmp = additionalTypesNested;
        const index = tmp.indexOf(tmp.find(e => e.prop === selectedProp.nameShort));
        const index2 = tmp.indexOf(tmp[index].types.find(e => e === type));
        tmp[index].types.splice(index2, 1);
        if(tmp[index].types.length === 0) {
            setAdditionalTypesNested(additionalTypesNested.filter(e => e.prop !== selectedProp.nameShort));
        } else {
            setAdditionalTypesNested(tmp);
        }
        setChosenPropsAdditional(chosenPropsAdditional.filter(e => e.parent !== selectedProp.nameShort));
    }

    function newTypeProp(item, thisProp) {
        if(additionalTypesNested.some(e => e.prop === thisProp.nameShort)) {
            const tmpArr = additionalTypesNested;
            const index = additionalTypesNested.indexOf(additionalTypesNested.find(e => e.prop === thisProp.nameShort));
            tmpArr[index].types.push(item);
            setAdditionalTypesNested(tmpArr);
        } else {
            const tmp = [];
            tmp.push(item);
            const tmpArr = [...additionalTypesNested, {types:tmp, prop:thisProp.nameShort, _id: thisProp._id}];
            setAdditionalTypesNested(tmpArr);
        }
        setAdditionalTypes(arr => [...arr, {types: item, prop: thisProp.nameShort, lastChild: item, _id: thisProp._id}]);
        let tmpItem = item;
        let tmpArrParents = [];
        while(!tmpArrParents.some(e => e.types === 'Thing' && e.prop === thisProp.nameShort)) {
            let tmpObj = allElements.find(e => e.nameShort === tmpItem);
            if(tmpObj.parent === 'this') {
                tmpArrParents.push({types: 'Thing', prop: thisProp.nameShort, lastChild: item});
                tmpItem = tmpObj.parentShort;
            } else {
                tmpArrParents.push({types: tmpObj.parentShort, prop: thisProp.nameShort, lastChild: item});
                tmpItem = tmpObj.parentShort;
            }               
        }
        tmpArrParents.forEach(function(element) {
            setAdditionalTypes(arr => [...arr, element]);
        })
    }

    function fetchMargin(margin, prop) {
        setMarginElements([...marginElements, {margin, prop}]);
    }
    function generateJSONLD() {       
        let tmpObj = {};
        tmpObj['@context'] = 'http://schema.org/';
        tmpObj['@type'] = pathElements[pathElements.length - 1];
        chosenProps.forEach(function(mainProps) {
            if(mainProps.valueProp !== null) {
                tmpObj[mainProps.nameShort] = mainProps.valueProp;
            } else {
                tmpObj[mainProps.nameShort] = {};
            }
            
        })
        chosenPropsAdditional.forEach(function(subProp) {
            findObject(tmpObj, subProp);            
        })
        setFinalJSONLDnoScript(JSON.stringify(tmpObj));
        let finallString = '<script type="application/ld+json">';
        finallString += JSON.stringify(tmpObj);
        finallString += '</script>';
        setFinalJSONLD(finallString);
    }

    function findObject(tmpObj, subProp) {
        const a = Object.keys(tmpObj).find(key => key === subProp.parent);
        const currentPath = subProp.path.split(' ');
        currentPath.pop();
        if( a !== undefined) {            
                tmpObj[a]['@type'] = subProp.mainType;
                tmpObj[a][subProp.nameShort] = {};
                if(subProp.valueProp !== null) {
                    tmpObj[a][subProp.nameShort] = subProp.valueProp;
                }                
        } else {
            for(let key in tmpObj) {
                for(let i = 0; i < currentPath.length - 1; i++) {
                    if(key === currentPath[i]) {
                        findObject(tmpObj[key], subProp);
                    }
                }
            }
        }
    }

    function generateRDFa() {
        let finallString = '';
        finallString += '<div vocab="https://schema.org/" typeof="' + pathElements[pathElements.length - 1] + '">';
        chosenProps.forEach(function(mainProp) {
            let actualPath = mainProp.nameShort + ' ';            
            if(mainProp.valueProp !== null) {
                finallString += '<span property="' + mainProp.nameShort + '">' + mainProp.valueProp + '</span>'
            } else {
                const subProp = chosenPropsAdditional.find(el => el.path === actualPath + el.nameShort + ' ');
                if(subProp !== undefined) {
                    finallString += '<div property="' + mainProp.nameShort + '" typeof="' + subProp.mainType + '"></div>';
                }
            }
        })
        finallString += '</div>';
        chosenPropsAdditional.forEach(function(subProp, index) {
            const wantedElement = '<div property="' + subProp.parent + '" typeof="' + subProp.mainType + '">';
            const wantedElementStartIndex = finallString.indexOf(wantedElement)
            const wantedElementEndIndex =  wantedElementStartIndex + wantedElement.length;
            
            if(wantedElementStartIndex !== -1) {
                if(subProp.valueProp === null || subProp.valueProp === undefined) {
                    const elementToAdd = '<div property="' + subProp.nameShort + '" typeof="' + chosenPropsAdditional[index + 1].mainType + '"></div>';
                    finallString = finallString.substring(0, wantedElementEndIndex) + elementToAdd + finallString.substring(wantedElementEndIndex, finallString.length);
                } else {
                    const elementToAdd = '<span property="' + subProp.nameShort + '">' + subProp.valueProp + '</span>'
                    finallString = finallString.substring(0, wantedElementEndIndex) + elementToAdd + finallString.substring(wantedElementEndIndex, finallString.length);
                }
            }
        })        
        setFinallRDFa(finallString);
    }

    function generateNTriples() {
        const blankNodes = [];
        let counter = 1;
        let finallString = '';

        finallString += '_:id0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://schema.org/' + pathElements[pathElements.length - 1] + '> .\n';

        chosenProps.forEach(function(mainProp) {
            if(mainProp.valueProp === null) {
                const childrenProps = chosenPropsAdditional.filter(el => el.path === mainProp.nameShort + ' ' + el.nameShort + ' ');
                childrenProps.forEach(function(child) {
                    blankNodes.push(child);
                    const index = blankNodes.indexOf(child);                
                    blankNodes[index]['blankNode'] = '_:id' + counter;
                })              
                finallString += '_:id0 <' + mainProp.name + '> _:id' + counter + ' .\n';
                counter++;
            } else {
                finallString += '_:id0 <' + mainProp.name + '> "' + mainProp.valueProp + '" .\n';
            }
            
        })

        chosenPropsAdditional.forEach(function(subProp) {
            if(blankNodes.some(el => el.path === subProp.path)) {
                const tmpObj = blankNodes.find(el => el.path === subProp.path);   
                if(!finallString.includes(tmpObj.blankNode + ' <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://schema.org/' + tmpObj.mainType + '> .')) {
                    finallString += tmpObj.blankNode + ' <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://schema.org/' + tmpObj.mainType + '> .\n';
                }
                if(subProp.valueProp === null) {
                    const childrenProps = chosenPropsAdditional.filter(el => el.path === subProp.path + el.nameShort + ' ');
                    childrenProps.forEach(function(child){
                        blankNodes.push(child);
                        const index = blankNodes.indexOf(child);                
                        blankNodes[index]['blankNode'] = '_:id' + counter;
                    })
                    finallString += tmpObj.blankNode + ' <' + subProp.name + '> _:id' + counter + ' .\n';
                    counter++;  
                } else {
                    finallString += tmpObj.blankNode + ' <' + subProp.name + '> "' + subProp.valueProp + '" .\n';
                }
                
            }
        })
        setFinalNTriples(finallString);
    }

    function saveScript(inputData, type) {
        const element = document.createElement("a");
        const file = new Blob([inputData], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        switch(type) {
            case 'json-ld':
                element.download = pathElements[pathElements.length - 1] + ".jsonld";  
                break;
            case 'RDFa':
                element.download = pathElements[pathElements.length - 1] + ".html";  
                break;
            case 'N-Triples':
                element.download = pathElements[pathElements.length - 1] + ".nt";  
                break;
        }
        document.body.appendChild(element);
        element.click();
    }

    return(
        <div>
            <h1>{ selectedObject.nameShort }</h1>
            <a href={ selectedObject.name }>URL: { selectedObject.name }</a>
            <p>{ path }</p>
            <ul className="customUL">
                {generateChildList}
            </ul>
            <h1>Properties</h1>
            <form>
                {chosenProps.map((element, index) => {
                    return( 
                        <SelectedProp 
                            key={ element._id }
                            element={ element.nameShort }
                            propsNoNested={ propsNoNested }
                            deleteProp={ deleteProp }
                            newTypeProp={ newTypeProp }
                            deleteType={ deleteType }
                            fetchMargin={ fetchMargin }
                            chosenPropsAdditional={ chosenPropsAdditional }
                            deletePropAdditional={ deletePropAdditional }
                            additionalTypes={ additionalTypes }
                            handleValueProp={ handleValueProp }
                            fullElement={ element }
                            resetValueProp={ resetValueProp }
                        />)
                })}
            </form>

            <SelectMainTypes 
                allElements={ allElements }
                selectProp={ selectProp }
                usedTypes={ usedTypes }
            />
            {additionalTypesNested.map(element => {
                    return(
                        <SelectAdditionalTypes
                            key={ element._id }
                            allElements={ allElements } 
                            propsNoNested={ propsNoNested }
                            prop={ element.prop }
                            selectPropAdditional={ selectPropAdditional }
                            additionalTypes={ additionalTypes }
                            idElement={ element._id }                            
                        />
                    )
                })
            }
            <h1>Generate Code</h1>
            {finallJSONLD !== '' && 
            <div>
                <textarea className="finallCode" value={ finallJSONLDnoScript } readOnly='true' spellCheck='false'></textarea>
                <div className="generateButtonContainer">
                    <button className='generateButton' onClick={ () => saveScript(finallJSONLD, 'json-ld') }>Save As JSON-LD Script</button>
                    <button className='generateButton' onClick={ () => saveScript(finallJSONLDnoScript, 'json-ld') }>Save As JSON-LD NoScript</button>
                </div>
            </div>}
            {finallRDFa !== '' &&
            <div>
                <textarea className="finallCode" value={ finallRDFa } readOnly='true' spellCheck='false'></textarea>
                <div className="generateButtonContainer">
                    <button className='generateButton' onClick={ () => saveScript(finallRDFa, 'RDFa') }>Save As RDFa</button>
                </div>
            </div>}
            {finallNTriples !== '' &&
            <div>
                <textarea className="finallCode" value={ finallNTriples } readOnly='true' spellCheck='false'></textarea>
                <div className="generateButtonContainer">
                    <button className='generateButton' onClick={ () => saveScript(finallNTriples, 'N-Triples') }>Save As N-Triples</button>
                </div>
            </div>}

            <div className='finallButtonsContainer'>
                <button className='customButton' onClick={ generateJSONLD }>Generate JSON-LD</button>
                <button className='customButton' onClick={ generateRDFa }>Generate RDFa</button>
                <button className='customButton' onClick={ generateNTriples }>Generate N-Triples</button>
            </div>
        </div>
    );
}

export default ClickedElement;