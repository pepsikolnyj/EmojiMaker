// FINAL VERSION OF EMOJI MAKER
// MADE BY YAROSLAV A.

// constants and variables we'll need through the game
const title = document.querySelector('.flashcard-title');
const bottom = document.querySelector('.bottom');
const choose = document.querySelector('.choose');

const chooseElements = document.querySelectorAll('.choose > div');

const faceParts = document.querySelectorAll('.face-part');

const layerEyes = document.querySelector("#layer-eyes");
const layerMouth = document.querySelector("#layer-mouth");

const correctWords = ["mond", "ogen", "check"];
const paths = {
    ogen : "imgs/eyes/eye",
    mond : "imgs/mouth/mouth"
}

let flag = false;
let userInput = "";
let userCombination = {
    ogen: null,
    mond: null
};

// make the div that will give us a list of face parts invisible
choose.style.display = "none";
// making the main combinations of sprites
function generateWinCombination(){
    let winCombi = {
        winMond: "",
        winOgen: ""
    };
    for (const key in winCombi) {
        winCombi[key] = Math.floor(Math.random() * 5);
    }
    return winCombi;
}

winCombi = generateWinCombination();

// paths to sprites
layerEyes.src = `${paths.ogen}${winCombi.winOgen}.svg`;
layerMouth.src = `${paths.mond}${winCombi.winMond}.svg`;

// applying the CSS for parts, could be made other way using an array of objects but I didn't thought about it
// also need to be combined with function applyMouthStyle() below
function applyEyesStyle(index){
    layerEyes.style.transform = "translateX(-50%)";
    layerEyes.style.left = "50%";
    switch(index){
        case 0 : 
            layerEyes.style.top = "28%";
            break;
        case 1 :
            layerEyes.style.top = "28%";
            layerEyes.style.left = "52%";
            break;
        case 2 :
            layerEyes.style.top = "12%";
            layerEyes.style.transform = "translate(-50%, 0) scale(1.3)";
            break;
        case 3 :
            layerEyes.style.top = "23%";
            break;
        case 4 : 
            layerEyes.style.top = "10%";
            layerEyes.style.transform = "translate(-50%, 0) scale(1.4)";
            break;
    }
}
function applyMouthStyle(index){
    switch(index){
        case 0:
            layerMouth.style.top = "35%";
            layerMouth.style.transform = "translateX(-50%) scale(2.6)";
            break;
        case 1:
            layerMouth.style.top = "35%";
            layerMouth.style.transform = "translateX(-50%) scale(2.6)";

            let svg = document.querySelector("svg");
            if(svg){
                svg.remove();
                const headForTongue = document.createElement("img");
                headForTongue.src = "imgs/misc/tongue.svg";
                headForTongue.className = "head-img";
                document.querySelector(".flashcard-center").appendChild(headForTongue);
            }
            break;

        case 2:
            layerMouth.style.top = "40%";
            layerMouth.style.transform = "translateX(-50%) scale(2.6)";
            break;

        case 3:
            layerMouth.style.top = "42%";
            layerMouth.style.transform = "translateX(-50%) scale(1.5)";
            break;

        case 4:
            layerMouth.style.top = "30%";
            layerMouth.style.transform = "translateX(-50%) scale(2.8)";
            break;
    }
}
// restarting the game IF won
function gameRestart(){
    userInput = {
        ogen: null,
        mond: null
    }

    winCombi = generateWinCombination();
    layerEyes.style.display = "block";
    layerMouth.style.display = "block";
    userInput = "";
    flag = false;

    layerEyes.src = `${paths.ogen}${winCombi.winOgen}.svg`;
    layerMouth.src = `${paths.mond}${winCombi.winMond}.svg`;

    applyEyesStyle(winCombi.winOgen);
    applyMouthStyle(winCombi.winMond);

    title.textContent = "Make a reference!";
    title.classList.remove("correct", "incorrect");
    bottom.innerHTML = "<p><i>Press Enter to begin...</i></p>";
    choose.style.display = "none";

    document.addEventListener('keydown', handleEnter);
}
// we also need to handle it as an event
function handleRestart(event) {
    if (event.key === 'Enter') {
        document.removeEventListener('keydown', handleRestart);
        gameRestart();
    }
}

