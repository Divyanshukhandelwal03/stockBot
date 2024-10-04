// DOM Elements
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const dashboardSection = document.getElementById('dashboardSection');
const toggleSection = document.getElementById('toggleSection');
const toggleText = document.getElementById('toggleText');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

const balanceSection = document.getElementById('balanceSection');
const portfolioSection = document.getElementById('portfolioSection');
const stockPricesSection = document.getElementById('stockPricesSection');

// Hardcoded user data (for simplicity)
const users = {
    'user1': { password: 'pass1', balance: 10000, portfolio: { AAPL: 10, GOOGL: 5 } },
    'user2': { password: 'pass2', balance: 15000, portfolio: { TSLA: 3, AMZN: 2 } }
};

// Mock stock prices
let stockPrices = {
    AAPL: 150,
    GOOGL: 2800,
    TSLA: 800,
    AMZN: 3500
};

let currentUser = null;

// Helper function to update the stock prices dynamically (mock behavior)
function updateStockPrices() {
    Object.keys(stockPrices).forEach(stock => {
        // Randomly fluctuate stock prices for demo purposes
        stockPrices[stock] = (stockPrices[stock] * (1 + (Math.random() - 0.5) / 100)).toFixed(2);
    });
    displayStockPrices();
}

// Helper function to display the updated balance, portfolio, and stock prices
function updateDashboard() {
    if (currentUser) {
        // Update balance
        balanceSection.textContent = `Balance: $${users[currentUser].balance.toFixed(2)}`;

        // Update portfolio
        portfolioSection.textContent = `Your Portfolio: ${JSON.stringify(users[currentUser].portfolio)}`;

        // Display stock prices
        displayStockPrices();
    }
}

// Display stock prices in the stockPricesSection
function displayStockPrices() {
    stockPricesSection.textContent = `Stock Prices: ${JSON.stringify(stockPrices)}`;
}

// Helper function to hide/show sections based on login state
function updateUIForLogin() {
    if (currentUser) {
        // Hide login and signup sections, show dashboard
        loginSection.classList.add('hidden');
        signupSection.classList.add('hidden');
        toggleSection.classList.add('hidden'); // Hide toggle between login/signup
        dashboardSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden'); // Show logout button

        // Update the dashboard with user-specific data
        updateDashboard();
    } else {
        // Show login/signup options
        loginSection.classList.remove('hidden');
        signupSection.classList.add('hidden'); // Initially hide signup
        toggleSection.classList.remove('hidden'); // Show the toggle option
        dashboardSection.classList.add('hidden');
        logoutBtn.classList.add('hidden'); // Hide logout button
    }
}

// Login Form Submission
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        loginError.textContent = '';
        updateUIForLogin(); // Update the UI for the logged-in state
    } else {
        loginError.textContent = 'Invalid username or password';
    }
});

// Signup Form Submission
signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (!users[username]) {
        users[username] = { password: password, balance: 10000, portfolio: {} };
        currentUser = username;
        signupError.textContent = '';
        updateUIForLogin(); // Update the UI for the logged-in state
    } else {
        signupError.textContent = 'Username already exists';
    }
});

// Logout functionality
logoutBtn.addEventListener('click', function () {
    currentUser = null;
    updateUIForLogin(); // Update the UI to logged-out state
});

// Toggle between login and signup form
document.getElementById('toggleSignup').addEventListener('click', function (e) {
    e.preventDefault();
    loginSection.classList.toggle('hidden');
    signupSection.classList.toggle('hidden');
    toggleText.textContent = signupSection.classList.contains('hidden') ? 
        "Don't have an account? Signup here" : "Already have an account? Login here";
});
// Handle Buy Stock
const manualBuyForm = document.getElementById('manualBuyForm');
manualBuyForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting and reloading the page
    const stock = document.getElementById('buyStock').value;
    const quantity = parseInt(document.getElementById('buyQuantity').value);

    if (stockPrices[stock] && currentUser) {
        const price = stockPrices[stock] * quantity;
        if (users[currentUser].balance >= price) {
            // Deduct balance and add stock to portfolio
            users[currentUser].balance -= price;
            if (users[currentUser].portfolio[stock]) {
                users[currentUser].portfolio[stock] += quantity;
            } else {
                users[currentUser].portfolio[stock] = quantity;
            }
            alert(`Bought ${quantity} shares of ${stock}`);
            updateDashboard();
        } else {
            alert("Insufficient balance");
        }
    } else {
        alert("Invalid stock or user not logged in");
    }
});

// Handle Sell Stock
const manualSellForm = document.getElementById('manualSellForm');
manualSellForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting and reloading the page
    const stock = document.getElementById('sellStock').value;
    const quantity = parseInt(document.getElementById('sellQuantity').value);

    if (stockPrices[stock] && currentUser) {
        if (users[currentUser].portfolio[stock] && users[currentUser].portfolio[stock] >= quantity) {
            // Calculate the selling price and add to the balance
            const price = stockPrices[stock] * quantity;
            users[currentUser].balance += price;
            users[currentUser].portfolio[stock] -= quantity;
            
            // If no more stock left, remove from portfolio
            if (users[currentUser].portfolio[stock] === 0) {
                delete users[currentUser].portfolio[stock];
            }

            alert(`Sold ${quantity} shares of ${stock}`);
            updateDashboard();
        } else {
            alert("Insufficient stock quantity");
        }
    } else {
        alert("Invalid stock or user not logged in");
    }
});


// Initialize the UI on page load
updateUIForLogin();

// Simulate stock price updates every 5 seconds
setInterval(updateStockPrices, 5000);
