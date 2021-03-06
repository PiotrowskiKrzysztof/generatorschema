require('../db/mongoose');
const fs = require('fs');
const N3 = require('n3');
const path = require('path');
const Element = require('../db/models/element');
const ElementNoNested = require('../db/models/elementNoNested');
const PropNoNested = require('../db/models/propNoNested');

const parser = new N3.Parser();
const rdfStream = fs.createReadStream(path.join('./schemaorg-current-http.ttl'));

const mainObjects = [];
const objectsNoNested = [];
const tmpArray = [];
const tmpProp = [];
const propNoNested = [];
const tmpSet = new Set(); 

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
    console.log('Start remake database');
    const test = await getQuads(rdfStream);
           
    test.forEach(function findMainObjects(element) {
        if(element.object == 'http://schema.org/Thing' && element.subjectShort[0] == element.subjectShort[0].toUpperCase()) {
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
        if(element.predicate == 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
            tmpProp.push({
                name: element.subject,
                nameShort: element.subjectShort,
                parent: element.object,
                parentShort: element.objectShort,
                properties: []
            })
        } else if(element.subject == 'http://schema.org/Thing' && element.object == 'http://www.w3.org/2000/01/rdf-schema#Class') {
            tmpProp.push({
                name: 'http://schema.org/Thing',
                nameShort: 'Thing',
                parent: 'this',
                parentShort: 'this',
                properties: []
            })
        }
    })

    test.forEach(function(element) {
        if(element.predicate == 'http://schema.org/domainIncludes') {
                if(tmpProp.some(e => e.nameShort == element.objectShort)) {
                    const tmpObj = tmpProp.find(e => e.nameShort == element.objectShort);
                    tmpProp[tmpProp.indexOf(tmpObj)].properties.push(element.subjectShort);
                }    
        }
        if(element.predicate == 'http://schema.org/rangeIncludes') {
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
        }
    })

    // DODANIE NIEZAGNIE??D??ONYCH W??A??CIWO??CI
    console.log('add no nested props');
    propNoNested.forEach(function(element) {
        replacePropsNoNested(element);
    })

    // DODANIE NIEZAGNIE??D??ONYCH ELEMENT??W DO BAZY DANYCH
    console.log('add no nested elements');
    tmpProp.forEach(function(element) {
        replaceElementsNoNested(element);
    })

    // DODAWANIE ELEMENT??W DO BAZY DANYCH !!!!
    console.log('add elements');
    mainObjects.forEach(function(element) {
        replaceElements(element);
    })
    
    console.log('End remake database');
})()

async function replacePropsNoNested(data) {
    const element = await PropNoNested.findOne({ nameShort: data.nameShort });
    if(element === null) {
        addPropDB({
            name: data.name,
            nameShort: data.nameShort,
            types: data.types
        })
    } else {
        element.types = data.types;
    }
}

async function replaceElementsNoNested(data) {
    const element = await ElementNoNested.findOne({ nameShort: data.nameShort });
    if(element === null) {
        addElementDBNoNested({
            name: data.name,
            nameShort: data.nameShort,
            parent: data.parent,
            parentShort: data.parentShort,
            properties: data.properties
        })
    } else {
        element.properties = data.properties
    }
}

async function replaceElements(data) {
    const element = await Element.findOne({ nameShort: data.nameShort });
    if(element === null) {
        addElementDB({
            name: data.name,
            nameShort: data.nameShort,
            childrens: data.childrens
        })
    } else {
        element.childrens = data.childrens
    }
}

const addElementDB = async (data) => {
    try {
        const element = new Element(data);
        await element.save();
    } catch (error) {
        console.log(error);
    }
}

const addElementDBNoNested = async (data) => {
    try {
        const element = new ElementNoNested(data);
        await element.save();
    } catch (error) {
        console.log(error);
    }
}    

const addPropDB = async (data) => {
    try {
        const element = new PropNoNested(data);
        await element.save();
    } catch (error) {
        console.log(error);
    }
}