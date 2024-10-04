document.addEventListener('DOMContentLoaded', function () {
    const stockTableBody = document.querySelector('#stockTable tbody');
    const portfolioTableBody = document.querySelector('#portfolioTable tbody');
    const balanceElement = document.getElementById('balance');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginContainer = document.getElementById('loginContainer');
    const tradingContainer = document.getElementById('tradingContainer');

    // Hardcoded users
    const users = {
        'john@example.com': { password: '12345', balance: 10000, portfolio: {} },
        'jane@example.com': { password: '54321', balance: 15000, portfolio: {} }
    };

    let currentUser = null;  // Holds the currently logged-in user

    // Login functionality
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (users[email] && users[email].password === password) {
            currentUser = users[email];
            loginContainer.style.display = 'none';
            tradingContainer.style.display = 'block';
            updatePortfolio();
        } else {
            alert('Invalid email or password!');
        }
    });

    // Signup functionality (hardcoded, for demonstration purposes)
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        if (users[email]) {
            alert('User already exists!');
        } else {
            users[email] = { password, balance: 10000, portfolio: {} };  // Create new user with initial balance
            alert('Signup successful, please login.');
        }
    });

    // Fetch stock prices and render table
    const fetchStockPrices = () => {
        fetch('/api/stocks')
            .then(response => response.json())
            .then(data => {
                stockTableBody.innerHTML = ''; // Clear the table
                for (const stock in data) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${stock}</td>
                        <td>${data[stock]}</td>
                        <td>
                            <button class="buy" onclick="buyStock('${stock}', ${data[stock]})">Buy</button>
                            <button class="sell" onclick="sellStock('${stock}', ${data[stock]})">Sell</button>
                        </td>
                    `;
                    stockTableBody.appendChild(row);
                }
            });
    };

    // Buy stock logic (specific to current user)
    window.buyStock = (stock, price) => {
        if (currentUser && currentUser.balance >= price) {
            if (!currentUser.portfolio[stock]) {
                currentUser.portfolio[stock] = { quantity: 0, buyPrice: price };
            }
            currentUser.portfolio[stock].quantity++;
            currentUser.portfolio[stock].buyPrice = price;
            currentUser.balance -= price;
            updatePortfolio();
        } else {
            alert('Not enough balance to buy stock!');
        }
    };

    // Sell stock logic (specific to current user)
    window.sellStock = (stock, price) => {
        if (currentUser && currentUser.portfolio[stock] && currentUser.portfolio[stock].quantity > 0) {
            currentUser.portfolio[stock].quantity--;
            currentUser.balance += price;
            if (currentUser.portfolio[stock].quantity === 0) {
                delete currentUser.portfolio[stock]; // Remove stock from portfolio if quantity is 0
            }
            updatePortfolio();
        } else {
            alert('You don\'t own any shares of this stock!');
        }
    };

    // Update portfolio and balance UI
    const updatePortfolio = () => {
        portfolioTableBody.innerHTML = '';
        for (const stock in currentUser.portfolio) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stock}</td>
                <td>${currentUser.portfolio[stock].quantity}</td>
                <td>${currentUser.portfolio[stock].buyPrice}</td>
                <td>${currentUser.portfolio[stock].buyPrice}</td> <!-- For now, use buyPrice as current price -->
            `;
            portfolioTableBody.appendChild(row);
        }
        balanceElement.textContent = currentUser.balance.toFixed(2);
    };

    // Periodically fetch stock prices every 5 seconds
    setInterval(fetchStockPrices, 5000);
    fetchStockPrices(); // Initial fetch
});
