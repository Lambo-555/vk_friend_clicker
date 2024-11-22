interface ISpark {
  draw(): void;
  update(): void;
  isAlive(): boolean; // Добавляем метод isAlive
}

export class DamageText {
  private posX: number;
  private posY: number;
  private velocityY: number;
  private text: string;
  private canvas: SparkCanvas;
  private opacity: number = 1;

  constructor(canvas: SparkCanvas, clickX: number, clickY: number, damageValue: number) {
    const randomText = ['OMG', 'Ого', 'Бро', 'Круть', 'DDos', 'Сила'];
    const addText = randomText[Math.floor(randomText.length * Math.random())];
    this.canvas = canvas;
    this.posX = clickX;
    this.posY = clickY;
    this.text = `-${damageValue} ` + (Math.random() > 0.85 ? addText : '');
    this.velocityY = -1;
  }

  public update(): void {
    this.posY += this.velocityY;
    this.opacity -= 0.01; // Adjust the opacity decrement rate
  }

  public draw(): void {
    if (this.opacity > 0) {
      if (this.canvas) {
        this.canvas.context.fillStyle = `rgba(225, 205, 0, ${this.opacity})`;
        this.canvas.context.font = "bold 24px Consolas Roboto Helvetica";
        this.canvas.context.fillText(this.text, this.posX, this.posY);
      }
    }
  }

  public isAlive(): boolean {
    return this.opacity > 0;
  }
}

// Класс Canvas
export class SparkCanvas {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public width: number = 0;
  public height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d")!;
    this.width = this.canvas.width = 960 / 2; //window.innerWidth;
    this.height = this.canvas.height = 540 / 2; //window.innerHeight;
  }

  public clearRect(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  public drawImage(imageUrl: string, x: number, y: number, width: number, height: number): void {
    const img = new Image();
    img.onload = () => {
      this.context.drawImage(img, x, y, width, height);
    };
    img.src = imageUrl;
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
    this.radius = Math.random() * 4 + 1; // случайный радиус от 1.5 до 3.5

    // Рассчитываем расстояние от клика до центра канваса
    const centerX = canvas.width / 2; //canvas.width / 2;
    const centerY = canvas.height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
    );

    // Устанавливаем скорость в зависимости от расстояния от центра
    const speedFactor = Math.min(distanceFromCenter / 100, 8); // Ограничиваем максимальную скорость
    this.velocityX =
      (clickX < centerX ? -1 : 1) * (Math.random() * 4 - 0.5 + speedFactor); // скорость влево или вправо
    this.velocityY =
      (clickY < centerY ? -1 : 1) * (Math.random() * 4 - 0.5 + speedFactor); // скорость вверх или вниз
  }

  public update(): void {
    this.gravity += 0.1;
    this.posX += this.velocityX;
    this.posY += this.velocityY + this.gravity;
    this.opacity -= 0.03; // уменьшаем непрозрачность
  }

  public draw(): void {
    if (this.opacity > 0) {
      this.canvas.drawCircle(
        this.posX,
        this.posY,
        this.radius,
        `rgba(${255 - Math.random() * 75}, ${255 - Math.random() * 75}, 0, ${this.opacity
        })`
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
  private damageTextList: DamageText[] = [];
  private canvas: SparkCanvas;

  constructor(canvas: SparkCanvas) {
    this.canvas = canvas;
  }

  public handleClick(event: MouseEvent, damageValue: number): void {
    const rect = this.canvas.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const sparksCount = Math.round(Math.random() * 20) + 10;

    this.damageTextList.push(new DamageText(this.canvas, clickX, clickY, damageValue));

    for (let i = 0; i < sparksCount; i++) {
      this.sparks.push(new Spark(this.canvas, clickX, clickY));
    }
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.canvas.clearRect();

    this.damageTextList.forEach((damageText, index) => {
      damageText.update();
      damageText.draw();
      if (!damageText.isAlive()) {
        this.damageTextList.splice(index, 1); // удаляем текст, который исчез
      }
    })

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
// window.onload = () => {
//   const canvasElement = document.getElementById("world") as HTMLCanvasElement;
//   const canvas = new SparkCanvas(canvasElement);
//   const manager = new SparkManager(canvas);
//   manager.animate();
// };
