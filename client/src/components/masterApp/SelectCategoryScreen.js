import React from 'react';
import Select from "react-select";
import "react-select/dist/react-select.css";
import DataAccess from '../../scripts/DataAccess';

export default class SelectCategoryScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      categories: [],
      selectedCategories: [],
      amountOfSelectedCategories: 0,
      maxCategoriesToSelect: 3,
      roomNumber: this.props.roomNumber
    }
    this.handleSelectedCategories = this.handleSelectedCategories.bind(this);
  }
  componentDidMount(){
    let da = new DataAccess();
    da.getData(`/categories`, (err, res) => {
      if(err) throw new error();
      let categories = [];
      for (let i = 0; i < res.length; i++) {
        categories.push(res[i]);
      }
      this.setState ({categories: categories});
    });
  }
  handleSelectedCategories(values) {
    let arr = [];
    for(let i=0; i<values.length; i++){
      if(values[i].label !== arr[i]){
        arr.push(values[i].label);
      }
    }
    this.setState({
      selectedCategories: arr,
      amountOfSelectedCategories: this.state.selectedCategories.length
    });
    this.props.passSelectedCategories(arr);
  }
  render(){
    return (
      <div>
        <h1>Selecteer Categorieën</h1>
          <span>Selecteer maximaal {this.state.maxCategoriesToSelect} categorieën, momenteel heeft u er {this.state.selectedCategories.length}</span>
          <Select
            onChange={this.handleSelectedCategories}
            searchable={true}
            multi={true}
            // simpleValue={true}
            closeOnSelect={this.state.selectedCategories.length === 2}
            placeholder="Selecteer categorieën"
            noResultsText="Geen categorieën gevonden"
            options={this.state.categories.map((categorie, i) => { return ({label: categorie.name, value: categorie.name} ); })}
            value={this.state.selectedCategories}
            className="selectField"
          />
          {this.state.selectedCategories.length === 3 && <button onClick={this.props.goToSelectQuestionScreen}>Ga door</button>}
      </div>
    );
  }
}
