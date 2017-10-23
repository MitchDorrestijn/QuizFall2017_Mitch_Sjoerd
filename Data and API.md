# Server side design
This document describes the data structure of the database, the API and most importantly, the API's intended use within the client applications. It also specifies the way that WebSockets are implemented.
## Data structure

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
question: ObjectId
closed: Boolean
answers: [{
 team: ObjectId -> Teams
 answer: String
 approved: Boolean
}]
```

## API
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
**QuizMaster**: Start a new quiz night.
##### Response
```
{
 password: String
}
```

#### PUT /api/games
**QuizMaster**: End the quiz night.
##### Request
```
{
 closed: true
}
```

#### GET /api/games/:gameId/teams
**QuizMaster**: Check which teams have applied to the game.
##### Response
```
[
 {
  _id: ObjectId
  name: String
  approved: Boolean
 }
]
```

#### PUT /api/games/:gameId/teams/:teamId
**QuizMaster**: Approve a team's request to play.
##### Request
```
{
 approved: Boolean
}
```

#### GET /api/categories
**QuizMaster**: Get all available categories.
##### Response
```
[
 {
  _id: ObjectId
  name: String
 }
]
```

#### GET /api/categories/:categoryId/questions
**QuizMaster**: Get all questions within a certain category.
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
  _id: ObjectId
  name: String
 }
]
```

#### POST /api/games/:gameId/rounds
**QuizMaster**: Start a new round.
##### Response
```
{
 roundId: ObjectId
}
```

#### POST /api/games/:gameId/rounds/:roundId/questions
**QuizMaster**: Add a question to the round.
##### Request
```
{
 questionId: ObjectId
}
```
##### Response
```
{
 success: Boolean
 error: String
}
```

#### GET /api/games/:gameId/rounds/:roundId/questions
**QuizMaster**: Get all the questions in the round and their right answer.
##### Response
```
[
 {
  questionId: ObjectId
  question: String
  answer: String
 }
]
```

#### GET /api/games/:gameId/rounds/:roundId/questions/current
**QuizMaster**: Get the current question and its right answer.
##### Response
```
{
 questionId: ObjectId
 question: String
 answer: String
}
```

#### PUT /api/games/:gameId/rounds/:roundId/questions/current
**QuizMaster**: Close the current question.
##### Request
```
{
 close: Boolean
}
```
##### Response
```
{
 success: Boolean
 error: String
}
```

#### GET /api/games/:gameId/rounds/:roundId/answers/:questionId
**QuizMaster**: Get all answers from all teams for a question within a round.
##### Response
```
[
 {
  team: String
  answer: String
  correct: Boolean
 }
]
```

#### PUT /api/games/:gameId/rounds/:roundId/answers/:questionId
**QuizMaster**: Mark an answer as correct or incorrect.
##### Request
```
{
 team: String
 correct: Boolean
}
```
##### Response
```
{
 success: Boolean
 error: String
}
```

#### PUT /api/games/:gameId/rounds/:roundId
**QuizMaster**: Change to the next question.
##### Request
```
{
 nextQuestion: Boolean
}
```
##### Response
```
{
 success: Boolean
 error: String
}
```

### QuizApp
#### POST /api/games/:gameId/teams
**QuizApp**: Apply for a game.
##### Request
```
{
 name: String
 password: String
}
```
##### Response
```
{
 success: Boolean
 error: String
}
```

### QuizScore
#### GET /api/games/:gameId/scores
**QuizScore**: Fetch the information for the scoreboard.
##### Response
```
{
 roundNumber: Number
 questionNumber: Number
 scores: [{
  team: String
  correctAnswers: Number
  roundPoints: Number
 }]
 currentQuestion: {
  name: String
  category: String
  teamsAnswered: [{
   team: String
   answer: String //only when question has been closed
   approved: Boolean
  }]
 }
}
```
