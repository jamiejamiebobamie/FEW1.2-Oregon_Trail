let gameSession = new Game();

gameSession.startJourney();
gameSession.step(gameSession.timestamp);
gameSession.updateGame();
gameSession.pauseJourney();
gameSession.resumeJourney();
