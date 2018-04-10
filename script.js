onload = function () {
    const canvas = document.querySelector(".myCanvas");
    canvas.width = 600;
    canvas.height = 600;
    
    new Game(canvas);
};

function restartGame() {
    const canvas = document.querySelector(".myCanvas");
    new Game(canvas);
}