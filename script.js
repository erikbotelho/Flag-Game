// #region Declaração de variáveis

let correctCountry;
let options = [];

let consecutiveAnswers = 0; 
let totalCorrect = 0; 
let total = 0;
let maxConsecutive = 0;

let timer;
let timeLeft;
let isTimerActive = false;

// #endregion 

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

    // Inicia o timer após exibir a nova questão
    startTimer();
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
    clearInterval(timer);

    const resultDiv = document.getElementById('result');

    total++; 

    if (selected.name.common === correctCountry.name.common) {
        resultDiv.innerHTML = '<p>Correto!</p>';
        totalCorrect++;
        consecutiveAnswers++;
        if (consecutiveAnswers > maxConsecutive) {
            maxConsecutive = consecutiveAnswers;
        }
        updateCursor();
    } else {
        resultDiv.innerHTML = `<p>O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
        consecutiveAnswers = 0;
        updateCursor();
    }

    // Placar
    document.getElementById('score').innerHTML = `Sequência: ${consecutiveAnswers}<br>Pontos: ${totalCorrect}<br>Tentativas: ${total}<br>Recorde: ${maxConsecutive}`;

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
    document.getElementById('score').innerHTML = `Sequência: ${consecutiveAnswers}<br>Pontos: ${totalCorrect}<br>Tentativas: ${total}<br>Recorde: ${maxConsecutive}`;
};

function startTimer() {
    // Verifica se o timer está ativo, se não estiver, sai da função
    if (!isTimerActive) return;
    
    // Limpa timers existentes
    clearInterval(timer);
    
    // Define o tempo inicial(digitado pelo usuário)
    timeLeft = parseInt(document.getElementById('timerInput').value);
    
    // Atualiza a "tela" do timer
    updateTimerDisplay();
    
    // Inicia um novo intervalo a  cada segundo
    timer = setInterval(() => {
        // Diminui o tempo restante em 1 segundo
        timeLeft--;
        // Atualiza a "tela" do timer
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            // Para o timer
            clearInterval(timer);
            // Envia uma resposta errada ao final do tempo
            checkAnswer({ name: { common: 'timeout' } });
        }
    }, 1000);
}

function updateTimerDisplay() {
    // Atualiza a "tela" do timer
    document.getElementById('timerDisplay').textContent = timeLeft;
}

function toggleTimer() {
    // Ativa/Desativa o timer
    isTimerActive = document.getElementById('timerToggle').checked;
    // Ativa/Desativa o input de tempo
    document.getElementById('timerInput').disabled = !isTimerActive;
    // Se o timer foi desativado
    if (!isTimerActive) {
        // Para o timer atual
        clearInterval(timer);
        // Limpa a "tela" do timer
        document.getElementById('timerDisplay').textContent = '';
    }
}

function toggleDarkMode() {
    const isDarkMode = document.getElementById('darkModeToggle').checked;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}
