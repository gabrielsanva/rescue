function start() {
    $("#start").hide();
    $("#backgroundGame").append("<div id='player' class='anima1'></div>");
    $("#backgroundGame").append("<div id='enemy1' class='anima2'></div>");
    $("#backgroundGame").append("<div id='enemy2'></div>");
    $("#backgroundGame").append("<div id='friend'  class='anima3'></div>");
    $("#backgroundGame").append("<div id='scoreboard'></div>");
    $("#backgroundGame").append("<div id='energy'></div>");

    //main variables
    var energy = 3,
        points = 0,
        savedFriends = 0,
        lostFriends = 0,
        gameover = false,
        authorizedShot = true,
        game = {},
        speed = 5,
        positionY = parseInt(Math.random() * 334),
        key = { W: 87, S: 83, D: 68 };
    game.pressed = [];

    // audio elements
    var shotSound = document.getElementById("shotSound"),
        explosionSound = document.getElementById("explosionSound"),
        music = document.getElementById("music"),
        gameOverSound = document.getElementById("gameOverSound"),
        deathFriendSound = document.getElementById("deathFriendSound"),
        rescueSound = document.getElementById("rescueSound");

    //Loop music
    music.addEventListener("ended", function () { music.currentTime = 0; music.play(); }, false);
    music.play();

    //check if any keys were pressed
    $(document).keydown(function (e) {
        game.pressed[e.which] = true;
    });
    $(document).keyup(function (e) {
        game.pressed[e.which] = false;
    });

    //looped functions
    game.timer = setInterval(loop, 30);
    function loop() {
        moveBackground();
        movePlayer();
        moveEnemy1();
        moveEnemy2();
        moveFriend();
        colision();
        scoreboard();
        updateEnergy();
    }

    //animation that moves the background
    function moveBackground() {
        left = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position", left - 1);
    }

    //function that moves the player from the pressed key
    function movePlayer() {
        if (game.pressed[key.W]) {
            var topPosition = parseInt($("#player").css("top"));
            $("#player").css("top", topPosition - 10);
            if (topPosition <= 0) {
                $("#player").css("top", topPosition + 10);
            }
        }
        if (game.pressed[key.S]) {
            var topPosition = parseInt($("#player").css("top"));
            $("#player").css("top", topPosition + 10);
            if (topPosition >= 434) {
                $("#player").css("top", topPosition - 10);
            }
        }
        if (game.pressed[key.D]) {
            shot();
        }
    }

    //function that moves the enemy 1
    function moveEnemy1() {
        positionX = parseInt($("#enemy1").css("left"));
        $("#enemy1").css("left", positionX - speed);
        $("#enemy1").css("top", positionY);
        if (positionX <= 0) {
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);
        }
    }

    //function that moves the enemy 2
    function moveEnemy2() {
        positionX = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left", positionX - 3);
        if (positionX <= 0) {
            $("#enemy2").css("left", 775);
        }
    }

    //function that moves our friends
    function moveFriend() {
        positionX = parseInt($("#friend").css("left"));
        $("#friend").css("left", positionX + 1);
        if (positionX > 906) {
            $("#friend").css("left", 0);
        }
    }

    //function that executes the shot
    function shot() {
        if (authorizedShot == true) {
            authorizedShot = false;
            shotSound.play();
            topPosition = parseInt($("#player").css("top"))
            positionX = parseInt($("#player").css("left"))
            shotX = positionX + 190;
            topPositionShot = topPosition + 37;
            $("#backgroundGame").append("<div id='shot'></div");
            $("#shot").css("top", topPositionShot);
            $("#shot").css("left", shotX);
            var timeShot = window.setInterval(doShot, 30);
        }
        //function that performs moves the shot
        function doShot() {
            positionX = parseInt($("#shot").css("left"));
            $("#shot").css("left", positionX + 15);
            if (positionX > 900) {
                window.clearInterval(timeShot);
                timeShot = null;
                $("#shot").remove();
                authorizedShot = true;
            }
        }
    }

    //function that checks for collisions
    function colision() {
        var colision1 = ($("#player").collision($("#enemy1")));
        var colision2 = ($("#player").collision($("#enemy2")));
        var colision3 = ($("#shot").collision($("#enemy1")));
        var colision4 = ($("#shot").collision($("#enemy2")));
        var colision5 = ($("#player").collision($("#friend")));
        var colision6 = ($("#enemy2").collision($("#friend")));

        // player & enemy1
        if (colision1.length > 0) {
            energy--;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X, enemy1Y);
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);
        }

        // player & enemy2 
        if (colision2.length > 0) {
            energy--;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            explosion2(enemy2X, enemy2Y);
            $("#enemy2").remove();
            repositioningEnemy2();
        }

        // shot & enemy1
        if (colision3.length > 0) {
            points = points + 100;
            speed = speed + 0.3;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X, enemy1Y);
            $("#shot").css("left", 950);
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);
        }

        // shot & enemy2
        if (colision4.length > 0) {
            points = points + 50;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();
            explosion2(enemy2X, enemy2Y);
            $("#shot").css("left", 950);
            reposicionEnemy2();
        }

        // player & friend
        if (colision5.length > 0) {
            rescueSound.play();
            savedFriends++;
            repositionFriend();
            $("#friend").remove();
        }

        //enemy2 & friend
        if (colision6.length > 0) {
            deathFriendSound.play();
            lostFriends++;
            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            explosion3(friendX, friendY);
            $("#friend").remove();
            repositionFriend();
        }
    }

    //explosion 1
    function explosion1(enemy1X, enemy1Y) {
        explosionSound.play();
        $("#backgroundGame").append("<div id='explosion1'></div");
        $("#explosion1").css("background-image", "url(img/explosao.png)");
        var div = $("#explosion1");
        div.css("top", enemy1Y);
        div.css("left", enemy1X);
        div.animate({ width: 200, opacity: 0 }, "slow");
        var timeExplosion = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            div.remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;

        }
    }

    //explosion 2
    function explosion2(enemy2X, enemy2Y) {
        explosionSound.play();
        $("#backgroundGame").append("<div id='explosion2'></div");
        $("#explosion2").css("background-image", "url(img/explosao.png)");
        var div2 = $("#explosion2");
        div2.css("top", enemy2Y);
        div2.css("left", enemy2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");
        var timeExplosion2 = window.setInterval(removeExplosion2, 1000);

        function removeExplosion2() {
            div2.remove();
            window.clearInterval(timeExplosion2);
            timeExplosion2 = null;
        }
    }

    //explosion 3
    function explosion3(friendX, friendY) {
        $("#backgroundGame").append("<div id='explosion3' class='anima4'></div");
        $("#explosion3").css("top", friendY);
        $("#explosion3").css("left", friendX);
        var timeExplosion3 = window.setInterval(removeExplosion3, 1000);
        function removeExplosion3() {
            $("#explosion3").remove();
            window.clearInterval(timeExplosion3);
            timeExplosion3 = null;
        }
    }

    //reposicion enemy2
    function reposicionEnemy2() {
        var timeColision4 = window.setInterval(reposicion4, 5000);
        function reposicion4() {
            window.clearInterval(timeColision4);
            timeColision4 = null;
            if (gameover == false) {
                $("#backgroundGame").append("<div id=enemy2></div");
            }
        }
    }

    //reposicion friend
    function repositionFriend() {
        var timeFriend = window.setInterval(reposiciona6, 6000);
        function reposiciona6() {
            window.clearInterval(timeFriend);
            timeFriend = null;
            if (gameover == false) {
                $("#backgroundGame").append("<div id='friend' class='anima3'></div>");
            }
        }
    }

    // update score
    function scoreboard() {
        $("#scoreboard").html("<h2> Points: " + points + " Saved: " + savedFriends + " Lost: " + lostFriends + "</h2>");
    }

    //update energy
    function updateEnergy() {
        if (energy == 3) $("#energy").css("background-image", "url(img/energia3.png)");
        if (energy == 2) $("#energy").css("background-image", "url(img/energia2.png)");
        if (energy == 1) $("#energy").css("background-image", "url(img/energia1.png)");
        if (energy == 0) {
            $("#energy").css("background-image", "url(img/energia0.png)");
            gameOver();
        }
    }

    //game over
    function gameOver() {
        gameover = true;
        music.pause();
        gameOverSound.play();
        window.clearInterval(game.timer);
        game.timer = null;
        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();
        $("#backgroundGame").append("<div id='end'></div>");
        $("#end").html("<h1> Game Over </h1><p>Sua pontuação foi: " + points + "</p>" + "<div id='reinicia' onClick=restart()><h3>Jogar Novamente</h3></div>");
    }
}

//restart
function restart() {
    gameOverSound.pause();
    $("#end").remove();
    start();
} 