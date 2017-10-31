# Server side design
This document describes the data structure of the database, the API and most importantly, the API's intended use within the client applications. It also specifies the way that WebSockets are implemented.
## Data structure
This is the data structure for the MongoDB database. All the `->` are references to an `_id` from the specified document.

### Questions
```
_id: ObjectId
question: String
answer: String
category: String
```

### Team
```
_id: ObjectId
appliedGame: String -> Games
name: String
```

### Games
```
_id: String
closed: Boolean
playedQuestions: [ObjectId -> Questions]
teams: [{
 _id: ObjectId,
 name: String,
 roundPoints: Number
}]
rounds: [{
 answers: [{
  question: ObjectId -> Questions
  closed: Boolean
  answers: [{
   team: String
   answer: String
   approved: Boolean
  }]
 }]
 activeAnswer: Number
}]
activeRound: Number
```

## WebSockets API
### QuizApp
The following WebSocket is expected to be opened after the user applies to the quiz.
```
http://SERVERNAME/ws/PASSWORD/teams/TEAMID
```

#### Application accepted
Event: `joinGame`

Message: `{ joinGame: true }`

#### Application denied
Event: `joinGame`

Message: `{ joinGame: false }`

#### Next round
Event: `changeRound`

Message: `{ changeRound: true }`

#### Next question
Event: `changeQuestion`

Message: `{ changeQuestion: true }`

#### Question closed
Event: `closeQuestion`

Message: `{ closeQuestion: true }`

#### Game closed
Event: `closeGame`

Message: `{ closeGame: true }`

### QuizMaster
The following WebSocket is expected to be opened after the user opens the game for applications.
```
http://SERVERNAME/ws/PASSWORD/master
```

#### Update applications
Event: `updateApplications`

Message: `{ updateApplications: true }`

#### Update answers
Event: `updateAnswers`

Message: `{ updateAnswers: true }`

### QuizScore
The following WebSocket is expected to be opened after the game has been opened for applications.
```
http://SERVERNAME/ws/PASSWORD/scores
```

#### Update scores
Event: `updateScores`

Messages: `{ updateScores: true }`

## REST API
Note: all `POST`, `PUT` and `DELETE` APIs will return a message with the following structure, in addition to the response specified in the API's specification.
```
{
 success: Boolean,
 error: String
}
```
### QuizMaster
#### How it will be used
1. Start the quiz and open for applications.
   - `POST /api/games`
2. Approve or reject team applications.
   - `GET /api/games/:gameId/teams`
   - `PUT /api/games/:gameId/teams/:teamId`
     - `{approved: true}`
3. Start the quiz for the teams that has been approved.
   - `POST /api/games/:gameId/rounds`
4. Start a quiz round (12 questions) by selecting three categories and pressing the start round button.
   - `GET /api/categories`
   - `POST /api/games/:gameId/rounds/current/questions`
     - `{categories: [String, String, ...]`
5. Select the next question and start the selected question by pressing a button.
   - `GET /api/games/:gameId/rounds/current/questions`
   - `PUT /api/games/:gameId/rounds/current`
     - `{nextQuestion: ObjectId}`
6. Close the current question.
   - `PUT /api/games/:gameId/rounds/current/questions/current`
     - `{close: true}`
7. Read the answers that the teams have submitted and validate their correctness.
   - `GET /api/games/:gameId/rounds/current/answers/current`
   - `PUT /api/games/:gameId/rounds/current/answers/current`
     - `{team: String, correct: Boolean}`
8. After a quiz round, decide whether to
   - play another round
     - `POST /api/games/:gameId/rounds`
   - or end the quiz night.
     - `PUT /api/games/:gameId`
       - `{closed: true}`

#### POST /api/games
Start a new quiz night.
##### Response
```
{
 password: String
}
```

#### PUT /api/games/:gameId
End the quiz night.
##### Request
```
{
 closed: true
}
```

#### GET /api/games/:gameId/teams
Check which teams have applied to the game.
##### Response
```
[
 {
  _id: ObjectId,
  name: String,
  approved: Boolean
 }
]
```

#### PUT /api/games/:gameId/teams/:teamId
Approve a team's request to play.
##### Request
```
{
 approved: Boolean
}
```

#### GET /api/categories
Get all available categories.
##### Response
```
[
 {
  name: String
 }
]
```

#### POST /api/games/:gameId/rounds
Start a new round.
##### Response
```
{
 roundId: Number
}
```

#### POST /api/games/:gameId/rounds/current/questions
Add questions from a category to the round.
##### Request
```
{
 categories: [String]
}
```

#### GET /api/games/:gameId/rounds/current/questions
Get all the questions in the round and their right answer.
##### Response
```
[
 {
  questionId: ObjectId,
  question: String,
  answer: String
 }
]
```

#### GET /api/games/:gameId/rounds/current/questions/current
Get the current question.
##### Response
```
{
 question: String
}
```

#### PUT /api/games/:gameId/rounds/current/questions/current
Close the current question.
##### Request
```
{
 close: Boolean
}
```

#### GET /api/games/:gameId/rounds/current/answers/current
Get all answers from all teams for the current question within a round, as well as the right answer to the question.
##### Response
```
{
 answer: String,
 teamAnswers: [{
  team: String,
  answer: String,
  correct: Boolean
 }]
}
```

#### PUT /api/games/:gameId/rounds/current/answers/current
Mark an answer as correct or incorrect.
##### Request
```
{
 team: String,
 correct: Boolean
}
```

#### PUT /api/games/:gameId/rounds/current
Change to another question.
##### Request
```
{
 nextQuestion: ObjectId
}
```

### QuizApp

#### How it will be used
1. Apply as a team for the quiz night
   - `POST /api/games/:gameId/teams`
     - `{name: String}`
2. Await approval from the quiz master
   - `GET /api/games/:gameId/teams/:teamId`
3. Display the current question
   - `GET /api/games/:gameId/rounds/current`
   - `GET /api/games/:gameId/rounds/current/questions/current`
4. Give or change an answer to the question
   - `PUT /api/games/:gameId/rounds/current/answers/current`

#### POST /api/games/:gameId/teams
Apply for a game.
##### Request
```
{
 name: String
}
```
##### Response
```
{
 teamId: ObjectId
}
```

#### GET /api/games/:gameId/teams/:teamId
Check whether the team application has been approved
##### Response
```
{
 approved: Boolean
}
```

#### GET /api/games/:gameId/rounds/current
Get the current round number.
##### Response
```
{
 roundNumber: Number
}
```

#### GET /api/games/:gameId/rounds/current/questions/current
Get the current question.
##### Response
```
{
 question: String
}
```

#### PUT /api/games/:gameId/rounds/current/answers/current
Give or change an answer to a certain question.
##### Request
```
{
 team: String,
 answer: String
}
```

### QuizScore
#### How it will be used
1. Enter the password to show the correct game.
   - `GET /api/games/:gameId/scores`

#### GET /api/games/:gameId/scores
Fetch the information for the scoreboard.
##### Response
```
{
 roundNumber: Number,
 questionNumber: Number,
 maxQuestions: Number,
 scores: [{
  team: String,
  correctAnswers: Number,
  roundPoints: Number
 }],
 currentQuestion: {
  name: String,
  category: String,
  closed: Boolean,
  teamsAnswered: [{
   team: String,
   answer: String,
   approved: Boolean
  }]
 }
}
```
