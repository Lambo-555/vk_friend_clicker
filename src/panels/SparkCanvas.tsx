interface ISpark {
  draw(): void;
  update(): void;
  isAlive(): boolean; // Добавляем метод isAlive
}

// Класс Canvas
export class SparkCanvas {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public width: number = 0;
  public height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.width = this.canvas.width = 800;//window.innerWidth;
    this.height = this.canvas.height = 300;//window.innerHeight;
  }

  public clearRect(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  public drawCircle(x: number, y: number, r: number, style: string): void {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI, false);
    this.context.fillStyle = style;
    this.context.fill();
  }
}

// Класс Spark
export class Spark implements ISpark {
  private posX: number;
  private posY: number;
  private velocityX: number;
  private velocityY: number;
  private radius: number;
  private canvas: SparkCanvas;
  private opacity: number = 1;
  private gravity: number = 0;

  constructor(canvas: SparkCanvas, clickX: number, clickY: number) {
    this.canvas = canvas;
    this.posX = clickX;
    this.posY = clickY;
    this.radius = Math.random() * 2 + 1; // случайный радиус от 1.5 до 3.5

    // Рассчитываем расстояние от клика до центра канваса
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distanceFromCenter = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));

    // Устанавливаем скорость в зависимости от расстояния от центра
    const speedFactor = Math.min(distanceFromCenter / 100, 2); // Ограничиваем максимальную скорость
    this.velocityX = (clickX < centerX ? -1 : 1) * ((Math.random() * 2 - 0.5) + speedFactor); // скорость влево или вправо
    this.velocityY = (clickY < centerY ? -1 : 1) * ((Math.random() * 2 - 0.5) + speedFactor); // скорость вверх или вниз
  }

  public update(): void {
    this.gravity += 0.05;
    this.posX += this.velocityX;
    this.posY += this.velocityY + this.gravity;
    this.opacity -= 0.02; // уменьшаем непрозрачность
  }

  public draw(): void {
    if (this.opacity > 0) {
      this.canvas.drawCircle(
        this.posX,
        this.posY,
        this.radius,
        `rgba(${255 - Math.random() * 75}, ${255 - Math.random() * 75}, 0, ${this.opacity})`,
      );
    }
  }

  public isAlive(): boolean {
    return this.opacity > 0;
  }
}

// Класс SparkManager
export class SparkManager {
  private sparks: ISpark[] = [];
  private canvas: SparkCanvas;

  constructor(canvas: SparkCanvas) {
    this.canvas = canvas;
    this.canvas.canvas.addEventListener('click', this.handleClick.bind(this));
  }

  private handleClick(event: MouseEvent): void {
    const rect = this.canvas.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const sparksCount = Math.round(Math.random() * 10) + 1;
    for (let i = 0; i < sparksCount; i++) {
      this.sparks.push(new Spark(this.canvas, clickX, clickY));
    }
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.canvas.clearRect();

    // Обновляем и рисуем искры
    this.sparks.forEach((spark, index) => {
      spark.update();
      spark.draw();
      if (!spark.isAlive()) {
        this.sparks.splice(index, 1); // удаляем искры, которые исчезли
      }
    });
  }
}

// Инициализация
window.onload = () => {
  const canvasElement = document.getElementById("world") as HTMLCanvasElement;
  const canvas = new SparkCanvas(canvasElement);
  const manager = new SparkManager(canvas);
  manager.animate();
};