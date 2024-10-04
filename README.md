# **TRADING BOT BACKEND APPLICATION**

This project simulates a basic stock trading bot where users can log in, buy and sell stocks, and track their portfolio and balance. The backend is built using Node.js and includes features like user authentication (login/signup), stock price simulation, and user-specific trading.

## **FEATURES**

- **User Authentication:** Hardcoded users can sign up and log in to trade stocks.
- **Stock Trading:** Users can buy and sell stocks, and their balance and portfolio are updated in real-time.
- **Session Management:** Each user's session is managed using `express-session` to maintain user-specific data like balance and portfolio.
- **Predefined Stock Prices:** Stock prices are hardcoded and fluctuate as simulated prices.

## **TECHNOLOGIES USED**

- **Backend:** Node.js, Express
- **Session Management:** express-session
- **Frontend:** Vanilla JavaScript, HTML, CSS
- **Mock Data:** Hardcoded stock prices


## **PROJECT STRUCTURE**

```bash
trading-bot-backend/
├── public/
│   ├── index.html         # Frontend (Login/Signup UI)
│   ├── styles.css         # Basic UI styling for the forms and dashboard
│   └── script.js          # Frontend logic for interacting with the backend
├── server.js              # Backend logic (Node.js/Express app)
├── package.json           # Project dependencies and configuration
└── README.md              # Project documentation
```
## **USAGE**
Signup
Navigate to the signup form, create a new account by entering an email and password. The information will be saved on the backend (hardcoded), and the user will be redirected to the login page.

Login
Once signed up, log in using your email and password. Upon successful login, you will be taken to the Trading Dashboard, where you can:

View your balance.
View your current stock portfolio.
See the latest stock prices.
Trading

Buy Stock: Click the "Buy" button next to the stock you wish to purchase, enter the quantity, and your balance and portfolio will be updated accordingly.
Sell Stock: Click the "Sell" button, enter the quantity to sell, and your balance and portfolio will be updated.
Logout
You can log out by closing the browser, and your session will be cleared.


## **ENDPOINTS**
```bash
POST /api/signup: Signup a new user (hardcoded backend users).
POST /api/login: Log in as a user.
GET /api/user: Get the current user’s session data (balance, portfolio).
GET /api/stocks: Get the list of stocks and their prices.
POST /api/buy: Buy stocks.
POST /api/sell: Sell stocks.
POST /api/logout: Log out the user.
```

## **IMPROVEMENTS AND FUTURE ENHANCEMENTS**
Integrating an actual database for user management and trading history.
Implementing real-time stock prices using an external stock API.
Adding additional trading strategies and features like stop-loss orders.
