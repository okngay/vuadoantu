var score = 0;
var name = "";
var SetNum = ['Kinh chưa! ⚡', 'Quá đỉnh ✌ ', 'Thường Thôi ☕', 'Vào được BXH rồi ^^ ', 'La la la ❤', 'Sắp vô đối ✈️', 'Nhìn nè ツ ', 'Vượt qua đi ☝ ', 'Qua rồi nè ☺', 'Thường Thôi ☄ ', 'Mình sẽ nhất ➹', 'Còn cao nữa'];
var TIME_STEP = 500;
var time_left = 300000;
var fbname = "";

var questionBank = new Array;
var wordArray = new Array;
var previousGuesses = new Array;
var currentWord;
var currentClue;
var wrongAnswerCount;

var myclue;
var myword;
var nbword;









 //taotumoi();

$(document).ready(function () {
    console.log("DEV ○♥○ Firebase");

  

      taotumoi();

	  
	  
	  setTimeout(function () {
		console.log(nbword);
		if (nbword > 0 ) {
			
			titleScreen();
        $('#load').hide();
		}
		else {
			
			taotumoi();
			setTimeout(function () { titleScreen() ,  $('#load').hide() },2000)
		}
		
    }, 3333);
	  
	  
             
	 
		

    


    function titleScreen() {

        $('#gameContent').append('<div id="startButton" class="green white-text card hoverable animated bounceInDown center">   <h2><br> Bắt đầu nào !</h2><br> </div>');
        $('#startButton').on("click", function () {
            gameScreen(), facebook(), timebar() 
        });

		 
		
		
		
		
    } //display game


    function facebook() {

        if (typeof (Storage) !== "undefined") {
            if (localStorage.namefb) {
                name = localStorage.namefb;
                console.log("Chào bạn trở lại:  " + name);
                $("#fbok").text(localStorage.namefb);
            } else {


                var ref = new Firebase("https://hangman-vtc.firebaseio.com");
                ref.authWithOAuthPopup("facebook", function (error, authData) {
                    if (error) {
                        console.log("FK False!");

                    } else {

                        console.log("FB OK!");
                        $("#fbok").text(authData.facebook.displayName);
                        localStorage.namefb = authData.facebook.displayName;
                        name = authData.facebook.displayName;
                        console.log("Chào:  ", authData.facebook.displayName);

                    }
                }, {
                    remember: "sessionOnly",
                });


            }

        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
        }



    } //Facebook



    //Timer

    function timebar() {
        setInterval(check_timmer, TIME_STEP);
        setTimeout(function () {
            fbsent(), history.go(0), alert("   --      Hết giờ!!!      -- \n " + name + " : " + score + " Điểm \n Điểm của bạn đã được gửi lên BXH \n");
        }, 300500);
    }



    function gameScreen() {

        taotumoi();



        $('#space').hide();
        $('#gameContent').empty();
        $('#gameContent').append('<div id="scoreid" class="center"><h3 class="red card  white-text "> Điểm số: ' + score + '</h3></div>');
        $('#gameContent').append('<div id="pixHolder"><img id="hangman" src="https://i.imgur.com/X83etBM.png"></div>');
        $('#gameContent').append('<div id="clueHolder"></div>');
        $('#gameContent').append('<div id="wordHolder"></div>');
        $('#gameContent').append('<div id="guesses"> </div>');
        $('#gameContent').append('<div id="feedback"></div>');
        $('#gameContent').append('<div id="sentscore"></div>')


        //$('#gameContent').append('<form><input type="text" id="dummy" ></form>');

        getWord();

        var numberOfTiles = currentWord.length;
        wrongAnswerCount = 0;
        previousGuesses = [];

        console.log("Ký tự: " + numberOfTiles);

        for (i = 0; i < numberOfTiles; i++) {

            $('#wordHolder').append('<h4 class="white btn-large black-text" id=t' + i + '></h4>' + ' ');
        }

        $('#clueHolder').append("<h4 class= 'white-text'>Gợi ý: " + currentClue + "</h4>");

        $(document).on("keyup", handleKeyUp);

		
		
		
		
		  
		
    } //gamescreen




    // Timer		
    function check_timmer() {
        time_left = time_left - TIME_STEP;

        // Khi hết thời gian
        if (time_left < 0) {

            console.log(time_left);
            //Ẩn hiện các nút
            $("#bar").attr("style", "width: " + 0 + "%");


        }

        // Thanh thời gian
        $("#bar").attr("style", "width: " + (time_left / 3000) + "%");

    }







    function getWord() {

     
		 
        var rnd = Math.floor(Math.random() * nbword); // Lấy ngẫu nhiên từ mảng

        currentWord = questionBank[0];
        currentClue = questionBank[1];

        console.log("Từ: " + currentWord);
        console.log(currentClue);
        wordArray = currentWord.split("");
        console.log("rdn: " + rnd);
        console.log("Từ băm:  " + wordArray);



    } //getword


	
	
	
	function taotumoi() {

    var dataref = new Firebase("https://hangman-vtc.firebaseio.com//cauhoi//wordlist//");
    dataref.once("value", function (snapshot) {

        var sotu = snapshot.numChildren(); // lấy số lượng cột
        nbword = snapshot.numChildren();
        console.log(">" + nbword);
		
		
			
			
       var rd = Math.floor(Math.random() * nbword); 

            var tentu = snapshot.child("" + rd + "");
            var tentu = tentu.val();
            // 0 === { clue: "Ai là ai ? ", word: "latoi"}

            var clueSnap = snapshot.child(rd).child("clue");
            var myclue = clueSnap.val();

            // firstName === "Ai là ai ?"

            var wordSnap = snapshot.child(rd).child("word");
            var myword = wordSnap.val();

            // lastName === "latoi"  
            questionBank = new Array;
            questionBank[0] = myword;
            questionBank[1] = myclue;

			
			 
        
    });
 }
 

	 
	
	
	  
    
			
			
	
	
	
	
	
	
	

    function handleKeyUp(event) {
        if (event.keyCode > 64 && event.keyCode < 91) {
            var found = false;
            var previouslyEntered = false;
            var input = String.fromCharCode(event.keyCode).toLowerCase();

            for (i = 0; i < previousGuesses.length; i++) {
                if (input == previousGuesses[i]) {
                    previouslyEntered = true;
                }
            }

            if (!previouslyEntered) {
                previousGuesses.push(input);

                for (i = 0; i < wordArray.length; i++) {

                    if (input == wordArray[i]) {
                        found = true;
                        $('#t' + i).append(input);
						$('#t' + i).addClass("animated flipInX");
						
                    }

                    // ("<h4>"+input+"</h4>")
                } //for

                if (found) {
                    checkAnswer();
                } else {
                    wrongAnswer(input);
                }
            } //if
        } //if
    } //handlekeyup







    function checkAnswer() {
        var currentAnswer = "";
        for (i = 0; i < currentWord.length; i++) {
            currentAnswer += ($('#t' + i).text());
        }
        if (currentAnswer == currentWord) {
           // taotumoi(); 
             
            setTimeout(victoryMessage(), 500);
			
			
        };
    } //checkanswer

    function wrongAnswer(a) {
        wrongAnswerCount++;
        var pos = (wrongAnswerCount * -75) + "px"
        $('#guesses').append("<h4 class='red btn white-text' > " + a + "</h4>" + " ");
        $('#hangman').css("left", pos);
        if (wrongAnswerCount == 6) {
            defeatMessage();
        }
    } //wronganswer

    function victoryMessage() {
		
           // Firebase.goOnline();
        $(document).off("keyup", handleKeyUp);
		
		     score = score + 1;
            gameScreen();	
      
    } //victory

    function defeatMessage() {
        $(document).off("keyup", handleKeyUp);
        $('#sentscore').append("<div id='sentfb' class='teal card hoverable animated bounceInRight white-text center col s6'><h3>Gửi Điểm</h3> </div> ");
        $('#feedback').append("<h4 class='white-text center'>Đáp án = <mark>" + currentWord.toUpperCase() + " </mark> </h4>  <div id='replay' class='col s6 yellow card hoverable animated bounceInRight black-text center'><h3>Chơi lại</h3> </div>");
        $('#replay').on("click", function () {

             Firebase.goOffline();
			 
            history.go(0)
  

        });

        $('#sentfb').on("click", function () {
            fbsent()
        });

    } //defeat



}); //doc ready






