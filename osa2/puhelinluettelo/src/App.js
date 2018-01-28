import React from 'react';
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
			newNumber: '',
			searchString: ''
    }
  }

	componentWillMount() {
		axios
		.get('http://localhost:3001/persons')
			.then(response => {
				this.setState({persons: response.data})
			})
	}
	
	handleSearchString = (event) => {
		this.setState({searchString: event.target.value})
	}
	
	handleNameChange = (event) => {
		this.setState({newName: event.target.value})
	}
	
	handleNumberChange = (event) => {
		this.setState({newNumber: event.target.value})
	}
	
  addPerson = (event) => {
		event.preventDefault()
		
		const newName = this.state.newName
		const newNumber = this.state.newNumber
		
		if (newName !== '' 
	  && newNumber !== ''
		&& !this.state.persons.some(person => person.name === newName)) {
					
			this.setState({
				persons: this.state.persons.concat(
					{name: this.state.newName, number: this.state.newNumber}
				)
			})
		}
		this.setState({
				newName: '',
				newNumber: ''
		})
	}
	
  render() {
		const personsToShow = this.state.persons.filter(person => 
			person.name.toLowerCase().includes(this.state.searchString.toLowerCase()) ||
			person.number.includes(this.state.searchString)
		)
		
    return (
      <div>
        <h2>Puhelinluettelo</h2>
		
				<Search state={this.state} changeHandler={this.handleSearchString} />
			
				<NewForm 
					state={this.state} 
					addPersonHandler={this.addPerson} 
					nameChangeHandler={this.handleNameChange}
					numberChangeHandler={this.handleNumberChange}
				/>
				
        
        <Persons persons={personsToShow} />
		
      </div>
    )
  }
}

const Search = ({state, changeHandler}) => (
	<div>
		rajaa näytettäviä
		<form>
			<input value={state.searchString} onChange={changeHandler} />
		</form>
	</div>
)

const NewForm = ({state, addPersonHandler, nameChangeHandler, numberChangeHandler}) => (
	<div>
		<h2>Lisää uusi</h2>
    <form onSubmit={addPersonHandler}>
      <div>
        nimi: <input value={state.newName} onChange={nameChangeHandler} />
				puhelinnumero: <input value={state.newNumber} onChange={numberChangeHandler}/>
      </div>
		  
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
	</div>
)

const Persons = ({persons}) => {
	const personsMapped = persons.map(person => 
		<div key={person.name}>{person.name} ({person.number})</div>
	)
	return (
		<div>
			<h2>Numerot</h2>
			{personsMapped}
		</div>
	)
}

export default App