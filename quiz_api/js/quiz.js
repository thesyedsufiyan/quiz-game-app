let goodNumber,
    correctNumber = (localStorage.getItem('savingCorrect') ? localStorage.getItem('savingCorrect') : 0); 
    
    wrongNumber = (localStorage.getItem('savingIncorrect') ? localStorage.getItem('savingIncorrect') : 0); 

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();

    eventListener();
    
});

eventListener = () => {
    document.querySelector('#check-answer').addEventListener('click', validateAnswer);
    document.querySelector('#clear-storage').addEventListener('click', clearResults)
}

loadQuestion = () =>{
    const url = 'https://opentdb.com/api.php?amount=1&category=18&difficulty=easy';
    fetch(url)
        .then(data => data.json())
        .then(result => displayQuestion(result.results));
        
}

//display question from api 

displayQuestion = questions => {
   const questionHTML = document.createElement('div');

   questionHTML.classList.add('col-12')
    
   questions.forEach(question =>{
       
      
        goodNumber = question.correct_answer;

        let possibleAnswers = question.incorrect_answers;
        possibleAnswers.splice(Math.floor(Math.random() * 3), 0, goodNumber);

        // add html for current question
        questionHTML.innerHTML = `
        <div class ="row justify-content-between heading">
        <p class= "category">Category: ${question.category}</p>
        <div class = 'totals'>
        
        <span class="badge badge-success">${correctNumber}</span> 
        <span class="badge badge-danger">${wrongNumber}</span> 

        </div>
        </div>

        <h2 class = "text-center">${question.question}
        `;


       // generate html for possible answers
       const answerDiv = document.createElement('div');
       answerDiv.classList.add('questions', 'row', 'justify-content-around', 'mt-4');

       possibleAnswers.forEach(answer => {
          const answerHTML = document.createElement('li');
          answerHTML.classList.add('col-12', 'col-md-5');
          // attach event when answer clicked

          answerHTML.onclick = answerClicked;

        answerHTML.textContent = answer;
        answerDiv.appendChild(answerHTML);

          
       });
       questionHTML.appendChild(answerDiv);

       // render in  html
       document.querySelector("#app").appendChild(questionHTML);
        
   })
}

answerClicked=(e) =>{
   
    if(document.querySelector('.active')){
        let answerSelect = document.querySelector('.active');
        answerSelect.classList.remove('active');

    }

   e.target.classList.add('active'); 
}

//  checks if answer is correct

validateAnswer = () => {
   if(document.querySelector('.questions .active')){
       // fine, check for answer
       checkAnswer();
   } else {
       // error
       const errorDiv = document.createElement('div');
       errorDiv.classList.add('alert', 'alert-danger', 'col-md-6');
        errorDiv.textContent = 'Please select 1 answer';
        // div to insert alert
        const questionsDiv = document.querySelector('.questions');
       questionsDiv.appendChild(errorDiv);

       // remove error
       setTimeout(() => {
        document.querySelector('.alert-danger').remove();
       }, 3000)
   }
}

checkAnswer =() => {
   const checkAnswerBtn= document.querySelector('.questions .active')
    
    if(checkAnswerBtn.textContent === goodNumber){
        correctNumber++;
        
    } else {
        wrongNumber++;
        
    }

    savingAnswers();
    
    const app = document.querySelector('#app');
    while(app.firstChild){
        app.removeChild(app.firstChild);
    }

    loadQuestion();
}

savingAnswers = () => {
    localStorage.setItem('savingCorrect', correctNumber);
    localStorage.setItem('savingIncorrect', wrongNumber);

}

clearResults = () => {
    localStorage.setItem('savingCorrect', 0);
    localStorage.setItem('savingIncorrect', 0);

    setTimeout(() => {
        window.location.reload();
    }, 500);


}

