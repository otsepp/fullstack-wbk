import React from 'react'
import axios from 'axios'

class App extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = {
			countries: [],
			findString: ''
		}
	}
	
	componentWillMount() {
		axios
			.get('https://restcountries.eu/rest/v2/all')
				.then(response => {
						this.setState({
							countries: response.data.map(country => (
								{name: country.name, capital: country.capital, population: country.population, flag: country.flag}
							))
						})
				})
	}
	
	handleFindStringName = (event) => {
		this.setState({findString: event.target.value})
	}
	
	handleClick = (event) => {
		const country = event
		this.setState({findString: country.name})
	}
	
  render() {
		let countriesFound = this.state.countries.filter(country => 
			country.name.toLowerCase().includes(this.state.findString.toLowerCase())
		)
		
		let contentToRender
		
		if (countriesFound.length === 1)
			contentToRender = <Country country={countriesFound[0]}/>
		else if (countriesFound.length > 1 && countriesFound.length <= 10)
			contentToRender = countriesFound.map(country => <div onClick={this.handleClick.bind(this, country)} key={country.name}>{country.name}</div>)
		else if (countriesFound.length > 10)
			contentToRender = <div>too many matches, specify another filter</div>
			
    return (
      <div>
				find countries
				<form>
					<input value={this.state.findString} onChange={this.handleFindStringName}>
					</input>
				</form>
				{contentToRender}
      </div>
    )
  }
}

const Country = ({country}) => {
	return (
		<div>
			<h2>{country.name}</h2>
			<p>capital: {country.capital}</p>
			<p>population: {country.population}</p>
			<img src={country.flag} height='120' width='180' alt='flag'/>
		</div>
	)
}

export default App;
