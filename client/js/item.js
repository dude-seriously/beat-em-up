var item = null;

function Item(x, y) {
  this.x = x;
  this.y = y;
  this.player = 0;
  this.sprite = new BeatEmUp.Sprite(BeatEmUp.Images.chicken, 0, 0, 42, 32, 0, 200, 3, 0, 0);
  this.sprite.StartAnimation();
}

Item.prototype.renderBottom = function() {
  if (this.player == 0) {
    ctx.save();

    ctx.translate(this.x, this.y - 2);
    ctx.scale(1, .5);
    ctx.beginPath();
    ctx.arc(0, 0, 29, 0 , 2 * Math.PI, false);
    ctx.strokeStyle = '#f60';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }
}

Item.prototype.render = function() {
  if (this.player == 0) {
    this.sprite.SetLocation(this.x, this.y);
    this.sprite.Draw(ctx);
  }
}