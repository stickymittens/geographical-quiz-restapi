import { defineStore } from 'pinia'

export const useCountryStore = defineStore('country', {
  state: () => ({
    countries: [],
  }),
  actions: {
    async fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all')
        const data = await response.json()

        this.countries = data.map((country) => ({
          name: country.name.common,
          countryCode: country.altSpellings[0],
          capital: country.capital,
          languages: country.languages,
          population: country.population,
          continents: country.continents,
        }))
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    },
  },
})
