const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const dashboard = document.getElementById('dashboard');
const balanceSpan = document.getElementById('balance');
const portfolioList = document.getElementById('portfolio');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');

const signupUsername = document.getElementById('signupUsername');
const signupPassword = document.getElementById('signupPassword');

const stockSymbol = document.getElementById('stockSymbol');
const stockQuantity = document.getElementById('stockQuantity');

const sellStockSymbol = document.getElementById('sellStockSymbol');
const sellStockQuantity = document.getElementById('sellStockQuantity');

let token = null;

// Show signup form on click
document.getElementById('signUp').addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});
document.getElementById('signIn').addEventListener('click', () => {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

// Signup
document.getElementById('signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: signupUsername.value, password: signupPassword.value })
    });

    const result = await response.json();
    if (response.status === 201) {
        alert(result.message);
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    } else {
        alert(result.message);
    }
});

// Login
// document.getElementById('login').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const response = await fetch('http://localhost:5000/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: loginUsername.value, password: loginPassword.value })
//     });

//     const result = await response.json();
//     if (response.status === 200) {
//         token = result.token;
//         loginForm.style.display = 'none';
//         dashboard.style.display = 'block';
//         fetchDashboardData();
//     } else {
//         alert(result.message);
//     }
// });

// Fetch dashboard data
async function fetchDashboardData() {
    const response = await fetch('http://localhost:5000/users/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();
    if (response.status === 200) {
        balanceSpan.textContent = `$${result.balance}`;
        portfolioList.innerHTML = '';
        Object.keys(result.portfolio).forEach(stock => {
            const li = document.createElement('li');
            li.textContent = `${stock}: ${result.portfolio[stock]} shares`;
            portfolioList.appendChild(li);
        });
    }
}

// Buy stock
document.getElementById('buyStock').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/stocks/buy', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: stockSymbol.value, quantity: stockQuantity.value })
    });

    const result = await response.json();
    if (response.status === 200) {
        alert(result.message);
        fetchDashboardData();
    } else {
        alert(result.message);
    }
});

// Sell stock
document.getElementById('sellStock').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/stocks/sell', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: sellStockSymbol.value, quantity: sellStockQuantity.value })
    });

    const result = await response.json();
    if (response.status === 200) {
        alert(result.message);
        fetchDashboardData();
    } else {
        alert(result.message);
    }
});
