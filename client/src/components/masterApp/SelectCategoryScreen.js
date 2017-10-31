import React from 'react';
import Select from "react-select";
import "react-select/dist/react-select.css";
import DataAccess from '../../scripts/DataAccess';

export default class SelectCategoryScreen extends React.Component {
  constructor(props){
    super(props);
    // TODO: GET ALL THE CATEGORIES FROM THE DATABASE.
    this.state = {
      categories: [
        'Huis en tuin',
        'Algemeen',
        'Wonen',
        'School'
      ],
      selectedCategories: [],
      amountOfSelectedCategories: 0,
      maxCategoriesToSelect: 3
    }
    this.handleSelectedCategories = this.handleSelectedCategories.bind(this);
  }
  handleSelectedCategories(values) {
    this.setState({
      selectedCategories: values,
      amountOfSelectedCategories: this.state.selectedCategories.length
    });
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
            closeOnSelect={this.state.selectedCategories.length === 2}
            placeholder="Selecteer categorieën"
            noResultsText="Geen categorieën gevonden"
            options={this.state.categories.map(i => { return { label: i, value: i }; })}
            value={this.state.selectedCategories}
            className="selectField"
          />
          {this.state.selectedCategories.length === 3 && <button onClick={this.props.goToSelectQuestionScreen}>Ga door</button>}
          {// TODO: PUT THE SELECTED CATEGORIES IN THE DATABASE FOR THIS ROUND.
            console.log(this.state.selectedCategories)}
      </div>
    );
  }
}
