const apiURL = 'https://restcountries.com/v3.1/all'; //Constante contendo a url da API
let countries = []; //Array dos paises
let filteredCountries = []; //Variavel dos filtros

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
        //Cria uma DIV constante
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

    // Popula as regiões
    const regions = new Set(countries.map(c => c.region));
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.text = region;
        regionFilter.appendChild(option);
    });

    // Evento de mudança na região
    regionFilter.addEventListener('change', (e) => {
        const selectedRegion = e.target.value;
        subregionFilter.innerHTML = '<option value="">Todas Sub-regiões</option>';

        // Popula as sub-regiões de acordo com a região selecionada
        const subregions = new Set(countries
            .filter(c => c.region === selectedRegion && c.subregion)
            .map(c => c.subregion)
        );

        subregions.forEach(subregion => {
            const option = document.createElement('option');
            option.value = subregion;
            option.text = subregion;
            subregionFilter.appendChild(option);
        });

        applyFilters(); // Atualiza os países ao mudar a região
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

    applySorting(); // Adiciona a ordenação após os filtros
    displayCountries();
}

// Função para aplicar a ordenação
function applySorting() {
    const sortCriteria = document.getElementById('sort-filter').value;

    if (sortCriteria) {
        filteredCountries.sort((a, b) => {
            if (sortCriteria === 'name') {
                return a.name.common.localeCompare(b.name.common);
            } else if (sortCriteria === 'population') {
                return a.population - b.population;
            } else if (sortCriteria === 'area') {
                return a.area - b.area;
            }
            return 0; // Caso não haja critério, mantém a ordem
        });
    }
}

// Eventos de input
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('region-filter').addEventListener('change', applyFilters);
document.getElementById('subregion-filter').addEventListener('change', applyFilters);
document.getElementById('population-filter').addEventListener('change', applyFilters);
document.getElementById('sort-filter').addEventListener('change', applyFilters);

// Inicializa a busca dos países
fetchCountries();