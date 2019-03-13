export function addPlayer(self, playerInfo) {
  self.bro = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'bro').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  self.bro.setBounce(0.2);
  if (playerInfo.team === 'blue') {
    self.bro.setTint(0x0000ff);
  } else {
    self.bro.setTint(0xff0000);
  }
  self.bro.setDrag(100);
  self.bro.setMaxVelocity(200);
  self.bro.shot = false;


}

export function addOtherPlayers(self, playerInfo) {
  let otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}
