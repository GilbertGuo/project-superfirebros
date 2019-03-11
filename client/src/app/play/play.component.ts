import { Component,ViewChild, ElementRef,OnInit, AfterViewInit } from '@angular/core';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements AfterViewInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;
  context: CanvasRenderingContext2D;
  weapon: CanvasRenderingContext2D;

  constructor(private gameService: GameService) { }

  xcor=this.gameService.player.x;
  ycor=this.gameService.player.y;

  ngAfterViewInit() {
    let image = new Image();
    image.src = "../assets/img/1.jpg";

    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    /*this.context.fillStyle ="red";
    this.context.fillRect(this.xcor,this.ycor,30,30);*/

    this.context.drawImage(image,
      this.xcor,
      this.ycor,
      30,30);

    this.weapon = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    let x=this.xcor;
    let y=this.ycor;

    let ctx = this.context;
    let wp = this.weapon;


    let speedx=0;
    let keycode=null;
    let countspace=0;
    let checkright = true;
    setInterval(updateGameArea, 20);

    window.addEventListener('keydown', function (e) {

      keycode=e.key;
      console.log(keycode);

      if(keycode==" "){
        countspace++;
        ctx.clearRect(x,y,30,30);
        y=y-50;
        ctx.fillRect(x,y,30,30);
      }
      if(keycode=="ArrowLeft"){
        checkright=false;
        speedx=-1;
      }
      if(keycode=="ArrowRight"){
        checkright=true;
        speedx=1;
      }
      if(keycode=="f"){
        if(checkright){
          let a=x+30;
          let b=y+10;
          wp.fillRect(a,b,30,10);
          a++;
          setInterval(function() {
            wp.clearRect(a,b,30,10);
            a++;
            wp.fillRect(a,b,30,10);
          },10);
        } else {
          let a=x-30;
          let b=y+10;
          wp.fillRect(a,b,30,10);
          a--;
          setInterval(function() {
            wp.clearRect(a,b,30,10);
            a--;
            wp.fillRect(a,b,30,10);
          },10);
        }

      }
    });

    function updateGameArea() {
      ClearGame();
      NewPos();
      Update();
    }

    function ClearGame(){
      ctx.clearRect(0,0,480,270);
    }

    function NewPos(){
      x=x+speedx;
    }

    function Update(){
      //ctx.fillRect(x,y,30,30);
      ctx.drawImage(image,
        x,
        y,
        30,30);

    }

    function Clearmove() {
      speedx = 0;
    }

    window.addEventListener('keyup', function (e) {
      if(e.key==" "){
        while(countspace>0) {
          ctx.clearRect(x, y, 30, 30);
          y = y + 50;
          ctx.fillRect(x, y, 30, 30);
          countspace--;
        }

      } else{
        Clearmove();
      }

    });
  }



}
