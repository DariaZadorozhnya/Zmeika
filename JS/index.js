const canvas = document.querySelector('.ground'),
      ctx = canvas.getContext("2d"),
      currentScore = document.querySelector('.info__current-score'),
      bestScore = document.querySelector('.info__best-score'),
      playButton = document.querySelector('.play__button'),
      mainMenu = document.querySelector('.play__menu'),
      loseMenu = document.querySelector('.lose'),
      playAgainButton = document.querySelector('.lose__button'),
      finallyScore = document.querySelector('.lose__title');
      const grid = 20; // Размер клетки
      const FPS = 13; // Частота обновления
      let playerCurrentScore = 0;
      let playerBestScore = 0;
      let interval;
      const player = {
        dx: 0, // направление движения по оси OX
        dy: -grid, // направление движения по оси OX
        currentX: (canvas.clientWidth - grid) / 2, // Координата X
        currentY: (canvas.clientHeight - grid) / 2, // Координата Y
  
        tail: [], // Хвост змейки
        tailLength: 3 // Длина хвоста змейки
        
    };
    const fruit = {
        fruitX: (canvas.clientWidth - grid) / 2,
        fruitY: (canvas.clientHeight - grid) / 2 - 100
    };
    const DrawBegin = () => {
        // очистка поля canvas
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        // обновляем надпись с текущим счётом
        currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;
        // возвращаем змейку в исходное состояние
        player.dx = 0,
            player.dy = -grid,
            player.currentX = (canvas.clientWidth - grid) / 2,
            player.currentY = (canvas.clientHeight - grid) / 2,
  
            player.tail = [],
            player.tailLength = 3
    };
    const Draw = () => {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  
        move();
    };
     
    const move = () => {
        // меняем координату в зависимости от направления движения
        player.currentX += player.dx;
        player.currentY += player.dy;

        console.log(player.currentX + " " + player.currentY)
  
        // добавляем в начало хвоста ячейку
        player.tail.unshift({
            x: player.currentX,
            y: player.currentY
        });
  
        // если длина хвоста не увеличилось, то удаяем ячейку с конца
        if (player.tail.length > player.tailLength) {
            player.tail.pop();
        }
  
        // проходим по каждому элементу хвоста и отрисовываем его
        // проверяя каждый элемент хвоста на съедание фрукта 
        // или на удар
        player.tail.forEach((cell, i) => {
            const gradient = ctx.createLinearGradient(cell.x, cell.y, cell.x + grid, cell.y + grid);
            gradient.addColorStop(0, 'green'); // Начальный цвет 
            gradient.addColorStop(1, '  white'); // Конечный цвет 
            ctx.shadowBlur = 30; // Устанавливаем радиус размытия
            ctx.shadowColor = 'rgb(241, 255, 0)'; // Цвет свечения
            ctx.fillStyle = gradient;
            ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
            eatFruit(cell.x, cell.y);
            crash(cell.x, cell.y, i);
            
        });
        
    };
  
  
    const crash = (x, y, index) => { 
        // проверяем имеют ли разные части хвоста одни и те же координаты (удар)
        for (let i = index + 1; i < player.tailLength; i++) {
            if (player.tail[i].x === x && player.tail[i].y === y) {
                // если да
                // делаем экран проигрыша видимым
                loseMenu.classList.add('inlose');
                // удаляем класс режима в игре
                playButton.classList.remove('inplay');
                // обновляем финальный счет
                finallyScore.textContent = `Ваш счёт: ${playerCurrentScore}`;
                // по необходимости обновляем рекорд
                if (playerCurrentScore > playerBestScore) {
                    playerBestScore = playerCurrentScore;
                }
                bestScore.textContent = `Ваш рекорд: ${playerBestScore}`;
                playerCurrentScore = 0;
                
                var audio = document.getElementById("play-music");
                audio.pause();
                audio.currentTime = 0;

                Start();
            }
        } 
       
    }; 
  
  
  
    const eatFruit = (x, y) => {
        if (x === fruit.fruitX && y === fruit.fruitY) {
            player.tailLength++;
            playerCurrentScore += 10;
            currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;
  
            fruit.fruitX = getRandomInt(1, canvas.clientWidth / grid - 1) * grid;
            fruit.fruitY = getRandomInt(1, canvas.clientHeight / grid - 1) * grid;

            fruit.fruitX -= grid/2;
            fruit.fruitY -= grid/2;
        }
  
        drawFruit();
    };
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    const drawFruit = () => {
        ctx.fillStyle = 'rgb(255, 255, 255)'; 
        ctx.fillRect(fruit.fruitX, fruit.fruitY, grid, grid);
    }
    const Start = () => {
        if (playButton.classList.contains('inplay') &&  !loseMenu.classList.contains('inlose')) {
            DrawBegin();
            interval = setInterval(Update, 1000 / FPS);
        } else {
            DrawBegin();
            clearInterval(interval);
       }
   };
  
    function Update() {
        Draw();
        teleport();
    };
    
    const teleport = () => {
      if (player.currentX < 0 && player.dx === -grid) {
          player.currentX = canvas.clientWidth-grid/2;
      } else if (player.currentX > canvas.clientWidth - grid && player.dx === grid) {
          player.currentX = -grid/2;
      }
  
      if (player.currentY < 0 && player.dy === -grid) {
          player.currentY = canvas.clientHeight-grid/2;
      } else if (player.currentY > canvas.clientHeight - grid && player.dy === grid) {
          player.currentY = -grid/2;
      }

      if (player.currentX === -grid && player.dx === 0) {
          player.currentX = 0;
      }

      if (player.currentX === canvas.clientWidth && player.dx === 0) {
          player.currentX = canvas.clientWidth - grid;
      }

      if (player.currentY === -grid && player.dy === 0) {
          player.currentY = 0;
      }

      if (player.currentY === canvas.clientHeight && player.dy === 0) {
          player.currentY = 0;
      }
  };

  const isOneAxisSameAndAnotherOrdered = (eqaualsAxis, orderedByAxis, isIncreasing) =>{
    const firstAxisValue = player.tail[0][eqaualsAxis];
    if(player.tail.every(t => t[eqaualsAxis] === firstAxisValue)){
        let isOrdered = true;
        for(let i = 0; i < player.tail.length - 1; i++)
            if((isIncreasing && player.tail[i][orderedByAxis] > player.tail[i+1][orderedByAxis])
             || (!isIncreasing && player.tail[i][orderedByAxis] < player.tail[i+1][orderedByAxis])){
                isOrdered = false;
            }

        return isOrdered;
    }

    return false;
  }

    const changeDirection = key => {
        switch (key) {
            case 'KeyW':
                if(isOneAxisSameAndAnotherOrdered('x', 'y', false)){
                    break;
                }

                player.dx = 0;
                player.dy = -grid;
                break;
            case 'KeyS':
                if(isOneAxisSameAndAnotherOrdered('x', 'y', true)){
                    break;
                }
                
                player.dx = 0;
                player.dy = grid;
                break;

            case 'KeyA':
                if(isOneAxisSameAndAnotherOrdered('y', 'x', false)){
                    break;
                }

                player.dx = -grid;
                player.dy = 0;
                break;
            case 'KeyD':
                if(isOneAxisSameAndAnotherOrdered('y', 'x', true)){
                    break;
                }

                player.dx = grid;
                player.dy = 0;
                break;
        } 
    }; 
  // функция срабатывает при нажатии клавишы на клавиатуре 
  document.addEventListener('keydown', e => {
    changeDirection(e.code);
});

// функция срабатывает при загрузке документа
document.addEventListener('load', () => {
    playerCurrentScore = 0;
    playerBestScore = 0;

    playButton.classList.remove('inplay');
    mainMenu.classList.add('inplay');
    loseMenu.classList.remove('inlose');

    Start();
})

// функция срабатывает при нажатии мышкой по кнопке играть
playButton.addEventListener('click', () => {
    playButton.classList.add('inplay');
    mainMenu.classList.add('inplay');
    var audio = document.getElementById("play-music");
    audio.play();

    Start();
});

playButton.addEventListener('click', () => {
   
});

// функция срабатывает при нажатии мышкой по кнопке играть снова дашка мышка хехехе
playAgainButton.addEventListener('click', () => {
    playButton.classList.add('inplay');
    loseMenu.classList.remove('inlose');
    var audio = document.getElementById("play-music");
    audio.play();
    Start();
    
    });
