const apiURL = 'https://restcountries.com/v3.1/all';
let countries = [];
let filteredCountries = [];

// Função para buscar países
async function fetchCountries() {
    try {
        const response = await fetch(apiURL);
        countries = await response.json();
        filteredCountries = [...countries];
        displayCountries();
        populateFilters();
    } catch (error) {
        console.error('Erro ao buscar países:', error);
    }
}

// Função para exibir países
function displayCountries() {
    const countryList = document.getElementById('country-list');
    countryList.innerHTML = '';
    filteredCountries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('country-card');
        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}">
            <h3>${country.name.common}</h3>
            <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p>Região: ${country.region}</p>
        `;
        countryCard.onclick = () => showCountryDetails(country);
        countryList.appendChild(countryCard);
    });
}

// Função para redirecionar para a página de detalhes do país
function showCountryDetails(country) {
    const countryName = encodeURIComponent(country.name.common);
    window.location.href = `country.html?name=${countryName}`;
}

// Função para popular filtros
function populateFilters() {
    const regionFilter = document.getElementById('region-filter');
    const subregionFilter = document.getElementById('subregion-filter');

    const regions = new Set(countries.map(c => c.region));
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.text = region;
        regionFilter.appendChild(option);
    });

    regionFilter.addEventListener('change', (e) => {
        const selectedRegion = e.target.value;
        subregionFilter.innerHTML = '<option value="">Todas Sub-regiões</option>';

        const subregions = new Set(countries
            .filter(c => c.region === selectedRegion)
            .map(c => c.subregion)
        );
        subregions.forEach(subregion => {
            const option = document.createElement('option');
            option.value = subregion;
            option.text = subregion;
            subregionFilter.appendChild(option);
        });
    });
}

// Função para aplicar filtros
function applyFilters() {
    const search = document.getElementById('search').value.toLowerCase();
    const region = document.getElementById('region-filter').value;
    const subregion = document.getElementById('subregion-filter').value;
    const populationRange = document.getElementById('population-filter').value;

    filteredCountries = countries.filter(country => {
        let matchesSearch = country.name.common.toLowerCase().includes(search);
        let matchesRegion = region ? country.region === region : true;
        let matchesSubregion = subregion ? country.subregion === subregion : true;
        let matchesPopulation = true;

        if (populationRange) {
            const population = country.population;
            if (populationRange === '0-1M') matchesPopulation = population < 1000000;
            if (populationRange === '1M-10M') matchesPopulation = population >= 1000000 && population <= 10000000;
            if (populationRange === '10M-100M') matchesPopulation = population >= 10000000 && population <= 100000000;
            if (populationRange === '>100M') matchesPopulation = population > 100000000;
        }

        return matchesSearch && matchesRegion && matchesSubregion && matchesPopulation;
    });

    displayCountries();
}

// Eventos de input
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('region-filter').addEventListener('change', applyFilters);
document.getElementById('subregion-filter').addEventListener('change', applyFilters);
document.getElementById('population-filter').addEventListener('change', applyFilters);
document.getElementById('sort-filter').addEventListener('change', applyFilters);

// Inicializa a busca dos países
fetchCountries();