//FIREBASE



var LEADERBOARD_SIZE = 5;

// Build some firebase references.
var rootRef = new Firebase('https://hangman-vtc.firebaseio.com/');
var scoreListRef = rootRef.child("diem");
var highestScoreRef = rootRef.child("diemcao");

// Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
var htmlForPath = {};

// Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
function handleScoreAdded(scoreSnapshot, prevScoreName) {
    var newScoreRow = $("<tr/>");
    randomname = SetNum[Math.floor(Math.random() * SetNum.length)];

    newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name + " ( " + randomname + " )")));
    newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

    // Store a reference to the table row so we can get it again later.
    htmlForPath[scoreSnapshot.key()] = newScoreRow;

    // Insert the new score in the appropriate place in the table.
    if (prevScoreName === null) {
        $("#leaderboardTable").append(newScoreRow);
    } else {
        var lowerScoreRow = htmlForPath[prevScoreName];
        lowerScoreRow.before(newScoreRow);
    }
}

// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleScoreRemoved(scoreSnapshot) {
    var removedScoreRow = htmlForPath[scoreSnapshot.key()];
    removedScoreRow.remove();
    delete htmlForPath[scoreSnapshot.key()];
}

// Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
var scoreListView = scoreListRef.limitToFirst(LEADERBOARD_SIZE);

