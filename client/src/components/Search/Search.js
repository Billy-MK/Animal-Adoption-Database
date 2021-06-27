import React, { useState, useEffect, useContext } from "react";
import 'bulma/css/bulma.min.css';
import API from "../../utils/API";
import "./Search.css";
import SwitchSelector from "react-switch-selector";
import SearchContext from "../../utils/SearchContext";


function Search(props) {
    const [formObject, setFormObject] = useState({searchField: ""})
    const { page, rows } = useContext(SearchContext);

    useEffect(() => {
        API.searchAnimals({searchField: "", species: "dog"})
        .then(res=>props.setResults(res.data.data, res.data.foundRows))
    }, [])

    useEffect(() => {
        API.searchAnimals({searchField:formObject.searchField, species: formObject.species, zipCode: formObject.zipCode, page:page})
        .then(res=> {
            props.setResults(res.data.data, res.data.foundRows)
        })
    }, [page])
    
    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormObject({...formObject, [name]: value});
      };

    function handleFormSubmit(event) {
        event.preventDefault();
        if (page === 1) {
            API.searchAnimals({searchField:formObject.searchField, species: formObject.species, zipCode: formObject.zipCode, page:1})
            .then(res=>props.setResults(res.data.data, res.data.foundRows))
        } else {
            props.setPage(1)
        }
        // console.log(formObject)
        // API.searchAnimals({searchField:formObject.searchField, species: formObject.species, zipCode: formObject.zipCode})
        // .then(res => props.setResults(res.data.data))
    };

    const options = [
        {
            label: "Dogs",
            value: "dog",
            selectedBackgroundColor: "#f08080",
            fontColor: "white",
            selectedFontColor: "black"
        },
        {
            label: "Cats",
            value: "cat",
            selectedBackgroundColor: "#f08080",
            fontColor: "white",
            selectedFontColor: "black"
        }
     ];
      
     const onChange = (newValue) => {
         setFormObject({...formObject, species: newValue});
        //  API.searchAnimals({searchField:formObject.searchField, species: newValue, zipCode: formObject.zipCode, page: 1})
        //  .then(res => props.setResults(res.data.data))
        if (page === 1) {
            API.searchAnimals({searchField:formObject.searchField, species: newValue, zipCode: formObject.zipCode, page: 1})
            .then(res => props.setResults(res.data.data, res.data.foundRows))
        } else {
            props.setPage(1)
        }
        };
      
     const initialSelectedIndex = options.findIndex(({value}) => value === "dog");

    return (

        <nav className="level">
            <div className="level-left">
                <div className="level-item">
                    <form className="field has-addons">
                        <p className="control">
                            <input className="input search-box" type="text" placeholder="Search by breed" onChange={handleInputChange} name="searchField">
                            </input>
                        </p>
                        <p className="control">
                            <input className="input zip-box" type="text" placeholder="Zipcode" onChange={handleInputChange} name="zipCode">
                            </input>
                        </p>
                        <p className="control">
                            <button className="button" onClick={handleFormSubmit}>
                                Search
                            </button>
                        </p>
                    </form>
                </div>
            </div>


            <div className="level-right">
                {/* <p className="level-item filtertxt"><strong>Quick Filter By:</strong></p> */}
                <div style={{width: 130, height: 40}}>
                    <SwitchSelector
                        onChange={onChange}
                        options={options}
                        initialSelectedIndex={initialSelectedIndex}
                        backgroundColor={"#353b48"}
                        fontColor={"#f5f6fa"}
                    />
                </div>
            </div>
        </nav >

    );

}

export default Search;
