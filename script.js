const apiURL = 'https://restcountries.com/v3.1/all';
let countries = [];
let filteredCountries = [];
let currentPage = 1;
const pageSize = 20;

// Função para buscar países da API
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

// Função para exibir os países com paginação
function displayCountries() {
    const countryList = document.getElementById('country-list');
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const countriesToDisplay = filteredCountries.slice(startIndex, endIndex);

    countriesToDisplay.forEach(country => {
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

// Função para preencher os filtros de região e sub-região
function populateFilters() {
    const subregionFilter = document.getElementById('subregion-filter');
    const regions = new Set(countries.map(c => c.region));
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.text = region;
        document.getElementById('region-filter').appendChild(option);
    });
}

// Função para exibir detalhes do país selecionado
function showCountryDetails(country) {
    localStorage.setItem('country', JSON.stringify(country));
    window.location.href = 'country.html';
}

// Função para aplicar filtros de busca
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('region-filter').addEventListener('change', applyFilters);
document.getElementById('subregion-filter').addEventListener('change', applyFilters);
document.getElementById('population-filter').addEventListener('change', applyFilters);
document.getElementById('sort-filter').addEventListener('change', applyFilters);

function applyFilters() {
    const search = document.getElementById('search').value.toLowerCase();
    const region = document.getElementById('region-filter').value;
    const subregion = document.getElementById('subregion-filter').value;
    const populationRange = document.getElementById('population-filter').value;
    const sort = document.getElementById('sort-filter').value;

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

    if (sort === 'name') filteredCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    if (sort === 'population') filteredCountries.sort((a, b) => a.population - b.population);
    if (sort === 'area') filteredCountries.sort((a, b) => a.area - b.area);

    document.getElementById('country-list').innerHTML = '';
    displayCountries();
}

// Função para exibir detalhes do país selecionado na página de detalhes
if (window.location.pathname.includes('country.html')) {
    const country = JSON.parse(localStorage.getItem('country'));
    const details = document.getElementById('country-details');
    document.getElementById('country-name').innerText = country.name.common;
    details.innerHTML = `
        <img src="${country.flags.png}" alt="${country.name.common}">
        <p><strong>Nome oficial:</strong> ${country.name.official}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Região:</strong> ${country.region}</p>
        <p><strong>Sub-região:</strong> ${country.subregion}</p>
        <p><strong>População:</strong> ${country.population}</p>
        <p><strong>Área:</strong> ${country.area} km²</p>
        <p><strong>Idiomas:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
        <p><strong>Moedas:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(', ')}</p>
        <p><strong>Fuso horário:</strong> ${country.timezones.join(', ')}</p>
        <p><strong>Domínio:</strong> ${country.tld.join(', ')}</p>
        <p><strong>Código de discagem:</strong> +${country.idd.root}${country.idd.suffixes[0]}</p>
    `;
    document.getElementById('back-btn').onclick = () => window.history.back();
}

// Função de scroll infinito para carregar mais países
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        currentPage++;
        displayCountries();
    }
});

// Inicializa a busca dos países
fetchCountries();


// fetchCountries(): Busca a lista de países da API RestCountries e popula os filtros.

// displayCountries(): Exibe a lista de países na tela, com a lógica de paginação para carregar mais países à medida que o usuário desce a página.

// applyFilters(): Aplica os filtros de busca por nome, região, sub-região e população, e ordena a lista de países de acordo com as opções selecionadas.

// showCountryDetails(): Armazena os dados do país selecionado no localStorage e redireciona para a página de detalhes do país.

// populateFilters(): Preenche os filtros de região e sub-região com base nos dados obtidos da API.

// scroll infinito: Carrega mais países ao descer a página, implementando a paginação no lado do cliente.