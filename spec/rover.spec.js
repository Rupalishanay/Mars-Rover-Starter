const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
   // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts", function () {
    let testRover = new Rover(1234); 
    let testedvalues = [testRover.mode, testRover.generatorWatts];
    expect(testedvalues).toEqual(['NORMAL', 110]);
  });

  it("response returned by receiveMessage contains the name of the message", function () {
    let testRover = new Rover(2345);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message('SOME TEST MESSAGE', testCommands);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.message).toBe('SOME TEST MESSAGE');
  });
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let testRover = new Rover(45678);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message ('ANOTHER TEST MESSAGE', testCommands);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.results.length).toBe(2);
  });
  it("responds correctly to the status check command", function () {
    let testRover = new Rover(89765);
    let testCommands = [new Command('STATUS_CHECK')];
    let testMessage = new Message ('OTHER TEST MESSAGE', testCommands);
    let testResponse = testRover.receiveMessage(testMessage);
    let testStatus = testResponse.results[0].roverStatus;
    let testStatusValues = [testStatus.position, testStatus.mode, testStatus.generatorWatts];
    expect(testStatusValues).toEqual([89765, 'NORMAL', 110]);
  });
  it("responds correctly to the mode change command", function () {
    let testRover = new Rover(12345);
    let testCommands = [new Command('STATUS_CHECK'), new Command('MODE_CHANGE', 'LOW_POWER')];
    let testMessage = new Message ('Test Status Check and Mode Change', testCommands);
    let testResponse = testRover.receiveMessage(testMessage);
    let testStatusValuesConcerned = [testResponse.results[1].completed, testRover.mode]
    expect(testStatusValuesConcerned).toEqual([true, 'LOW_POWER']);
  });
  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let testRover = new Rover(34567);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 64988)];
    let testMessage = new Message ('Test Mode Change and Move', testCommands);
    let testResponse = testRover.receiveMessage(testMessage);
    let testStatusValuesConcerned = [testResponse.results[1].completed, testRover.position]
    expect(testStatusValuesConcerned).toEqual([false, 34567]);
  });
  it("responds with the position for the move command", function () {
    let testRover = new Rover(56789);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MODE_CHANGE', 'NORMAL'), new Command('MOVE', 54001)];
    let testMessage = new Message ('Test Flip Mode Twice and Move', testCommands);
    let testResponse = testRover.receiveMessage(testMessage);
    let testStatusValuesConcerned = [testResponse.results[2].completed, testRover.position]
    expect(testStatusValuesConcerned).toEqual([true, 54001]);
  });
 
});
