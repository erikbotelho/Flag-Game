let correctCountry;
let options = [];

let consecutiveAnswers = 0; 
let totalCorrect = 0; 
let total = 0;

function getCountryNameInPortuguese(country) {
    // Verifica se há tradução para português
    return country.translations && country.translations.por ?
        country.translations.por.common : country.name.common;
}

function getRandomCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            // Seleciona um país aleatório como o correto
            const randomIndex = Math.floor(Math.random() * data.length);
            correctCountry = data[randomIndex];
            options = [correctCountry];

            // Adiciona mais 3 opções aleatórias de países
            while (options.length < 4) {
                const randomOption = data[Math.floor(Math.random() * data.length)];
                if (!options.includes(randomOption)) {
                    options.push(randomOption);
                }
            }

            // Embaralha as opções
            options.sort(() => Math.random() - 0.5);

            displayQuestion();
        })
        .catch(error => console.error('Erro:', error));
}

function displayQuestion() {
    // Exibe a bandeira do país correto
    document.getElementById('flagImage').src = correctCountry.flags.png;
    document.getElementById('flagImage').style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores

    // Cria botões para as opções de países
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = getCountryNameInPortuguese(option);
        button.className = 'answer-button';
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

// Altera o cursor com 5+ acertos
function updateCursor() {
    if (consecutiveAnswers >= 5) {
        document.body.classList.add('special-cursor');
    } else {
        document.body.classList.remove('special-cursor');
    }
}

function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');

    total++; 

    if (selected.name.common === correctCountry.name.common) {
        resultDiv.innerHTML = '<p>Correto!</p>';
        totalCorrect++;
        consecutiveAnswers++;
        updateCursor();
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
        consecutiveAnswers = 0;
        updateCursor();
    }

    // Placar
    document.getElementById('score').innerHTML = `Pontos Consecutivos: ${consecutiveAnswers}<br>Pontos: ${totalCorrect}<br>Tentativas: ${total}`;

    // Desabilita os botões de opção
    const optionsDiv = document.getElementById('options');
    const buttons = document.getElementsByClassName('answer-button');
    for (let button of buttons) {
        button.disabled = true;
    }

    document.getElementById('nextButton').style.display = 'block'; // Exibe o botão "Próximo"
}

document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = ''; // Limpa o resultado anterior
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    getRandomCountries(); // Carrega uma nova bandeira
};

// Carrega o jogo e o placar ao iniciar o site
window.onload = () => {
    getRandomCountries();
    document.getElementById('score').innerHTML = `Pontos Consecutivos: ${consecutiveAnswers}<br>Pontos: ${totalCorrect}<br>Tentativas: ${total}`;
};