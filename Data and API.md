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

### Teams
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
teams: [ObjectId -> Teams]
rounds: [ObjectId -> Rounds]
activeRound: ObjectId -> Rounds
```

### Rounds
```
_id: ObjectId
answers: [ObjectId -> Answers]
activeAnswer: ObjectId -> Answers
```

### Answers
```
_id: ObjectId
question: ObjectId -> Questions
closed: Boolean
answers: [{
 team: ObjectId -> Teams
 answer: String
 approved: Boolean
}]
```

## API
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
   - `GET /api/categories/:categoryId/questions`
5. Select the next question.
   - `POST /api/games/:gameId/rounds/:roundId/questions`
     - `{questionId: ObjectId}`
6. Start the selected question by pressing a button.
   - `PUT /api/games/:gameId/rounds/:roundId`
     - `{nextQuestion: true}`
7. Close the current question.
   - `PUT /api/games/:gameId/rounds/:roundId/questions/current`
     - `{close: true}`
8. Read the answers that the teams have submitted and validate their correctness.
   - `GET /api/games/:gameId/rounds/:roundId/answers/:questionId`
   - `PUT /api/games/:gameId/rounds/:roundId/answers/:questionId`
     - `{team: String, correct: Boolean}`
9. After a quiz round, decide whether to
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

#### PUT /api/games
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
  _id: ObjectId,
  name: String
 }
]
```

#### GET /api/categories/:categoryId/questions
Get all questions within a certain category.
##### Request
```
{
 password: String
}
```
Game password is passed to make sure no questions are returned that have already been asked.
##### Response
```
[
 {
  _id: ObjectId,
  name: String
 }
]
```

#### POST /api/games/:gameId/rounds
Start a new round.
##### Response
```
{
 roundId: ObjectId
}
```

#### POST /api/games/:gameId/rounds/:roundId/questions
Add a question to the round.
##### Request
```
{
 questionId: ObjectId
}
```

#### GET /api/games/:gameId/rounds/:roundId/questions
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

#### GET /api/games/:gameId/rounds/:roundId/questions/current
Get the current question.
##### Response
```
{
 questionId: ObjectId,
 question: String
}
```

#### PUT /api/games/:gameId/rounds/:roundId/questions/current
Close the current question.
##### Request
```
{
 close: Boolean
}
```

#### GET /api/games/:gameId/rounds/:roundId/answers/:questionId
Get all answers from all teams for a question within a round, as well as the right answer to the question.
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

#### PUT /api/games/:gameId/rounds/:roundId/answers/:questionId
Mark an answer as correct or incorrect.
##### Request
```
{
 team: String,
 correct: Boolean
}
```

#### PUT /api/games/:gameId/rounds/:roundId
Change to the next question.
##### Request
```
{
 nextQuestion: Boolean
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
   - `GET /api/games/:gameId/rounds/:roundId/questions/current`
4. Give or change an answer to the question
   - `PUT /api/games/:gameId/rounds/:roundId/questions/:questionId`

#### POST /api/games/:gameId/teams
Apply for a game.
##### Request
```
{
 name: String
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
Get the current round ID.
##### Response
```
{
 _id: ObjectId
}
```

#### GET /api/games/:gameId/rounds/:roundId/questions/current
Get the current question.
##### Response
```
{
 questionId: ObjectId,
 question: String
}
```

#### PUT /api/games/:gameId/rounds/:roundId/answers/:questionId
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