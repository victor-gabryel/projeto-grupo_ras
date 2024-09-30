const apiURL = 'https://restcountries.com/v3.1/all'; //Constante contendo a url da API
let countries = []; //Array dos paises

// Função para buscar países
async function fetchCountries() {
    try {
        const response = await fetch(apiURL);
        countries = await response.json();
    } catch (error) {
        console.error('Erro ao buscar países:', error);
    }
}

// Função para carregar detalhes do país
function loadCountryDetails() {
    const params = new URLSearchParams(window.location.search);
    const countryName = decodeURIComponent(params.get('name'));

    const country = countries.find(c => c.name.common === countryName);
    if (country) {
        displayCountryDetails(country);
    } else {
        console.error('País não encontrado:', countryName);
    }
}

// Função para exibir detalhes do país
function displayCountryDetails(country) {
    const details = document.getElementById('country-details');
    details.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="${country.name.common}">
        <p><strong>Nome oficial:</strong> ${country.name.official}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Região:</strong> ${country.region}</p>
        <p><strong>Sub-região:</strong> ${country.subregion ? country.subregion : 'N/A'}</p>
        <p><strong>População:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Área:</strong> ${country.area.toLocaleString()} km²</p>
        <p><strong>Idiomas:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
        <p><strong>Moedas:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(', ')}</p>
        <p><strong>Fuso horário:</strong> ${country.timezones.join(', ')}</p>
        <p><strong>Domínio:</strong> ${country.tld.join(', ')}</p>
        <p><strong>Código de discagem:</strong> +${country.idd.root}${country.idd.suffixes ? country.idd.suffixes.join(', +') : ''}</p>
    `;
    details.style.display = 'block'; // Mostra os detalhes
}

// Função para voltar à página anterior
function goBack() {
    window.history.back();
}

// Inicializa a busca dos países e carrega detalhes do pías
fetchCountries().then(() => {
    loadCountryDetails();
});