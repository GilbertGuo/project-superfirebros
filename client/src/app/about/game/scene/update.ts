export function update() {
  if (this.bro) {
    if (this.cursors.left.isDown) {
      this.bro.setVelocityX(-200);
      this.bro.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.bro.setVelocityX(200);
      this.bro.flipX = false;
    }

    if (this.cursors.up.isDown) {
      this.bro.setVelocityY(-500);
    } else if (this.cursors.down.isDown) {
      this.bro.setVelocityY(200);
    }

    this.physics.world.wrap(this.bro, 5);

    let x = this.bro.x;
    let y = this.bro.y;

    if (this.bro.oldPosition && (x !== this.bro.oldPosition.x || y !== this.bro.oldPosition.y)) {
      this.socket.emit('move', {x: this.bro.x, y: this.bro.y});
    }
    this.bro.oldPosition = {
      x: this.bro.x,
      y: this.bro.y,
    };

    if (this.cursors.shift.isDown && !this.bro.shot) {
      let speed_x;
      if (this.bro.flipX === true) {
        speed_x = Math.cos(90 + Math.PI / 2) * 20;
      } else {
        speed_x = Math.cos(270 + Math.PI / 2) * 20;
      }
      this.bro.shot = true;
      // Tell the server we shot a bullet
      this.socket.emit('fire', {x: this.bro.x, y: this.bro.y, angle: this.bro.rotation, speed_x: speed_x, speed_y: 0})
    }
    if (!this.cursors.shift.isDown) this.bro.shot = false;

  }
}
