import React from "react";
import GeneratorSelect from "./GeneratorSelect";
import GeneratorSelectNext from "./GeneratorSelectNext";
import axios from '../axios';
import ClickedElement from "./ClickedElement";
import '../styles/Generator.css';
import Footer from "./Footer";


class Generator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allElements: [],
            allElementsNoNested: [],
            currentElement: '',
            pathElements: [],
            deephElements: 0,
            clickedElement: null,
            allPropsNoNested: []
        }
        this.selectedElement = this.selectedElement.bind(this);
    }

    componentDidMount() {
        this.fetchAllElements();
        this.fetchNoNestedElements();
        this.fetchPropsNoNested();
    }

    async fetchAllElements() {
        const res = await axios.get('/generator');
        const allElements = res.data;
        this.setState({ allElements: allElements });
    }

    async fetchNoNestedElements() {
        const res = await axios.get('/generator/loaddata');
        const allElementsNoNested = res.data;
        this.setState({ allElementsNoNested });
    }

    async fetchPropsNoNested() {
        const res = await axios.get('/generator/loadprops');
        const allPropsNoNested = res.data;
        this.setState({ allPropsNoNested });
    }

    selectedElement(e) {    
        const tmpArr = this.state.pathElements;
        let deeph;
        const tmpDeeph = e.target.options.selectedIndex;
        if(e.target.options[tmpDeeph].getAttribute('deeph') != null) {            
            deeph = parseInt(e.target.options[tmpDeeph].getAttribute('deeph')) + 1;
        } else {
            deeph = 0;
        }
        if(this.state.deephElements > deeph) {
            tmpArr.length = deeph;
        }
        tmpArr[deeph] = e.target.value;
        this.setState({currentElement: e.target.value, pathElements: tmpArr, deephElements: this.state.deephElements + 1, clickedElement: null });   
    }
    
    findElement(item, array) {
        const newElement = array.find(e => e.nameShort === 'ComedyEvent');
        
        if(newElement != null && newElement.childrens[0].length > 0) {  
            return newElement.childrens[0];            
        } else {
            return null;
        }        
    }

    render() {     
        return(
            <div className="container">
                <h2>Select type</h2>    
                <p>{this.state.selectedElement}</p>
                <div>
                    <GeneratorSelect 
                        allElements = { this.state.allElements }
                        selectedElement = { this.selectedElement } />

                    { this.state.pathElements.map((item, i) => (
                        
                        <GeneratorSelectNext 
                            key={i}                            
                            allElements={ this.state.allElementsNoNested }
                            currentElement={ this.state.pathElements[i] }
                            selectedElement={ this.selectedElement }
                            deeph={ i }/>))} 

                    <button className='customButton' onClick={ () => this.setState({ clickedElement: this.state.currentElement }) }>Accept</button>

                    { this.state.clickedElement != null &&                      
                        <ClickedElement 
                            allElements={ this.state.allElementsNoNested }
                            item={ this.state.clickedElement }
                            pathElements = { this.state.pathElements }
                            propsNoNested = { this.state.allPropsNoNested }
                        />
                    }
                </div>                                   
            </div>
        );
    }
}

export default Generator;