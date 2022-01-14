var app;

window.onload = function() {
  app = new window.PIXI.Application({
    width: 500,
    height: 800,
    backgroundImage: '/assets/bg.png'
  });

  $('body').append(app.view);
  loadSprites(app);
}

function setup (loader, resources) {
  const background = new window.PIXI.Sprite(resources.background.texture);
  app.stage.addChild(background);

  background.width = app.screen.width;
  background.height = app.screen.height;

  app.loader.load(pipes);
  app.loader.load(ground);
}

function loadSprites(app) {
  app.loader.add('background', 'assets/bg.png');
  app.loader.add('ground', 'assets/base.png');
  app.loader.add('pipe_bottom', 'assets/pipe_bottom.png');
  app.loader.add('pipe_top', 'assets/pipe_top.png');

  app.loader.load(setup);
}

function ground(loader, resources) {
  const ground1 = new window.PIXI.Sprite(resources.ground.texture);
  const ground2 = new window.PIXI.Sprite(resources.ground.texture);

  const SPEED = 3;
  const WIDTH = app.screen.width;

  app.stage.addChild(ground1);
  app.stage.addChild(ground2);

  ground1.width = app.screen.width;
  ground2.width = app.screen.width;
  ground1.y = app.screen.height - ground1.height;
  ground2.y = app.screen.height - ground2.height;

  ground1.x = 0;
  ground2.x = WIDTH;

  app.ticker.add(() => {
    ground1.x -= SPEED;
    ground2.x -= SPEED;

    if (ground1.x + WIDTH < 0) {
      ground1.x = ground2.x + WIDTH;
    }

    if (ground2.x + WIDTH < 0) {
      ground2.x = ground1.x + WIDTH;
    }
  })
}

function pipes (loader, resources) {
  const container = new window.PIXI.Container();
  app.stage.addChild(container);
  var pipes = [new Pipe(container, resources, app.screen.width)];

  app.ticker.add(() => {
    for (let index = 0; index < pipes.length; index++) {
      const pipe = pipes[index];
      if(pipe.x + pipe.PIPE_TOP.width < 0) {
        pipes.splice(index, 1)
      }

      if(pipe.x < 200 && pipes.length < 2) {
        pipes.push(new Pipe(container, resources, app.screen.width + pipes.length * 100));
      }

      pipe.move()
    }
  });

}

class Pipe {
  constructor (container, resources, x) {
    this.GAP = 170;
    this.SPEED = 3;
    this.PIPE_TOP = new window.PIXI.Sprite(resources.pipe_top.texture);
    this.PIPE_BOTTOM = new window.PIXI.Sprite(resources.pipe_bottom.texture);

    this.container = container;
    this.x = x;

    this.top = 0;
    this.bottom = 0;
    this.setHeight()
    this.draw()
  }

  setHeight() {
    this.height = Math.floor(Math.random() * (450 - 50 + 1)) + 50;
    this.top = this.height - this.PIPE_TOP.height
    this.bottom = this.height + this.GAP
  }

  draw() {
    this.PIPE_TOP.x = this.x;
    this.PIPE_TOP.y = this.top;
    this.PIPE_BOTTOM.x = this.x;
    this.PIPE_BOTTOM.y = this.bottom;
    this.container.addChild(this.PIPE_TOP);
    this.container.addChild(this.PIPE_BOTTOM);
  }

  move() {
    this.PIPE_TOP.x -= this.SPEED;
    this.PIPE_BOTTOM.x -= this.SPEED;
    this.x -= this.SPEED;
  }
}
