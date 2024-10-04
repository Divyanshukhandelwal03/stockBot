document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const stockTable = document.getElementById('stockTable');
    const portfolioTable = document.getElementById('portfolioTable');
    const balanceSpan = document.getElementById('balance');

    // Show Signup form
    document.getElementById('showSignup').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('signupContainer').style.display = 'block';
        document.getElementById('loginContainer').style.display = 'none';
    });

    // Show Login form
    document.getElementById('showLogin').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('signupContainer').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    });

    // Signup form submission
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Signup successful! Please log in.');
                document.getElementById('signupContainer').style.display = 'none';
                document.getElementById('loginContainer').style.display = 'block';
            } else {
                alert(data.message);
            }
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                document.getElementById('loginContainer').style.display = 'none';
                loadDashboard();
            } else {
                alert(data.message);
            }
        });
    });

    // Load dashboard
    function loadDashboard() {
        fetch('/api/user')
            .then(response => response.json())
            .then(data => {
                if (data.email) {
                    document.getElementById('dashboard').style.display = 'block';
                    balanceSpan.innerText = `$${data.balance}`;
                    loadStocks();
                    loadPortfolio(data.portfolio);
                    // Refresh stock prices every 5 seconds
                    setInterval(loadStocks, 5000);
                }
            });
    }

    // Load available stocks
    function loadStocks() {
        fetch('/api/stocks')
            .then(response => response.json())
            .then(data => {
                const tbody = stockTable.querySelector('tbody');
                tbody.innerHTML = ''; // Clear existing rows
                for (const stock in data) {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${stock}</td>
                        <td>${data[stock].price}</td>
                        <td>
                            <button class="buy" data-stock="${stock}">Buy</button>
                            <button class="sell" data-stock="${stock}">Sell</button>
                        </td>
                    `;
                }
                addTradeEventListeners();
            });
    }

    // Load user portfolio
    function loadPortfolio(portfolio) {
        const tbody = portfolioTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows
        for (const stock in portfolio) {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${stock}</td>
                <td>${portfolio[stock].quantity}</td>
                <td>${portfolio[stock].buyPrice}</td>
            `;
        }
    }

    // Add buy/sell event listeners
    function addTradeEventListeners() {
        const buyButtons = document.querySelectorAll('.buy');
        const sellButtons = document.querySelectorAll('.sell');

        buyButtons.forEach(button => {
            button.addEventListener('click', function () {
                const stock = this.dataset.stock;
                const quantity = prompt(`How many shares of ${stock} would you like to buy?`);
                if (quantity) {
                    fetch('/api/buy', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ stock, quantity: Number(quantity) })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            balanceSpan.innerText = `$${data.balance}`;
                            loadPortfolio(data.portfolio);
                        } else {
                            alert(data.message);
                        }
                    });
                }
            });
        });

        sellButtons.forEach(button => {
            button.addEventListener('click', function () {
                const stock = this.dataset.stock;
                const quantity = prompt(`How many shares of ${stock} would you like to sell?`);
                if (quantity) {
                    fetch('/api/sell', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ stock, quantity: Number(quantity) })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            balanceSpan.innerText = `$${data.balance}`;
                            loadPortfolio(data.portfolio);
                        } else {
                            alert(data.message);
                        }
                    });
                }
            });
        });
    }

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', function () {
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Logout successful');
                document.getElementById('dashboard').style.display = 'none';
                document.getElementById('signupContainer').style.display = 'none';
                document.getElementById('loginContainer').style.display = 'block';
            }
        });
    });
});
