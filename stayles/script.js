
document.getElementById('menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('show');
});
/*navbar */

const apiUrl = 'https://restcountries.com/v3.1/all';

let flags = [];
let currentFlagIndex;
let score = 0;
let questionCount = 0;
let maxQuestions;
let timer;
let difficultyLevel;
let hasAnsweredCorrectly = false;

// API'den bayrak ve ülke bilgilerini çek
async function fetchFlags() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        data.forEach(country => {
            const countryInfo = {
                country: country.translations.tur?.common || country.name.common,
                image: country.flags.svg
            };
            flags.push(countryInfo);
        });

    } catch (error) {
        console.error('API Hatası:', error);
    }
}

function selectDifficulty() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('difficulty-selection').style.display = 'flex';
}

function showDifficultyMessage(message, nextFunction) {
    document.getElementById('difficulty-selection').style.display = 'none';
    const messageElement = document.createElement('div');
    messageElement.id = 'difficulty-message';
    messageElement.textContent = message;
    messageElement.style.fontSize = '18px';
    messageElement.style.textAlign = 'center';
    messageElement.style.marginTop = '20px';
    messageElement.style.color = '#333';
    messageElement.style.opacity = '0';
    document.body.appendChild(messageElement);

    // Fade-in effect
    setTimeout(() => {
        messageElement.classList.add('fade-in');
        messageElement.style.opacity = '1';
    }, 100); // küçük bir gecikme ile başlat

    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(messageElement);
            nextFunction();
        }, 1000); // 1 saniye animasyon süresi
    }, 2000); // 2 saniye
}

function startGame(difficulty) {
    score = 0;
    questionCount = 0;
    difficultyLevel = difficulty;
    hasAnsweredCorrectly = false; // Yeniden başlat

    if (difficulty === 'easy') {
        maxQuestions = 55; // Kolay seviyede 55 soru
        showDifficultyMessage('Yeni bir şey öğrenmek başlangıçta kolay görünebilir, ama zamanla daha derinlemesine anlamak gerektirir.', () => {
            document.getElementById('game').style.display = 'flex';
            loadFlag();
        });
    } else if (difficulty === 'medium') {
        maxQuestions = 105; // Orta seviyede 105 soru
        showDifficultyMessage('Bu aşama, başlangıç seviyesinden ileri düzeye geçişteki kritik bölgeyi temsil eder.', () => {
            document.getElementById('game').style.display = 'flex';
            loadFlag();
        });
    } else if (difficulty === 'hard') {
        maxQuestions = 'Sonsuz'; // Zor seviyede soru limiti yok
        showDifficultyMessage('Başarıya ulaşmak için sabır ve dikkat gerektiren bir süreçtir.', () => {
            document.getElementById('game').style.display = 'flex';
            loadFlag();
        });
    }
}

function loadFlag() {
    if (difficultyLevel !== 'hard' && questionCount >= maxQuestions) {
        endGame();
        return;
    }

    questionCount++;

    const flagList = flags;
    currentFlagIndex = Math.floor(Math.random() * flagList.length);
    const flag = flagList[currentFlagIndex];

    document.getElementById('flag').src = flag.image;

    const options = document.getElementById('options');
    options.innerHTML = '';

    const choices = [flag.country];
    while (choices.length < 4) {
        const randomIndex = Math.floor(Math.random() * flagList.length);
        const randomCountry = flagList[randomIndex].country;
        if (!choices.includes(randomCountry)) {
            choices.push(randomCountry);
        }
    }

    choices.sort(() => Math.random() - 0.5);

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        options.appendChild(button);
    });
   
    document.getElementById('message').textContent = `Soru ${questionCount}/${maxQuestions} | Puan: ${score}`;
    document.getElementById('score').textContent = `Puan: ${score}`;

    startTimer();
}

function startTimer() {
    let timeLeft;
    if (difficultyLevel === 'easy') {
        timeLeft = 25; // Kolay seviye için 25 saniye
    } else if (difficultyLevel === 'medium') {
        timeLeft = 20; // Orta seviye için 20 saniye
    } else {
        timeLeft = 15; // Zor seviye için 15 saniye
    }

    document.getElementById('timer').textContent = `Süre: ${timeLeft}`;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Süre: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!hasAnsweredCorrectly) {
                endGame();
            } else {
                loadFlag();
            }
        }
    }, 1000);
}

function checkAnswer(choice) {
    clearInterval(timer);

    const flagList = flags; // Tüm bayrakları kullan
    const flag = flagList[currentFlagIndex];
    const message = document.getElementById('message');

    if (choice === flag.country) {
        score += 5;
        hasAnsweredCorrectly = true; // Doğru cevap verildi
        message.textContent = `Doğru! Puan: ${score}`;
        message.style.color = 'green';

        setTimeout(() => {
            if (questionCount % 20 === 0) {
                showGiftBox();
            } else {
                loadFlag();
            }
        }, 1000);

    } else {
        score = Math.max(score - 3, 0); // Puanı 0'dan az olmasını engelle
        message.textContent = `Yanlış! Doğru cevap: ${flag.country}. Puan: ${score}`;
        message.style.color = 'red';
        
        if (score <= 0) {
            endGame(); // Puan 0'a düştüğünde oyunu bitir
        } else {
            setTimeout(() => {
                loadFlag(); // Yanlış cevap verildiğinde oyunu devam ettir
            }, 1000);
        }
    }

    document.getElementById('score').textContent = `Puan: ${score}`;
}

function endGame() {
    clearInterval(timer);
    const message = difficultyLevel === 'hard'
        ? 'Oyun bitti! Tüm bayrakları bitirdiniz.'
        : 'Oyun bitti! Ana menüye dönüyorsunuz.';
    alert(message);
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
}

function showGiftBox() {
    document.getElementById('game').style.display = 'none'; // Oyun ekranını gizle
    const giftBox = document.getElementById('gift');
    giftBox.innerHTML = ''; // Mevcut içeriği temizle
    const colors = ['#f0f8ff', '#e6e6fa', '#f5f5dc']; // Renk seçenekleri

    colors.forEach(color => {
        const button = document.createElement('button');
        button.textContent = `Renk ${color}`;
        button.style.backgroundColor = color;
        button.style.margin = '10px';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = () => chooseColor(color);
        giftBox.appendChild(button);
    });

    giftBox.style.display = 'flex';
}

function chooseColor(color) {
    document.body.style.backgroundColor = color;
    alert('Renk değişti!');
    document.getElementById('gift').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    loadFlag();
}

// Oyunu başlat
fetchFlags();
