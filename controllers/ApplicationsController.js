require('../db/mongoose');
const fs = require('fs');
const N3 = require('n3');
const { resolve } = require('path');
const path = require('path');
const { name } = require('tar/lib/types');
const { callbackify } = require('util');
const Element = require('../db/models/element');
const ElementNoNested = require('../db/models/elementNoNested');
const PropNoNested = require('../db/models/propNoNested');

exports.store = (req, res) => {

    const parser = new N3.Parser();
    // const rdfStream = fs.createReadStream(path.join('./', req.body.fileRDF));
    const rdfStream = fs.createReadStream(path.join('./schemaorg-current-https.ttl'))

    async function getQuads(stream) {
        const result = [];
        return new Promise((resolve, reject) => {
            parser.parse(stream,
                (error, quad, prefixes) => {
                    if(error) {
                        reject(error)
                    }
                    if(quad) {
                        const subject = quad.subject.value;
                        const subjectShort = quad.subject.value.split("/").pop();
                        const predicate = quad.predicate.value;
                        const object = quad.object.value;
                        const objectShort = quad.object.value.split("/").pop();
                        result.push({ subject, subjectShort, predicate, object, objectShort });
                    } else {
                        resolve(result);
                    }
                })
        })
    }

    (async () => {
        const test = await getQuads(rdfStream);
        const mainObjects = [];
        const objectsNoNested = [];
        const tmpArray = [];
        const tmpProp = [];
        const propNoNested = [];
        const tmpSet = new Set();        
        test.forEach(function findMainObjects(element) {
            if(element.object == 'https://schema.org/Thing' && element.subjectShort[0] == element.subjectShort[0].toUpperCase()) {
                let name = element.subject;
                let nameShort = element.subjectShort;
                let childrens = [];
                mainObjects.push({ name, nameShort, childrens });
            } else {
                if(element.subjectShort[0] == element.subjectShort[0].toUpperCase()) {
                    let name = element.subject;
                    let nameShort = element.subjectShort;
                    let childrens = [];                    
                    const found = tmpArray.some(e => e.nameShort === element.subjectShort);
                    if(!found) {
                        tmpArray.push({ name, nameShort, childrens });
                    }
                }
            }
        });
        
        test.forEach(function(element) {
            if(element.subjectShort[0] == element.subjectShort[0].toUpperCase()) {
                const foundCheck = tmpArray.some(e => e.nameShort === element.objectShort);
                const found = tmpArray.find( e => e.name === element.object);   
                if(foundCheck && found != undefined) {
                    let found2 = tmpArray.find(e => e.nameShort === element.subjectShort);
                    tmpArray[tmpArray.indexOf(found)].childrens.push(found2); 
                }
            }
        }) 

        test.forEach(function(element) {
            if(element.subjectShort[0] == element.subjectShort[0].toUpperCase()) {
                if(mainObjects.filter(e => e.name === element.object).length > 0) {
                    let foundMain = mainObjects.find( e => e.name === element.object);
                    if(tmpArray.filter(e => e.name === foundMain.name).length > 0) {                        
                        let foundSub = tmpArray.find(e => e.name === element.object);
                        if(mainObjects[mainObjects.indexOf(foundMain)].childrens.length == 0) {
                            mainObjects[mainObjects.indexOf(foundMain)].childrens.push(foundSub.childrens);
                            
                        }
                    }   
                }
                
            }
        })

        test.forEach(function(element) {
            // // if(element.object == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property') {
            // if(element.predicate == 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf') {
            //     console.log(element);
            //     // tmpProp.push({name: element.subject, nameShort: element.subjectShort});
            // } else {
            //     // console.log(element);
            // }
            // console.log(element);
            if(element.predicate == 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
                tmpProp.push({
                    name: element.subject,
                    nameShort: element.subjectShort,
                    parent: element.object,
                    parentShort: element.objectShort,
                    properties: []
                })
            } else if(element.subject == 'https://schema.org/Thing' && element.object == 'http://www.w3.org/2000/01/rdf-schema#Class') {
                tmpProp.push({
                    name: 'https://schema.org/Thing',
                    nameShort: 'Thing',
                    parent: 'this',
                    parentShort: 'this',
                    properties: []
                })
            }
        })

        test.forEach(function(element) {
            // console.log(element);
            if(element.predicate == 'https://schema.org/domainIncludes') {
                    if(tmpProp.some(e => e.nameShort == element.objectShort)) {
                        const tmpObj = tmpProp.find(e => e.nameShort == element.objectShort);
                        tmpProp[tmpProp.indexOf(tmpObj)].properties.push(element.subjectShort);
                    }  
                    // console.log(element);    
            }
            if(element.predicate == 'https://schema.org/rangeIncludes') {
                if(propNoNested.some(e => e.nameShort == element.subjectShort)) {
                    const tmpObj = propNoNested.find(e => e.nameShort == element.subjectShort)
                    propNoNested[propNoNested.indexOf(tmpObj)].types.push(element.objectShort);
                } else {
                    const tmpPropArr = [];
                    tmpPropArr.push(element.objectShort);
                    propNoNested.push({
                        name: element.subject,
                        nameShort: element.subjectShort,
                        types: tmpPropArr
                    });
                }
                // console.log(element);
            }
        })

        // DODANIE NIEZAGNIEŻDŻONYCH WŁAŚCIWOŚCI
        propNoNested.forEach(function(element) {
            addPropDB({
                name: element.name,
                nameShort: element.nameShort,
                types: element.types
            })
        })

        // DODANIE NIEZAGNIEŻDŻONYCH ELEMENTÓW DO BAZY DANYCH
        tmpProp.forEach(function(element) {
            addElementDBNoNested({
                name: element.name,
                nameShort: element.nameShort,
                parent: element.parent,
                parentShort: element.parentShort,
                properties: element.properties
            })
            // console.log(element);
        })

        // // DODANIE NIEZAGNIEŻDŻONYCH ELEMENTÓW DO BAZY DANYCH
        // test.forEach(function(element) {
        //     if(element.predicate == 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
        //         // objectsNoNested.push({
        //         //     name: element.subject,
        //         //     nameShort: element.subjectShort,
        //         //     parent: element.object,
        //         //     parentShort: element.objectShort
        //         // })
        //         addElementDBNoNested({
        //             name: element.subject,
        //             nameShort: element.subjectShort,
        //             parent: element.object,
        //             parentShort: element.objectShort
        //         })
        //     }
        // })

        // // DODAWANIE ELEMENTÓW DO BAZY DANYCH !!!!
        // mainObjects.forEach(function(element) {
        //     addElementDB({
        //         name: element.name,
        //         nameShort: element.nameShort,
        //         childrens: element.childrens
        //     })
        // })

        // test.forEach(function(element) {
        //     findElements(element, mainObjects);
        // })   
        // console.log(mainObjects);
        const ttt = await Element.find({});
        // console.log(test);
        generateForm(ttt);
    })()

    const addElementDB = async (data) => {
        try {
            const element = new Element(data);
            await element.save();
            console.log(element);
        } catch (error) {
            console.log(error);
        }
    }

    const addElementDBNoNested = async (data) => {
        try {
            const element = new ElementNoNested(data);
            await element.save();
            console.log(element);
        } catch (error) {
            console.log(error);
        }
    }    

    const addPropDB = async (data) => {
        try {
            const element = new PropNoNested(data);
            await element.save();
            console.log(element);
        } catch (error) {
            console.log(error);
        }
    }

    function generateForm(arrayQuads) {
            let tmp = '<select id="tmpSelect">';
            let i = 0;
            for(let item of arrayQuads) {
                tmp += '<option value="' + i + '">' + item.nameShort + '</option>';
                i++;
            }
            tmp += '</select>'
            res.send(tmp);
    }   
}