
// State Management
export const state = {
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false,
    answeredCount: 0,
    mode: 'practica', // 'practica' or 'examen'
    timerInterval: null,
    startTime: null,
    userAnswers: [], // Store user answers for review
};

export const els = {
    get current() { return document.getElementById('current'); },
    get total() { return document.getElementById('total'); },
    get accuracy() { return document.getElementById('accuracy'); },
    get scoreContainer() { return document.getElementById('scoreContainer'); },
    get question() { return document.getElementById('question'); },
    get options() { return document.getElementById('options'); },
    get feedback() { return document.getElementById('feedback'); },
    get nextBtn() { return document.getElementById('nextBtn'); },
    get checkBtn() { return document.getElementById('checkBtn'); },
    get resetBtn() { return document.getElementById('resetBtn'); },
    get final() { return document.getElementById('final'); },
    get finalScore() { return document.getElementById('finalScore'); },
    get finalTotal() { return document.getElementById('finalTotal'); },
    get restartBtn() { return document.getElementById('restartBtn'); },
    get card() { return document.getElementById('card'); },
    get progressBar() { return document.getElementById('progressBar'); },
    get examTitle() { return document.getElementById('examTitle'); },
    get examSubtitle() { return document.getElementById('examSubtitle'); },
    get modeSwitch() { return document.getElementById('modeSwitch'); },
    get timer() { return document.getElementById('timer'); },
    get timeDisplay() { return document.getElementById('timeDisplay'); },
    get reviewBtn() { return document.getElementById('reviewBtn'); },
};
