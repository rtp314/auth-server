# User Authentication

A simple project testing out implementing user authentication and authorisation using JSON Web Tokens.

No frontend libraries used, all html is generated server-side with Pug and Express.

User authentication and authorisation powered by jsonwebtoken, bcrypt, and mongodb.

## Running

To run, open a terminal in the project folder and run `npm install` then `npm run start`.

Access the server at localhost:8080, log in at localhost:8080/user/login

Run the tests in the terminal with `npm run test` or `npm run test:watch` to automatically rerun the tests whenever you save

## Future Developments

If I come back to work more on this, I would implement:

-   A navbar with login status and a logout button
