export function addPlayer(self, playerInfo) {
  self.bro = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'bro').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  self.bro.setBounce(0.2);
  if (playerInfo.team === 'white') {
    self.bro.setTint(0xFFFAFA);
  } else {
    self.bro.setTint(0xFFFF00);
  }
  self.bro.setDrag(100);
  self.bro.setMaxVelocity(200);
  self.bro.shot = false;


}

export function addOtherPlayers(self, playerInfo) {
  self.otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  if (playerInfo.team === 'white') {
    self.otherPlayer.setTint(0xFFFAFA);
  } else {
    self.otherPlayer.setTint(0xFFFF00);
  }
  self.otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(self.otherPlayer);
}
