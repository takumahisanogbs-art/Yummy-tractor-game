// =====================================
// Season Tractor Adventure
// Main Game Script (Part 1)
// =====================================



// -----------------------------
// Game Variables
// -----------------------------


let selectedSeason = null;

let selectedDifficulty = null;

let currentQuestion = 0;

let score = 0;

let currentQuiz = [];

const questionsPerGame = 5;

const difficultyAssignments = {
    spring: {
        easy: ["Tomato", "Sweet Corn", "Peas", "Zucchini", "Lettuce", "Garlic", "Green Beans", "Carrots", "Potatoes", "Spinach", "Cucumber", "Cherries", "Melon", "Mango", "Banana", "Apples", "Lemons", "Broccoli", "Mandarins", "Oranges", "Strawberry"],
        medium: ["Watercress", "Shallot", "Spring Onion", "Mushrooms", "Cauliflower", "Silverbeet", "Blackberry", "Passionfruit", "Rockmelon", "Pineapple", "Avocado", "Grapefruit", "Blueberry", "Broad Beans", "Asparagus", "Beetroot"]
    },
    summer: {
        easy: ["Blackberry", "Blueberry", "Berries", "Plums", "Peach", "Limes", "Raspberry", "Grapes", "Apricot", "Potato", "Tomato", "Zucchini", "Sweet Corn", "Peas", "Lettuce", "Cucumber", "Celery", "Green Beans", "Capsicum", "Eggplant", "Avocado"],
        medium: ["Passion Fruit", "Nectarines", "Lychees", "Figs", "Okra", "Sweet Onion", "Watercress", "Green Onion", "Asparagus", "Squash", "Sugar Snap Peas", "Radish", "Butter Bean"]
    },
    autumn: {
        easy: ["Pear", "Orange", "Banana", "Mandarins", "Kiwifruit", "Apple", "Lemon", "Lettuce", "Cucumber", "Celery", "Carrot", "Cabbage", "Cauliflower", "Onion", "Potato", "Tomato", "Zucchini", "Sweet Corn", "Pumpkin", "Mushrooms", "Broccoli", "Beans", "Capsicum", "Eggplant"],
        medium: ["Nashi", "Persimmon", "Figs", "Grapes", "Lime", "Plums", "Passion Fruit", "Avocado", "Guava", "Quince", "Pomegranate", "Rhubarb", "Brussels Sprouts", "Asian Greens", "Ginger", "Chestnut", "Okra", "Leek", "Fennel", "Turnip", "Sweet Potato", "Spinach", "Silverbeet"]
    },
    winter: {
        easy: ["Apple", "Avocado", "Banana", "Beetroot", "Broccoli", "Brussels Sprout", "Cabbage", "Carrot", "Cauliflower", "Celery", "Grapefruit", "Sweet Potato", "Lemon", "Mandarin", "Onion", "Pear", "Potato", "Pumpkin", "Orange", "Spinach", "Strawberry", "Turnip"],
        medium: ["Leeks", "Artichoke", "Custard Apple", "Fennel", "Kiwi", "Nashi", "Okra", "Olives", "Parsnip", "Passion Fruit", "Pomelo", "Quince", "Rhubarb", "Silverbeet", "Swede", "Tangelos"]
    }
};

function getFoodDifficulty(food, season){
    const assignments = difficultyAssignments[season];
    if(assignments.easy.includes(food.name)) return "easy";
    if(assignments.medium.includes(food.name)) return "medium";
    return "hard";
}

const seasonQuestionPrompts = {
    spring: [
        "Which food belongs to spring?",
        "Which of these foods is in season during spring?",
        "What might you harvest in spring?",
        "Which food is a springtime pick?",
        "Can you spot the spring food?"
    ],
    summer: [
        "Which food belongs to summer?",
        "Which of these foods is in season during summer?",
        "What might you harvest in summer?",
        "Which food is a summertime pick?",
        "Can you spot the summer food?"
    ],
    autumn: [
        "Which food belongs to autumn?",
        "Which of these foods is in season during autumn?",
        "What might you harvest in autumn?",
        "Which food is an autumn pick?",
        "Can you spot the autumn food?"
    ],
    winter: [
        "Which food belongs to winter?",
        "Which of these foods is in season during winter?",
        "What might you harvest in winter?",
        "Which food is a wintertime pick?",
        "Can you spot the winter food?"
    ]
};

