import React from 'react'

const Kurssi = ({kurssi}) => (
	<div>
		<Otsikko nimi={kurssi.nimi} />
		<Sisalto osat={kurssi.osat} />
		<Yhteensa osat={kurssi.osat} />
	</div>
)

const Otsikko = ({nimi}) => (
	<h2>{nimi}</h2>
)

const Sisalto = ({osat}) => {
	const listOsat = osat.map((osa) =>
		<Osa osa={osa} key={osa.nimi} />
	)
	
	return (
		<div>
			{listOsat}
		</div>
	)
}

const Osa = ({osa}) => (
	<p>{osa.nimi} {osa.tehtavia}</p>
)

const Yhteensa = ({osat}) => {
	const tehtYht = osat.map(osa => osa.tehtavia).reduce((accumulator, currentValue) => accumulator + currentValue)
	return (
		<p>yhteensä {tehtYht} tehtävää</p>
	)
}

export default Kurssi