import React, { useState } from "react";
import SelectedProp from "./SelectedProp";
import SelectMainTypes from "./SelectMainTypes";
import SelectAdditionalTypes from "./SelectAdditionalTypes ";
import '../styles/ClickedElement.css';
import { BsXLg } from 'react-icons/bs';

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
    const [finallTurtle, setFinallTurtle] = useState('');
    const [showJSONLD, setShowJSONLD ] = useState(false);
    const [showRDFa, setShowRDFa ] = useState(false);
    const [showNTriples, setShowNTriples ] = useState(false);
    const [showTurtle, setShowTurtle ] = useState(false);

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
            const indexObj = chosenPropsAdditional.findIndex(el => el._id === Number(handleObjData[2]));
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
        const tmpObj = propsNoNested.find(element => element.nameShort === e.target.value);
        const index = chosenPropsAdditional.indexOf(chosenPropsAdditional.find(el => el._id === Number(parentData[1])));
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
        } else if(chosenPropsAdditional.some(el => el._id === Number(parentData[1]))) {
            const index2 = chosenPropsAdditional.findIndex(el => el._id === Number(parentData[1])) + 1;
            const lastIndex = chosenPropsAdditional.map(el => el._id === Number(parentData[1])).lastIndexOf(true);
            const fetchMainProp = chosenPropsAdditional.find(el => el._id === Number(parentData[1])); 
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
        setAdditionalTypes(additionalTypes.filter(e => e._id !== selectedProp._id));
        const tmp = additionalTypesNested;
        const index = tmp.indexOf(tmp.find(e => e.prop === selectedProp.nameShort));
        const index2 = tmp.indexOf(tmp[index].types.find(e => e === type));
        tmp[index].types.splice(index2, 1);
        if(tmp[index].types.length === 0) {
            setAdditionalTypesNested(additionalTypesNested.filter(e => e._id !== Number(selectedProp._id)));
        } else {
            setAdditionalTypesNested(tmp);
        }
    }

    function newTypeProp(item, thisProp) {
        if(additionalTypesNested.some(e => e._id === thisProp._id)) {
            const tmpArr = additionalTypesNested;
            const index = additionalTypesNested.indexOf(additionalTypesNested.find(e => e._id === thisProp._id));
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
                tmpArrParents.push({types: 'Thing', prop: thisProp.nameShort, lastChild: item, _id: thisProp._id});
                tmpItem = tmpObj.parentShort;
            } else {
                tmpArrParents.push({types: tmpObj.parentShort, prop: thisProp.nameShort, lastChild: item, _id: thisProp._id});
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

    function generateJSONLD2() {
        let finallString = '{\n\t"@context": "https://schema.org/",\n\t"@type": "' + pathElements[pathElements.length - 1] + '",\n';
        const maxIndexMainProps = chosenProps.length - 1;
        chosenProps.forEach(function(mainProp, index) {
            if(index !== maxIndexMainProps) {
                if(mainProp.valueProp !== null) {
                    finallString += '\t"' + mainProp.nameShort + '": "' + mainProp.valueProp + '",\n';
                } else {
                    finallString += '\t"' + mainProp.nameShort + '" ' + mainProp._id + ': {\n\t},\n';
                }
            } else {
                if(mainProp.valueProp !== null) {
                    finallString += '\t"' + mainProp.nameShort + '": "' + mainProp.valueProp + '"\n';
                } else {
                    finallString += '\t"' + mainProp.nameShort + '" ' + mainProp._id + ': {\n\t}\n';
                }
            }
        })
        chosenPropsAdditional.forEach(function(subProp) {
            const wantedElement = '"' + subProp.parent + '" ' + subProp.parentID + ': {';
            const wantedElementStartIndex = finallString.indexOf(wantedElement)
            const wantedElementEndIndex =  wantedElementStartIndex + wantedElement.length;
            if(!finallString.includes('"@type" ' + subProp.parentID + ': ' + '"' + subProp.mainType + '"')) {
                const typeElementToAdd = '\n' + tabulators(subProp.margin) + '"@type" ' + subProp.parentID + ': ' + '"' + subProp.mainType + '"';
                finallString = finallString.substring(0, wantedElementEndIndex) + typeElementToAdd + finallString.substring(wantedElementEndIndex, finallString.length);
            }
            if(wantedElementStartIndex !== -1) {
                if(subProp.valueProp === null || subProp.valueProp === undefined) {                    
                    const elementToAdd = '\n' + tabulators(subProp.margin) + '"' + subProp.nameShort + '" ' + subProp._id + ': {\n' + tabulators(subProp.margin) + '},';
                    finallString = finallString.substring(0, wantedElementEndIndex) + elementToAdd + finallString.substring(wantedElementEndIndex, finallString.length);
                } else {
                    const elementToAdd = '\n' + tabulators(subProp.margin) + '"' + subProp.nameShort + '": "' + subProp.valueProp + '",';
                    finallString = finallString.substring(0, wantedElementEndIndex) + elementToAdd + finallString.substring(wantedElementEndIndex, finallString.length);
                }
            }

        })
        chosenProps.forEach(function(mainProp) {
            if(finallString.includes(mainProp._id + ':')) {
                finallString = finallString.replace(' ' + mainProp._id + ':', ':');
            }
        })
        chosenPropsAdditional.forEach(function(subProp) {
            if(finallString.includes(subProp.parentID + ':')) {
                finallString = finallString.replace(' ' + subProp.parentID + ':', ':');
            }
            if(finallString.includes(subProp._id + ':')) {
                finallString = finallString.replace(' ' + subProp._id + ':', ':');
            }
        })
        finallString += '}';
        const finallStringWithScripts = '<script type="application/ld+json">\n' + finallString + '\n</script>';
        setFinalJSONLDnoScript(finallString);
        setFinalJSONLD(finallStringWithScripts);
        setShowJSONLD(true);
    }

    function tabulators(margin) {
        let tmp = '\t';
        for(let i = 0; i < (margin / 10); i++) {
            tmp += '\t';
        }
        return tmp;
    }

    function generateRDFa() {
        let finallString = '';
        finallString += '<div vocab="https://schema.org/" typeof="' + pathElements[pathElements.length - 1] + '">\n';
        chosenProps.forEach(function(mainProp) {
            let actualPath = mainProp.nameShort + ' ';            
            if(mainProp.valueProp !== null) {
                finallString += '\t<span property="' + mainProp.nameShort + '">' + mainProp.valueProp + '</span>\n'
            } else {
                const subProp = chosenPropsAdditional.find(el => el.path === actualPath + el.nameShort + ' ');
                if(subProp !== undefined) {
                    finallString += '\t<div ' + mainProp._id + ' property="' + mainProp.nameShort + '" typeof="' + subProp.mainType + '">\n\t</div>\n';
                }
            }
        })
        finallString += '</div>';
        chosenPropsAdditional.forEach(function(subProp, index) {
            const wantedElement = '<div ' + subProp.parentID + ' property="' + subProp.parent + '" typeof="' + subProp.mainType + '">\n';
            const wantedElementStartIndex = finallString.indexOf(wantedElement)
            const wantedElementEndIndex =  wantedElementStartIndex + wantedElement.length;
            
            if(wantedElementStartIndex !== -1) {
                if(subProp.valueProp === null || subProp.valueProp === undefined) {
                    const elementToAdd = tabulators(subProp.margin) + '<div ' + subProp._id + ' property="' + subProp.nameShort + '" typeof="' + chosenPropsAdditional[index + 1].mainType + '">\n' + tabulators(subProp.margin) + '</div>\n';
                    finallString = finallString.substring(0, wantedElementEndIndex) + elementToAdd + finallString.substring(wantedElementEndIndex, finallString.length);
                } else {
                    const elementToAdd = tabulators(subProp.margin) + '<span property="' + subProp.nameShort + '">' + subProp.valueProp + '</span>\n'
                    finallString = finallString.substring(0, wantedElementEndIndex) + elementToAdd + finallString.substring(wantedElementEndIndex, finallString.length);
                }
            }
        })
        chosenProps.forEach(function(mainProp) {
            if(finallString.includes(mainProp._id)) {
                finallString = finallString.replace(' ' + mainProp._id, '');
            }
        })
        chosenPropsAdditional.forEach(function(subProp) {
            if(finallString.includes(subProp._id)) {
                finallString = finallString.replace(' ' + subProp._id, '');
            }
        })        
        setFinallRDFa(finallString);
        setShowRDFa(true);
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
        setShowNTriples(true);
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
            case 'Turtle':
                element.download = pathElements[pathElements.length - 1] + ".ttl";  
        }
        document.body.appendChild(element);
        element.click();
    }

    function generateTurtle() {
        const blankNodes = [];
        let counter = 1;
        let finallString = '';

        finallString += '_:id0 a https://schema.org/' + pathElements[pathElements.length - 1] + ' .\n';

        chosenProps.forEach(function(mainProp) {
            if(mainProp.valueProp === null) {
                const childrenProps = chosenPropsAdditional.filter(el => el.path === mainProp.nameShort + ' ' + el.nameShort + ' ');
                childrenProps.forEach(function(child) {
                    blankNodes.push(child);
                    const index = blankNodes.indexOf(child);                
                    blankNodes[index]['blankNode'] = '_:id' + counter;
                })              
                finallString += '_:id0 ' + mainProp.name + ' _:id' + counter + ' .\n';
                counter++;
            } else {
                finallString += '_:id0 ' + mainProp.name + ' "' + mainProp.valueProp + '" .\n';
            }
            
        })

        chosenPropsAdditional.forEach(function(subProp) {
            if(blankNodes.some(el => el.path === subProp.path)) {
                const tmpObj = blankNodes.find(el => el.path === subProp.path);   
                if(!finallString.includes(tmpObj.blankNode + ' a https://schema.org/' + tmpObj.mainType + ' .')) {
                    finallString += tmpObj.blankNode + ' a https://schema.org/' + tmpObj.mainType + ' .\n';
                }
                if(subProp.valueProp === null) {
                    const childrenProps = chosenPropsAdditional.filter(el => el.path === subProp.path + el.nameShort + ' ');
                    childrenProps.forEach(function(child){
                        blankNodes.push(child);
                        const index = blankNodes.indexOf(child);                
                        blankNodes[index]['blankNode'] = '_:id' + counter;
                    })
                    finallString += tmpObj.blankNode + ' ' + subProp.name + ' _:id' + counter + ' .\n';
                    counter++;  
                } else {
                    finallString += tmpObj.blankNode + ' ' + subProp.name + ' "' + subProp.valueProp + '" .\n';
                }
                
            }
        })
        finallString = finallString.replace(/https:\/\/schema.org\//g, 's:');
        finallString = '@prefix s: <https://schema.org/> .\n' + finallString;
        setFinallTurtle(finallString);
        setShowTurtle(true);
    }

    return(
        <div>
            <h2>{ selectedObject.nameShort }</h2>
            <a href={ selectedObject.name }>URL: { selectedObject.name }</a>
            <p>{ path }</p>
            <ul className="customUL">
                {generateChildList}
            </ul>
            <h2>Properties</h2>
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
                            chosenProps={ chosenProps }
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
            <h2>Generate Code</h2>
            {showJSONLD && 
            <div>
                <div className="containerTitleCode">
                    <label for='jsonld'>JSON-LD</label>
                    <svg height='0' width='0'>
                        <defs>
                            <linearGradient id="gradientDeleteBtn">
                                <stop stopColor="#FF53A5" offset='0%'></stop>
                                <stop stopColor="#00BFCC" offset='100%'></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                    <BsXLg style={{ fill: 'url(#gradientDeleteBtn)' }} onClick={ () => setShowJSONLD(false) } className='icon'/>
                </div>
                <textarea id='jsonld' name='jsonld' className="finallCode" value={ finallJSONLDnoScript } readOnly='true' spellCheck='false'></textarea>
                <div className="generateButtonContainer">
                    <button className='generateButton' onClick={ () => saveScript(finallJSONLD, 'json-ld') }>Save As JSON-LD Script</button>
                    <button className='generateButton' onClick={ () => saveScript(finallJSONLDnoScript, 'json-ld') }>Save As JSON-LD NoScript</button>
                </div>
            </div>}
            {showRDFa &&
            <div>
                <div className="containerTitleCode">
                    <label for='rdfa'>RDFa</label>
                    <svg height='0' width='0'>
                        <defs>
                            <linearGradient id="gradientDeleteBtn">
                                <stop stopColor="#FF53A5" offset='0%'></stop>
                                <stop stopColor="#00BFCC" offset='100%'></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                    <BsXLg style={{ fill: 'url(#gradientDeleteBtn)' }} onClick={ () => setShowRDFa(false) } className='icon'/>
                </div>
                <textarea id='rdfa' name='rdfa' className="finallCode" value={ finallRDFa } readOnly='true' spellCheck='false'></textarea>
                <div className="generateButtonContainer">
                    <button className='generateButton' onClick={ () => saveScript(finallRDFa, 'RDFa') }>Save As RDFa</button>
                </div>
            </div>}
            {showNTriples &&
            <div>
                <div className="containerTitleCode">
                    <label for='ntriples'>N-Triples</label>
                    <svg height='0' width='0'>
                        <defs>
                            <linearGradient id="gradientDeleteBtn">
                                <stop stopColor="#FF53A5" offset='0%'></stop>
                                <stop stopColor="#00BFCC" offset='100%'></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                    <BsXLg style={{ fill: 'url(#gradientDeleteBtn)' }} onClick={ () => setShowNTriples(false) } className='icon'/>
                </div>
                <textarea id='ntriples' name='ntriples' className="finallCode" value={ finallNTriples } readOnly='true' spellCheck='false'></textarea>
                <div className="generateButtonContainer">
                    <button className='generateButton' onClick={ () => saveScript(finallNTriples, 'N-Triples') }>Save As N-Triples</button>
                </div>
            </div>}
            {showTurtle &&
            <div>
                <div className="containerTitleCode">
                    <label for='turtle'>Turtle</label>
                    <svg height='0' width='0'>
                        <defs>
                            <linearGradient id="gradientDeleteBtn">
                                <stop stopColor="#FF53A5" offset='0%'></stop>
                                <stop stopColor="#00BFCC" offset='100%'></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                    <BsXLg style={{ fill: 'url(#gradientDeleteBtn)' }} onClick={ () => setShowTurtle(false) } className='icon'/>
                </div>
                <textarea id='turtle' name='turtle' className="finallCode" value={ finallTurtle } readOnly='true' spellCheck='false'></textarea>
                <div className="generateButtonContainer">
                    <button className='generateButton' onClick={ () => saveScript(finallTurtle, 'Turtle') }>Save As Turtle</button>
                </div>
            </div>}

            <div className='finallButtonsContainer'>
                <button className='customButton' onClick={ generateJSONLD2 }>Generate JSON-LD</button>
                <button className='customButton' onClick={ generateRDFa }>Generate RDFa</button>
                <button className='customButton' onClick={ generateNTriples }>Generate N-Triples</button>
                <button className='customButton' onClick={ generateTurtle }>Generate Turtle</button>
            </div>
        </div>
    );
}

export default ClickedElement;