function shuffle(items){
    const copy = [...items];
    for(let i = copy.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildLittleClue(grows){
    const description = (grows || "").toLowerCase();

    if(description.includes("underground") || description.includes("below the ground") || description.includes("in the ground")){
        return "Look for something that grows below the ground.";
    }
    if(description.includes("tree")){
        return "Look for something that grows on a tree.";
    }
    if(description.includes("vine")){
        return "Look for something that grows on a vine.";
    }
    if(description.includes("bush") || description.includes("shrub")){
        return "Look for something that grows on a bush.";
    }
    if(description.includes("pod")){
        return "Look for something that can grow inside a pod.";
    }
    if(description.includes("leaf") || description.includes("leaves") || description.includes("stalk")){
        return "Look for a food with edible leaves or stalks.";
    }
    if(description.includes("water")){
        return "Look for something that grows in or near water.";
    }
    if(description.includes("above the ground") || description.includes("plant")){
        return "Look for something that grows above the ground.";
    }

    return "Think about where and how each food grows.";
}

function buildFoodQuiz(foods, season, difficulty){
    const eligibleFoods = foods.filter(food =>
        getFoodDifficulty(food, season) === difficulty
    );
    const selectedFoods = [];
    const usedGroups = new Set();

    const seasonalNames = new Set(
        foods.map(food => food.name.toLowerCase())
    );

    const otherSeasonFoods = Object.entries(quizData)
        .filter(([otherSeason]) => otherSeason !== season)
        .flatMap(([otherSeason, otherFoods]) =>
            otherFoods.filter(food =>
                getFoodDifficulty(food, otherSeason) === difficulty
            )
        )
        .filter(food => !seasonalNames.has(food.name.toLowerCase()));

    for(const food of shuffle(eligibleFoods)){
        const group = food.group || food.name;
        if(usedGroups.has(group)) continue;
        selectedFoods.push(food);
        usedGroups.add(group);
        if(selectedFoods.length === questionsPerGame) break;
    }

    return selectedFoods.map(food => {
        const distractors = [];
        const usedDistractorNames = new Set([food.name]);
        const usedDistractorGroups = new Set([food.group || food.name]);

        for(const candidate of shuffle(otherSeasonFoods)){
            const candidateGroup = candidate.group || candidate.name;
            if(usedDistractorNames.has(candidate.name) || usedDistractorGroups.has(candidateGroup)) continue;
            distractors.push(candidate);
            usedDistractorNames.add(candidate.name);
            usedDistractorGroups.add(candidateGroup);
            if(distractors.length === 3) break;
        }

        return {
            question: shuffle(seasonQuestionPrompts[season])[0],
            clue: `LITTLE CLUE: ${buildLittleClue(food.grows)}`,
            answers: [food.name, ...distractors.map(item => item.name)],
            correct: 0,
            hint: `BIG HINT: It starts with “${food.name.charAt(0).toUpperCase()}”. ${food.clue}`,
            cardImage: food.image,
            cardName: food.name,
            origin: food.origin,
            grows: food.grows
        };
    });
}




// -----------------------------
// DOM Elements
// -----------------------------


const titleScreen =
document.getElementById("title-screen");


const gameScreen =
document.getElementById("game-screen");


const finishScreen =
document.getElementById("finish-screen");



const tractorCards =
document.querySelectorAll(".tractor-card");

const difficultyModal =
document.getElementById("difficulty-modal");

const difficultyOptions =
document.querySelectorAll(".difficulty-option");

const difficultyClose =
document.getElementById("difficulty-close");

const difficultySeasonLabel =
document.getElementById("difficulty-season-label");

function openDifficultyModal(){
    difficultySeasonLabel.textContent =
    `${selectedSeason.toUpperCase()} ADVENTURE`;
    difficultyModal.hidden = false;
    document.body.classList.add("modal-open");
    difficultyOptions[0].focus();
}

function closeDifficultyModal(){
    difficultyModal.hidden = true;
    document.body.classList.remove("modal-open");
}



const startButton =
document.getElementById("start-button");


const tractor =
document.getElementById("tractor");



const questionText =
document.getElementById("question-text");

const questionClue =
document.getElementById("question-clue");


const answerButtons =
document.querySelectorAll(".answer");



const quizBox =
document.getElementById("quiz-box");

const gameIntro =
document.getElementById("game-intro");

const answerButtonsArea =
document.getElementById("answer-buttons");

const questionProgress =
document.getElementById("question-progress");

const questionProgressLabel =
document.getElementById("question-progress-label");

const questionProgressDots =
document.getElementById("question-progress-dots");

function updateQuestionProgress(){
    const totalQuestions = currentQuiz.length || questionsPerGame;

    questionProgressLabel.textContent =
    `${selectedSeason.toUpperCase()} · ${selectedDifficulty.toUpperCase()} — QUESTION ${currentQuestion + 1} / ${totalQuestions}`;

    questionProgressDots.replaceChildren();

    for(let index = 0; index < totalQuestions; index++){
        const dot = document.createElement("span");
        dot.className = "question-progress-dot";

        if(index < currentQuestion){
            dot.classList.add("complete");
        }
        else if(index === currentQuestion){
            dot.classList.add("current");
        }

        questionProgressDots.appendChild(dot);
    }
}



const yummieMessage =
document.getElementById("yummie-message");


const hintButton =
document.getElementById("hint-button");

const nextButton =
document.getElementById("next-button");

const backToMenuButton =
document.getElementById("back-to-menu-button");

backToMenuButton.addEventListener("click", () => {
    stopTimer();
    document.body.className = "";
    document.getElementById("failure-box").style.display = "none";
    document.getElementById("success-box").style.display = "none";
    quizBox.style.display = "none";
    gameScreen.classList.remove("active");
    finishScreen.classList.remove("active");
    titleScreen.classList.add("active");
    currentQuestion = 0;
    score = 0;
    currentQuiz = [];
    selectedSeason = null;
    selectedDifficulty = null;
    closeDifficultyModal();
    difficultyOptions.forEach(item => item.classList.remove("selected"));
    tractorCards.forEach(card => {
        card.classList.remove("selected");
        card.setAttribute("aria-pressed", "false");
    });
    startButton.disabled = true;
    startButton.textContent = "CHOOSE A SEASON";
});







// -----------------------------
// Choose Tractor
// -----------------------------


tractorCards.forEach(card => {


    card.addEventListener(
        "click",
        () => {


            selectedSeason =
            card.dataset.season;

if(selectedSeason === "spring"){

    tractor.src =
    "assets/tractors/spring-drive.png";

}


else if(selectedSeason === "summer"){

    tractor.src =
    "assets/tractors/summer-drive.png";

}


else if(selectedSeason === "autumn"){

    tractor.src =
    "assets/tractors/autumn-drive.png";

}


else if(selectedSeason === "winter"){

    tractor.src =
    "assets/tractors/winter-drive.png";

}



            tractorCards.forEach(c => {

                c.classList.remove("selected");
                c.setAttribute("aria-pressed", "false");

            });



            card.classList.add("selected");
            card.setAttribute("aria-pressed", "true");
            selectedDifficulty = null;
            difficultyOptions.forEach(item => item.classList.remove("selected"));
            startButton.disabled = true;
            startButton.textContent = "CHOOSE A LEVEL";
            openDifficultyModal();



        }
    );


});






difficultyOptions.forEach(option => {
    option.addEventListener("click", () => {
        selectedDifficulty = option.dataset.difficulty;
        difficultyOptions.forEach(item => item.classList.remove("selected"));
        option.classList.add("selected");
        closeDifficultyModal();
        startButton.disabled = false;
        startButton.textContent =
        `START ${selectedSeason.toUpperCase()} · ${selectedDifficulty.toUpperCase()}`;
        startButton.focus();
    });
});

difficultyClose.addEventListener("click", closeDifficultyModal);

difficultyModal.addEventListener("click", event => {
    if(event.target.dataset.closeDifficulty === "true") closeDifficultyModal();
});

document.addEventListener("keydown", event => {
    if(event.key === "Escape" && !difficultyModal.hidden) closeDifficultyModal();
});

// -----------------------------
// Start Game
// -----------------------------


startButton.addEventListener(
"click",
()=>{
    if(!selectedSeason || !selectedDifficulty){

        alert(
        "Please choose a season and level first!"
        );

        return;

    }

    startTimer();



    titleScreen.classList.remove(
        "active"
    );


    gameScreen.classList.add(
        "active"
    );



    currentQuestion = 0;

    score = 0;



    currentQuiz = (selectedSeason === "spring" || selectedSeason === "summer" || selectedSeason === "autumn" || selectedSeason === "winter")
        ? buildFoodQuiz(quizData[selectedSeason], selectedSeason, selectedDifficulty)
        : shuffle(quizData[selectedSeason]).slice(0, questionsPerGame);


    gameIntro.style.display = "block";
    questionProgress.style.display = "none";
    questionText.style.display = "none";
    questionClue.style.display = "none";
    answerButtonsArea.style.display = "none";
    quizBox.style.display = "block";



    startDriving();



}

);

// -----------------------------
// Timer
// -----------------------------


let timerSeconds = 0;
let timerInterval = null;


/* タイマースタート */

function startTimer(){

    timerSeconds = 0;

    clearInterval(timerInterval);

    document.getElementById("timer").textContent =
    "Time: 0s";


    timerInterval = setInterval(function(){

timerSeconds++;




        document.getElementById("timer").textContent =
        "Time: " + timerSeconds + "s";

    },1000);

}



/* タイマーストップ */

function stopTimer(){

    clearInterval(timerInterval);

}



// -----------------------------
// Tractor Movement
// -----------------------------


function startDriving(){


    tractor.style.bottom =
    "1px";


animateRoad();
    


    setTimeout(
        ()=>{

            showQuestion();

        },

        3000

    );


}








// -----------------------------
// Show Question
// -----------------------------


function showQuestion(){

    const quiz = currentQuiz[currentQuestion];

    if(!quiz){
        finishGame();
        return;
    }

    gameIntro.style.display = "none";
    questionProgress.style.display = "flex";
    updateQuestionProgress();
    questionText.style.display = "block";
    answerButtonsArea.style.display = "grid";


    questionText.textContent =
    quiz.question;

    questionClue.textContent =
    quiz.clue || "";

    questionClue.style.display =
    quiz.clue ? "block" : "none";

    yummieMessage.textContent =
    "Need more help? I have a big hint!";

    yummieMessage.style.display =
    "block";


    // 答えと元の番号をセット
    const shuffledAnswers =
    quiz.answers.map((answer,index)=>{

        return {
            text:answer,
            index:index
        };

    });


    // シャッフル
    shuffledAnswers.sort(
        ()=>Math.random()-0.5
    );



    answerButtons.forEach(
        (button,index)=>{


            button.textContent =
            shuffledAnswers[index].text;


            button.onclick =
            ()=>{

                checkAnswer(
                    shuffledAnswers[index].index
                );

            };

        }
    );


    quizBox.style.display="block";

}





// -----------------------------
// Check Answer
// -----------------------------


function checkAnswer(selected){



    const quiz =
    currentQuiz[currentQuestion];



    if(selected === quiz.correct){


        correctAnswer();



    }

    else{


        wrongAnswer();



    }



}







// -----------------------------
// Correct Answer
// -----------------------------


function correctAnswer(){



    score++;



    quizBox.style.display =
    "none";



    showSuccess();



}






function showSuccess(){


    const success =
    document.getElementById(
        "success-box"
    );



    const quiz = currentQuiz[currentQuestion];
    const cardLayout = success.querySelector(".food-card-layout");

    if(quiz.cardImage){
        document.getElementById("food-card-image").src = quiz.cardImage;
        document.getElementById("food-card-image").alt = `${quiz.cardName} card`;
        document.getElementById("food-card-name").textContent = quiz.cardName;
        document.getElementById("food-origin").textContent = quiz.origin;
        document.getElementById("food-growing-place").textContent = quiz.grows;
        cardLayout.style.display = "grid";
    }
    else{
        cardLayout.style.display = "none";
    }

    success.style.display = "block";


}

nextButton.addEventListener("click", ()=>{
    document.getElementById("success-box").style.display = "none";
    currentQuestion++;

    if(currentQuestion >= currentQuiz.length){
        finishGame();
    }
    else{
        startDriving();
    }
});

tractorCards.forEach(card => {
    card.addEventListener("keydown", event => {
        if(event.key === "Enter" || event.key === " "){
            event.preventDefault();
            card.click();
        }
    });
});








// -----------------------------
// Hint System
// -----------------------------


hintButton.addEventListener(
"click",
()=>{


    const quiz =
    currentQuiz[currentQuestion];



    yummieMessage.textContent =
    quiz.hint;



    yummieMessage.style.display =
    "block";



}

);
// =====================================
// Season Tractor Adventure
// Main Game Script (Part 2)
// =====================================



// -----------------------------
// Wrong Answer Event
// -----------------------------


function wrongAnswer(){


    quizBox.style.display =
    "none";


    const failure =
    document.getElementById(
        "failure-box"
    );


    const title =
    document.getElementById(
        "failure-title"
    );


    const message =
    document.getElementById(
        "failure-message"
    );



    if(selectedSeason === "spring"){


        title.textContent =
        "Oh no! The tractor is stuck!";


        message.textContent =
        "The tractor fell into a muddy puddle! 💦";


    }



    else if(selectedSeason === "summer"){


        title.textContent =
        "Oh no! Too Hot!";


        message.textContent =
        "The tractor ran out of fuel under the hot sun! ☀️";


    }



    else if(selectedSeason === "autumn"){


        title.textContent =
        "Oh no! Stuck in leaves!";


        message.textContent =
        "The tractor is trapped in a pile of autumn leaves! 🍂";


    }



    else if(selectedSeason === "winter"){


        title.textContent =
        "Oh no! Frozen Engine!";


        message.textContent =
        "The tractor is too cold to start! ❄️";


    }



    failure.style.display =
    "block";

document.body.classList.add(
    selectedSeason
);



}







// -----------------------------
// Retry Button
// -----------------------------


const retryButton =
document.getElementById(
    "retry-button"
);



retryButton.addEventListener(
"click",
()=>{


    const failure =
    document.getElementById(
        "failure-box"
    );


    failure.style.display =
    "none";


 // Remove season failure effect
    document.body.className = "";


    startDriving();


}

);








// -----------------------------
// Finish Game
// -----------------------------


function finishGame(){

    stopTimer();

    tractor.classList.remove("driving");


    gameScreen.classList.remove(
        "active"
    );


    finishScreen.classList.add(
        "active"
    );



}








// -----------------------------
// Restart Game
// -----------------------------


const restartButton =
document.getElementById(
    "restart-button"
);



restartButton.addEventListener(
"click",
()=>{

    stopTimer();


    finishScreen.classList.remove(
        "active"
    );


    titleScreen.classList.add(
        "active"
    );



    selectedSeason =
    null;

    selectedDifficulty =
    null;

    difficultyOptions.forEach(item => item.classList.remove("selected"));


    currentQuestion =
    0;


    score =
    0;



    tractorCards.forEach(card=>{
        card.classList.remove("selected");
        card.setAttribute("aria-pressed", "false");
    });

    startButton.disabled = true;
    startButton.textContent = "CHOOSE A SEASON";


}

);


const sceneryImages = [

"assets/scenery/Plant1.png",
"assets/scenery/Plant2.png",
"assets/scenery/Plant3.png",
"assets/scenery/Chicken.png",
"assets/scenery/Cow.png",
"assets/scenery/Horse.png",
"assets/scenery/Sheep.png"



];


function createScenery(side){

    const img=document.createElement("img");

const randomImage =
sceneryImages[
Math.floor(
Math.random()*sceneryImages.length
)
];




    img.src=randomImage;

    img.className="field-item";

//左右の畑だけに配置


  if(side==="left"){

        img.style.left =
        (Math.random()*25 + 5) + "%";

    }
    else{

        img.style.left =
        (Math.random()*25 + 70) + "%";

    }


    img.style.animationDuration =
    (5 + Math.random()*3) + "s";

    // Remove scenery after it has flowed off-screen so animals do not pile up.
    img.addEventListener("animationend", () => {
        img.remove();
    }, { once: true });


    document
    .getElementById("game-area")
    .appendChild(img);




}

// -----------------------------
// Add Driving Effect
// -----------------------------


function animateRoad(){


    const road =
    document.querySelector(
        ".road"
    );


    road.classList.add(
        "moving"
    );


}

setInterval(()=>{

    const side =
    Math.random()<0.5
    ? "left"
    : "right";

    createScenery(side);

},800);