//applying correct CSS to correct sprite
applyEyesStyle(winCombi.winOgen);
applyMouthStyle(winCombi.winMond);

// THE BEGIN OF THE GAME. handles the first Enter you will click
function handleEnter(event) {
    if (event.key === 'Enter') {
    faceParts.forEach(part => part.style.display = "none");
    bottom.style.display = "block";
    bottom.innerHTML = "<p><i>Try to type something with your keyboard...</i></p>";
    title.style.display = 'none';

    flag = true;

    if (flag) {
        document.removeEventListener('keydown', handleEnter);
        document.addEventListener('keydown', handleInput);
        document.addEventListener('keydown', checkWord);

        console.log("Событие Enter больше не отслеживается");
    }
}
}
// handling the main input
function handleInput(event){
    // using an regular statement to check if it's a letter or system key
    if (event.key.length === 1 && /^[a-zа-яё]$/i.test(event.key) && flag) { 
        bottom.innerHTML = "<p><i>To erase letters, use Backspace...</i></p>";
        title.style.display = 'block';
        title.style.textDecoration = 'underline';
        userInput += event.key;
        renderSpacedText(userInput);
    }
    if (event.key === 'Backspace'){
        userInput = userInput.slice(0, -1);
        renderSpacedText(userInput);
        bottom.style.display = "block";
        bottom.innerHTML = "<p><i>Try to type something with your keyboard...</i></p>";
        choose.style.display = "none";
        title.classList.remove("correct", "incorrect")
        title.classList.add("flashcard-title");
    }
}
// make the input a bit prettier
function renderSpacedText(text){
    title.innerHTML = "";

    text.split("").forEach(letter => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.marginRight = "10px";
        title.appendChild(span);
    });
}
// checkting on Enter if it's correct word
function checkWord(event){
    if (event.key === 'Enter'){

        let processedTitle = title.textContent.replace(/\s/g, "").toLowerCase();

        if(correctWords.includes(processedTitle)) {
            choose.style.display = "flex";
            title.classList.remove("incorrect")
            title.classList.add("correct");
            checkUserChoose(processedTitle);
        }
        else {
            choose.style.display = "none";
            title.classList.remove("correct")
            title.classList.add("incorrect");
        }
    } 
}
// applying sprites on the main head
function applyChoosed(type){
    removeChoiceListeners();
    chooseElements.forEach((el, index) => {
    const handler = () => {
        if (type === "ogen") {
            layerEyes.style.display = "block";
            layerEyes.src = `${paths.ogen}${index}.svg`;
            applyEyesStyle(index);
            userCombination.ogen = index;
        }
        if (type === "mond") {
            layerMouth.style.display = "block";
            layerMouth.src = `${paths.mond}${index}.svg`;
            applyMouthStyle(index);
            userCombination.mond = index;
        }
    };

    el._handler = handler;
    el.addEventListener("click", handler);
});
}
// disable listener for choose
function removeChoiceListeners() {
    chooseElements.forEach(el => {
        if (el._handler) {
            el.removeEventListener("click", el._handler);
            el._handler = null;
        }
    });
}
// checking what part of the face you chosed and if you've won the game
function checkUserChoose(processedTitle){
    if(processedTitle === "check"){
        choose.style.display = "none";
        if(userCombination.mond === winCombi.winMond && userCombination.ogen === winCombi.winOgen){
            document.removeEventListener('keydown', handleInput);
            title.textContent = "You won!";
            bottom.innerHTML = "<p><i>Hit Enter to restart!</i></p>";
            title.classList.remove("incorrect");
            title.classList.add("correct");
            document.addEventListener('keydown', handleRestart);
        } else {
            title.classList.remove("correct");
            title.classList.add("incorrect");
        }
    } else{
        choose.style.display = "flex";
        switch (processedTitle){
            case "mond":
                for(let j = 0; j < 5; j++){
                    const images = chooseElements[j].querySelector("img");
                    images.src = "imgs/mouth/mouth" + j + ".svg";
                }
                applyChoosed(processedTitle);
            break;
            case "ogen":
                for(let j = 0; j < 5; j++){
                    const images = chooseElements[j].querySelector("img");
                    images.src = "imgs/eyes/eye" + j + ".svg"; 
                }
                applyChoosed(processedTitle);
            break;
            case "choose":
                
        }
    }
}

document.addEventListener('keydown', handleEnter);