var draw = [63, 39, 54, 05, 66, 15];
var tickets = [];

var testTickets = [
    {
        rows: {
            a: [63, 54, 40, 66, 02, 08],
            b: [04, 09, 66, 69, 73, 15]
        },
        id: 1
    },
    {
        rows: {
            a: [64, 55, 49, 67, 01, 08],
            b: [05, 63, 54, 39, 66, 15]
        },
        id: 2
    }
];

var winners = { 
    regNumsMatched: {},
    cashWon: 0,
    grandPrizesWon: 0
};

var prizes = {
    regNumsMatched: {
        3: 7,
        4: 100,
        5: 1000000
    },
    plusPower: {
        0: 4,
        1: 4,
        2: 7,
        3: 100,
        4: 50000,
        5: 'Grand Prize'
    }
};

function hasDupes(array) {
    return (new Set(array)).size !== array.length;
}

function checkTicketRowsForDupes(aoTickets) {
    var tickets = aoTickets;
    var dupes = [];

    for (var ticket of tickets) {

        for (var row in ticket.rows) {
            
            var powerNum = ticket.rows[row].pop();

            if (hasDupes(ticket.rows[row])) {

                dupes.push("Ticket " + ticket.id + ": row " + row);
            }

            ticket.rows[row].push(powerNum);
        }
    }
    return dupes;
}
    
function countMatches(aoTickets, aDrawNums) {

    var drawNonPowerNums    = aDrawNums;
    var drawPball           = drawNonPowerNums.pop();
    var matchCounter        = 0;

    for (var ticket of aoTickets) {
        
        for (rowName in ticket.rows) {
            
            var sWinningTicket = ('Ticket: ' + ticket.id + ' row ' + rowName);
            var regNums        = ticket.rows[rowName];
            var pBall          = regNums.pop();
            matchCounter       = 0;

            for (var num of regNums) {
                for (var drawNum of drawNonPowerNums) {

                    if (num == drawNum) {
                        matchCounter += 1;
                    }
                }
            }
            typeOfWin(matchCounter, pBall, drawPball, sWinningTicket);
        }
    }
}

function typeOfWin(matchCounter, pBall, drawPball, sWinningTicket) {
    
    for (var i = 5; i >= 0; i--) { 

        if (matchCounter == i) {

            // power match
            if (pBall == drawPball) {

                createWinnersObjStructure(true, i);
                winners.regNumsMatched[i].plusPower.push(sWinningTicket);
                matchCounter != 5 ? winners.cashWon += (prizes.plusPower[i]) : winners.grandPrizesWon += 1;
                                
                return;
            }
            // match without power
            else {

                if (matchCounter > 2) {

                    createWinnersObjStructure(false, i);                
                    winners.regNumsMatched[i].noPower.push(sWinningTicket);
                    winners.cashWon += prizes.regNumsMatched[i];
                }
                return;
            }
        }
    }
}

function createWinnersObjStructure (isPowerMatch, regNumsMatchedCount) {
    
    if (!winners.regNumsMatched[regNumsMatchedCount]) {
        winners.regNumsMatched[regNumsMatchedCount] = {};
    }

    if (isPowerMatch) {
        
        winners.regNumsMatched[regNumsMatchedCount].plusPower = [];
    }
    else {
        winners.regNumsMatched[regNumsMatchedCount].noPower= [];
    }
}

(function startProgram () {

    var dupes = checkTicketRowsForDupes(testTickets);
    
    if (dupes.length) {

        console.log("Ticket rows cannot have duplicate numbers (excluding power number). Please correct duplicates:")
        console.log(dupes);
    }
    else {
        countMatches(testTickets, draw);
        winners.cashWon ? console.log(winners) : console.log('no winners');
    }
})();
    

