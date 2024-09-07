// https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple

async function loadQuestions() {
    const APIUrl = 'https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple'
    const response = await fetch(APIUrl);
    const data = await response.json();
    return data.results;
}

//global variables  
const queElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
let score = 0;
let currentQuestionIndex = 0;
let questions = [];

// main function
async function main() {
    const dataFromAPI = await loadQuestions();

    function generateQuestions(){
        //fetching answers data of api in a unshuffaled array
        for (let i = 0; i < dataFromAPI.length; i++) {
            const uAnswersArray = [
                {
                    text: dataFromAPI[i].incorrect_answers[0],
                    isCorrect: "false"
                },
                {
                    text: dataFromAPI[i].incorrect_answers[1],
                    isCorrect: "false"
                },
                {
                    text: dataFromAPI[i].incorrect_answers[2],
                    isCorrect: "false"
                },
                {
                    text: dataFromAPI[i].correct_answer, // note: correct_answer, not correct_answers
                    isCorrect: "true"
                }
            ]

            const shuffledAnswers = uAnswersArray.sort(() => Math.random() - 0.5);

            questions.push({
                question : dataFromAPI[i].question,
                answers: shuffledAnswers
            })
        }
        console.log(questions.length)
        showQuestion();
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "next";
        generateQuestions();
    }

    function showQuestion() {
        resetState()
        let currentQuestion = questions[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1
        queElement.innerText = questionNo + ". " + currentQuestion.question;

        currentQuestion.answers.forEach(answer => {
            let button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");
            answerButton.appendChild(button);
            if (answer.isCorrect) {
                button.dataset.correct = answer.isCorrect;
            }
            button.addEventListener("click", checkAnswer);
        });
    }

    function resetState() {
        while (answerButton.firstChild) {
            answerButton.removeChild(answerButton.firstChild);
        }
    }

    function checkAnswer(e) {
        const selectedBtn = e.target;
        const correct = selectedBtn.dataset.correct === "true";
        if (correct) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }

        Array.from(answerButton.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        })
        nextButton.style.display = "block"
    }

    function showScore() {
        resetState();
        queElement.innerHTML = ` You scored ${score} out of ${5}!`;
        nextButton.innerHTML = " Restart Quiz";
        nextButton.style.display = "block";
        nextButton.addEventListener('click', () => {
            let currentQuestionIndex = 0;
            let score = 0;
            location.reload();
            startQuiz();
        })
    }

    function handleNextButton() {

        if (currentQuestionIndex === 4) {
            showScore();
        } else {
            console.log(`index:${currentQuestionIndex} \n length: ${5}`)
            currentQuestionIndex++
            showQuestion();
        }
    }

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < 5) {
            handleNextButton();
        } else {
            startQuiz()
        }
    })
    startQuiz();
}

main();