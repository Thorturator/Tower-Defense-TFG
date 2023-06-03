const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2D = [];

for (let i = 0; i < placementTilesData.length; i += 40) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 40));
}

//-----------------------------------------------------------------
//------------------Array de las casillas--------------------------
//-----------------------------------------------------------------

const placementTiles = [];

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 658) {
      // Añadimos la torreta aquí
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 32,
            y: y * 32,
          },
          width: 32,
          height: 32
        })
      );
    }
  });
});

const image = new Image();

image.onload = () => {
  animate();
};

image.src = 'img/gameMap.png';

const enemies = [];

//-----------------------------------------------------------------
//--------------Función para las oleadas de enemigos---------------
//-----------------------------------------------------------------
function spawnEnemies(spawnCount, speed) {
  for (let i = 1; i < spawnCount + 1; i++) {
    const xOffset = i * 150;
    enemies.push(
      new Enemy({
        position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
        speed: speed
      })
    );
  }
}

const buildings = [];
let activeTile = undefined;
let enemyCount = 1;
let hearts = 10;
let coins = 100;
let gameOver = false; // Agrega una variable para controlar el estado del juego
const explosions = [];
let enemiesSpeed = 3;

spawnEnemies(enemyCount, enemiesSpeed);

//-----------------------------------------------------------------
//--------------Función para animar enemigos, torretas-------------
//-----------------------------------------------------------------

function animate() {
  if (gameOver) return;
  const animationId = requestAnimationFrame(animate);

  c.drawImage(image, 0, 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();
    enemy.draw();

    
    if (enemy.position.x > canvas.width) {
      hearts -= 1;
      enemies.splice(i, 1);
      document.querySelector('#hearts').innerHTML = hearts;

      if (hearts === 0) {
        console.log('game over');
        gameOver = true; // Establece el estado de juego como terminado
        cancelAnimationFrame(animationId);
        document.querySelector('#gameOver').style.display = 'flex';
      }
    }
    
  }

  
  for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];
    explosion.draw();
    explosion.update();

    if (explosion.frames.current >= explosion.frames.max - 1) {
      explosions.splice(i, 1);
    }
  }

  //-------------Contar cuántos enemigos hay en pantalla
  console.log("Num de enemigos " + enemies.length);
  if (enemies.length === 0) {
    enemyCount += 2;
    enemiesSpeed = enemiesSpeed * 1.15;
    spawnEnemies(enemyCount, enemiesSpeed);
  }

  placementTiles.forEach((tile) => {
    tile.update(mouse, buildings);
    tile.draw();
  });

  buildings.forEach((building) => {
    building.update();
    building.draw();
    building.target = null;
    const validEnemies = enemies.filter((enemy) => {
      const xDistance = enemy.center.x - building.position.center.x;
      const yDistance = enemy.center.y - building.position.center.y;
      const distance = Math.hypot(xDistance, yDistance);
      return distance < enemy.radius + building.radius;
    });

    building.target = validEnemies[0];

    //------Calcular distancia del proyectil con el enemigo (difícil)---

    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];
      projectile.update();

      const xDistance = projectile.enemy.center.x - projectile.position.x;
      const yDistance = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDistance, yDistance);

      //------Qué ocurre cuando el proyectil impacta en el enemigo------------
      if (distance < projectile.enemy.radius + projectile.radius) {
        //-----------Eliminación de enemigo y reducción de vida
        projectile.enemy.health -= 20;
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });

          if (enemyIndex > -1) {
            enemies.splice(enemyIndex, 1);
            coins += 30;
            document.querySelector('#coins').innerHTML = coins;
          }
        }

        console.log(projectile.enemy.health);
        explosions.push(
          new Sprite({
            position: { x: projectile.position.x, y: projectile.position.y },
            imageSrc: 'img/flame_explosion.png',
            frames: { max: 7 },
            offset: { x: 0, y: 0 },
          })
        );

        building.projectiles.splice(i, 1);
      }
    }
  });
  
}

//---------------------------------------------
//----------Evento: al hacer clic---------------
//---------------------------------------------

const mouse = {
  x: undefined,
  y: undefined,
};

function existsCollision(newBuilding, buildings) {
  for (var i = 0; i < buildings.length; i++) {
    if (buildings[i].boundingBox.hasCollision(newBuilding.boundingBox)) {
      return true;
    }
  }

  return false;
}

canvas.addEventListener('click', (event) => {
  if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
    // Deteccion de que la torre entre en los limites
    // 4 ifs detectando si me paso en derecha, si me paso en izq
    // si me paso arriba en abajo
    let newBuilding = new Building({
      position: {
        x: activeTile.position.x + (activeTile.width / 2),
        y: activeTile.position.y + (activeTile.height / 2),
      },
    })

    let collision = existsCollision(newBuilding, buildings);
    if (!collision) {
      buildings.push(newBuilding);
      activeTile.isOccupied = true;
      coins -= 50;
      document.querySelector('#coins').innerHTML = coins;
    }

    buildings.sort((a, b) => {
      return a.position.y - b.position.y;
    });
  }
});

//---------------------------------------------
//----------Evento: mover el ratón---------------
//---------------------------------------------

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  activeTile = null;
  for (let i = 9; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.width &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.height
    ) {
      activeTile = tile;
      break;
    }
  }
});

animate();

