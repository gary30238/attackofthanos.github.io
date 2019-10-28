function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//遊戲讀取
$(function () {
    var screen = $("#screen"),
        player = $("#player"),
        moveDist = 125,
        enemySpeed = 6,
        enemyMaxSpeed = 18,
        enemyWave = 0, //敵人波數
        enemyWaveGap = 300, //敵人間距
        hitDist = 40,
        ctrlPlayer = true,
        score = 0;

    $(document).bind("contextmenu", function (e) {
        return false;
    });

    //遊戲初始畫面
    function init() {
        screen.append(`<div id='initScreen'>
        <iframe src='../AttackOfThanos/wav/changePreset.mp3' height='0' width='0'></iframe>
        <video id='initVolume' src='../AttackOfThanos/wav/infinityWar.mp3' autoplay loop></video>
        <img id='startBtn' class='animated pulse infinite' src='../AttackOfThanos/img/start.png' />
        <div>
        <img class='groot' id='groot' src='../AttackOfThanos/img/groot.gif'>
        <img class='volume' id='off' src='../AttackOfThanos/img/volumeWOff.png' style='visibility: hidden;'>
        <img class='volume' id='on' src='../AttackOfThanos/img/volumeWOn.png' style='visibility: visible;'>
        </div>
        <p>操作方法：滑鼠左右鍵</p>
        </div > `);
        initScreen = $("#initScreen");
        startBtn = $("#startBtn");
        $("#groot").click(function () {
            if ($("#on").css("visibility") == "visible") {
                $("#on").css("visibility", "hidden");
                $("#off").css("visibility", "visible");
                $('#initVolume').get(0).muted = true;
            }
            else {
                $("#on").css("visibility", "visible");
                $("#off").css("visibility", "hidden");
                $('#initVolume').get(0).muted = false;
            }
        });
        // $("#off").click(function () {
        //     $("#on").css("visibility", "visible");
        //     $("#off").css("visibility", "hidden");
        //     $('#initVolume').get(0).muted = false;
        // });
        // $("#on").click(function () {
        //     $("#off").css("visibility", "visible");
        //     $("#on").css("visibility", "hidden");
        //     $('#initVolume').get(0).muted = true;
        // });
        startBtn.click(function () {
            initScreen.unbind("click");
            initScreen.remove();
            startGame();
        })
    }

    init();

    //開始遊戲
    function startGame() {
        //重置變數
        enemySpeed = 3,
            enemyWave = 0,
            ctrlPlayer = true,
            score = 0;

        //開始位置
        player.css("left", (screen.width() - player.width()) / 2 + moveDist + "px");
        player.css("top", (screen.height() - player.height()) + "px");

        //音樂
        screen.append(`<div id='sound'>
        <video id='gameVolume' src='../AttackOfThanos/wav/infinity.mp3' autoplay loop></video>
        <video id='thanosVolume' src='../AttackOfThanos/wav/thanos.mp3'></video>
        </div>`);

        speedUp = setInterval(speedUpFun, 1000);
        loop = setInterval(loopFun, 1000 / 60);

        //生成敵人
        createEnemy();
    }

    //左鍵
    screen.click(function () {
        $('#thanosVolume').get(0).play();
        if (ctrlPlayer) {
            var x = parseInt(player.css("left"));
            if (x > 30) {
                player.css("left", x - moveDist + "px");
            }
        }
    });

    //右鍵
    screen.contextmenu(function () {
        $('#thanosVolume').get(0).play();
        if (ctrlPlayer) {
            var x = parseInt(player.css("left"));
            if (x < 270) {
                player.css("left", x + moveDist + "px");
            }
        }
    });

    //生成敵人
    function createEnemy() {
        var enemyPos = [25, 150, 275];
        for (var i = 0; i < 2; i++) {
            var imgnumber = Math.floor(Math.random() * 9) + 2;
            screen.append(`<div id='enemy' class='species enemy'>
            <img src='../AttackOfThanos/img/${imgnumber}.png'/></div>`);
            var enemy = screen.find(".enemy:last");
            var rnd = getRndInt(0, enemyPos.length - 1);
            var enemyStartPos = enemyPos.splice(rnd, 1)[0];
            enemy.data("wave", enemyWave);
            enemy.css("left", enemyStartPos + "px");
        }
    }

    //遊戲結束
    function endGame() {
        ctrlPlayer = false;
        clearInterval(loop);
        clearInterval(speedUp);
        screen.append(`<div id='gameOver'>
        Game Over
        <video id='endVolume' src='../AttackOfThanos/wav/end.mp3' autoplay loop >
        </div>`);
        var gameOver = $("#gameOver");
        gameOver.click(function () {
            gameOver.unbind("click");
            gameOver.remove();
            screen.find(".enemy").remove();
            init();
        });
    }

    //敵人下落&碰撞
    function loopFun() {
        screen.find(".enemy").each(function () {
            var enemyY = parseInt($(this).css("top"));
            if (enemyY > enemyWaveGap && $(this).data("wave") == enemyWave) {
                enemyWave++;
                createEnemy();
            }
            var pX = parseInt(player.css("left")) + player.width() / 2;
            var pY = parseInt(player.css("top")) + player.height() / 2;
            var eX = parseInt($(this).css("left")) + player.width() / 2;
            var eY = parseInt($(this).css("top")) + player.height() / 2;
            var peDist = Math.sqrt(Math.pow(pX - eX, 2) + Math.pow(pY - eY, 2));
            if (hitDist * 2 > peDist) {
                endGame();
                screen.find("#sound").remove();
            }

            if (enemyY > screen.height()) {
                $(this).remove();
                return;
            }

            $(this).css("top", enemyY + enemySpeed + "px");
            $("#score").html(score);
            score += 10;
            score = parseInt(score);
        })
    }

    //每秒加速度
    function speedUpFun() {
        if (enemySpeed >= enemyMaxSpeed) {
            clearInterval(speedUp);
        }
        console.log(enemySpeed);
        enemySpeed += 0.5;
        score += 0.1;
    }
})