// Add a callback to handle when a new score is added.
scoreListView.on('child_added', function (newScoreSnapshot, prevScoreName) {
    handleScoreAdded(newScoreSnapshot, prevScoreName);
});

// Add a callback to handle when a score is removed
scoreListView.on('child_removed', function (oldScoreSnapshot) {
    handleScoreRemoved(oldScoreSnapshot);
});

// Add a callback to handle when a score changes or moves positions.
var changedCallback = function (scoreSnapshot, prevScoreName) {
    handleScoreRemoved(scoreSnapshot);
    handleScoreAdded(scoreSnapshot, prevScoreName);
};
scoreListView.on('child_moved', changedCallback);
scoreListView.on('child_changed', changedCallback);

// Sent score

function fbsent() {
    Firebase.goOnline();
    if (score > 0) {
        var newScore = score;

        $("#sentscore").hide();
        if (name.length === 0)
            return;

        var userScoreRef = scoreListRef.child(name);

        // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
        userScoreRef.setWithPriority({
            name: name,
            score: newScore
        }, newScore);

        // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
        // executed on the latest data from the server, so transactions should be used if you have multiple
        // clients writing to the same data and you want to avoid conflicting changes.
        highestScoreRef.transaction(function (currentHighestScore) {
            if (currentHighestScore === null || newScore > currentHighestScore) {
                // The return value of this function gets saved to the server as the new highest score.
                return newScore;
            }
            // if we return with no arguments, it cancels the transaction.
            return;
        });
        console.log("Đã gửi " + score + " điểm lên Sao Hỏa -- ○ ○ ○ ");
        Firebase.goOffline();

    } else {
        console.log("0 Điểm gửi làm gì :v ");
        Firebase.goOffline();
        $("#sentscore").hide();

    }


}

// Add a callback to the highest score in Firebase so we can update the GUI any time it changes.
highestScoreRef.on('value', function (newHighestScore) {
    $("#highestScoreDiv").text(newHighestScore.val());
});