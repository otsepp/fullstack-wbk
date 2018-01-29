import React from 'react';
import personService from './services/persons'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
			newNumber: '',
			searchString: '',
			notificationMessage: null
    }
  }

	componentWillMount() {
			personService.getAll()
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
		
		if (newName !== '' && newNumber !== '') {
			if (!this.state.persons.some(person => person.name === newName)) {		
				const newPerson = {name: newName, number: newNumber}
				
				personService.create(newPerson)
					.then(response => {
						this.setState({
							persons: this.state.persons.concat(response.data), 
							newName: '',
							newNumber: '',
							notificationMessage: 'henkilö lisätty'
						})
					})
					
			} else if (window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella?`)) {
				let person = this.state.persons.find(person => person.name === newName)
				person = {...person, number: newNumber}
				const id = person.id
								
				personService.update(id, person)
					.then(response => {
						const persons = this.state.persons.filter(person => person.id !== id)
						this.setState({
							persons: persons.concat(person),
							newName: '',
							newNumber: '',
							notificationMessage: 'numero muutettu'
						})
					})
					.catch(error => {
						alert('person does not exist')
						this.setState({
							persons: this.state.persons.filter(person => person.id !== id)
						})
					})
			}
		} else {
			alert('Kentät eivät saa olla tyhjiä')
		}
	}
	
	removePerson = (id) => {
		personService.remove(id)
			.then(response => {
				this.setState({
					persons: this.state.persons.filter(person => person.id !== id),
					notificationMessage: 'henkilö poistettu'
				})
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
		
				<Notification message={this.state.notificationMessage} />
		
				<Search state={this.state} changeHandler={this.handleSearchString} />
			
				<NewForm 
					state={this.state} 
					addPersonHandler={this.addPerson} 
					nameChangeHandler={this.handleNameChange}
					numberChangeHandler={this.handleNumberChange}
				/>
				
        
        <Persons persons={personsToShow} listener={this.removePerson} />
		
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
        nimi: <input value={state.newName} onChange={nameChangeHandler} /><br></br>
				puhelinnumero: <input value={state.newNumber} onChange={numberChangeHandler}/><br></br>
        <button type="submit">lisää</button>   
    </form>
	</div>
)

const Persons = ({persons, listener}) => {
	const personsMapped = persons.map(person => 
		<div key={person.name}>
			{person.name} ({person.number})
			<button onClick={listener.bind(this, person.id)}>poista</button>
		</div>
	)
	return (
		<div>
			<h2>Numerot</h2>
			{personsMapped}
		</div>
	)
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="notification">
      {message}
    </div>
  )
} 

export default App