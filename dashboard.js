let currentUser = null;
let currentTimeframe = 'monthly';

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    initializeDashboard();
    setupEventListeners();
});

function initializeDashboard() {
    document.getElementById('greeting').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('expDate').valueAsDate = new Date();
    
    updateDashboard();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.currentTarget.id === 'logout') {
                logout();
                return;
            }
            
            e.preventDefault();
            const section = e.currentTarget.dataset.section;
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
        });
    });
    
    // Modals
    document.getElementById('addExpenseBtn').addEventListener('click', () => {
        document.getElementById('expenseModal').style.display = 'block';
    });
    
    document.getElementById('setBudgetBtn').addEventListener('click', () => {
        document.getElementById('budgetModal').style.display = 'block';
    });
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Forms
    document.getElementById('expenseForm').addEventListener('submit', handleExpenseSubmit);
    document.getElementById('budgetForm').addEventListener('submit', handleBudgetSubmit);
    
    // Chart timeframe
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTimeframe = e.target.dataset.timeframe;
            updateCharts();
        });
    });
}

function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const amount = document.getElementById('expAmount').value;
    const category = document.getElementById('expCategory').value;
    const description = document.getElementById('expDescription').value;
    const date = document.getElementById('expDate').value;
    
    // AI Classification
    const priority = expenseClassifier.classifyExpense(amount, category, description);
    
    const expense = {
        id: Date.now().toString(),
        userId: currentUser.id,
        amount: parseFloat(amount),
        category: category,
        description: description,
        date: date,
        priority: priority,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const expenses = getExpenses();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Close modal and refresh
    document.getElementById('expenseModal').style.display = 'none';
    document.getElementById('expenseForm').reset();
    
    showNotification(`Expense added! AI classified as: ${priority.replace('_', ' ').toUpperCase()}`, 'success');
    updateDashboard();
}

function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const amount = document.getElementById('budgetAmount').value;
    const timeframe = document.getElementById('budgetTimeframe').value;
    const category = document.getElementById('budgetCategory').value;
    
    const budget = {
        id: Date.now().toString(),
        userId: currentUser.id,
        amount: parseFloat(amount),
        timeframe: timeframe,
        category: category,
        createdAt: new Date().toISOString()
    };
    
    const budgets = getBudgets();
    
    // Remove existing budget for same timeframe and category
    const filtered = budgets.filter(b => 
        !(b.userId === currentUser.id && b.timeframe === timeframe && b.category === category)
    );
    
    filtered.push(budget);
    localStorage.setItem('budgets', JSON.stringify(filtered));
    
    document.getElementById('budgetModal').style.display = 'none';
    document.getElementById('budgetForm').reset();
    
    showNotification('Budget set successfully!', 'success');
    updateDashboard();
}

function updateDashboard() {
    updateStatistics();
    loadExpenses();
    loadBudgets();
    loadRecommendations();
    updateCharts();
}

function updateStatistics() {
    const expenses = getUserExpenses();
    const budgets = getUserBudgets();
    
    // Total spent (all time)
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toFixed(2)}`;
    
    // This month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    const monthlySpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('monthlySpent').textContent = `₹${monthlySpent.toFixed(2)}`;
    
    // Transaction count
    document.getElementById('transactionCount').textContent = expenses.length;
    
    // Budget left
    const monthlyBudget = budgets.find(b => b.timeframe === 'monthly');
    if (monthlyBudget) {
        const budgetLeft = monthlyBudget.amount - monthlySpent;
        document.getElementById('budgetLeft').textContent = `₹${budgetLeft.toFixed(2)}`;
    } else {
        document.getElementById('budgetLeft').textContent = 'No Budget Set';
    }
}

function loadExpenses() {
    const expenses = getUserExpenses().sort((a, b) => new Date(b.date) - new Date(a.date));
    const expensesList = document.getElementById('expensesList');
    
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">No expenses yet. Start tracking!</p>';
        return;
    }
    
    expensesList.innerHTML = '';
    expenses.slice(0, 20).forEach(expense => {
        const card = document.createElement('div');
        card.className = 'expense-item';
        card.innerHTML = `
            <div class="expense-info">
                <h3>${expense.description}</h3>
                <div class="expense-meta">
                    ${expense.category} • ${new Date(expense.date).toLocaleDateString('en-IN')}
                </div>
            </div>
            <div style="text-align: right;">
                <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
                <span class="priority-badge priority-${expense.priority}">
                    ${expense.priority.replace('_', ' ')}
                </span>
            </div>
        `;
        expensesList.appendChild(card);
    });
}

function loadBudgets() {
    const budgets = getUserBudgets();
    const budgetsList = document.getElementById('budgetsList');
    
    if (budgets.length === 0) {
        budgetsList.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">No budgets set. Create your first budget!</p>';
        return;
    }
    
    budgetsList.innerHTML = '';
    budgets.forEach(budget => {
        const card = document.createElement('div');
        card.className = 'budget-item';
        card.innerHTML = `
            <div class="budget-info">
                <h3>${budget.category} - ${budget.timeframe}</h3>
                <div class="budget-meta">Set on ${new Date(budget.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
            <div class="expense-amount">₹${budget.amount.toFixed(2)}</div>
        `;
        budgetsList.appendChild(card);
    });
}

function loadRecommendations() {
    const expenses = getUserExpenses();
    const budgets = getUserBudgets();
    
    const recommendations = recommendationEngine.generateRecommendations(expenses, budgets);
    const recommendationsList = document.getElementById('recommendationsList');
    
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-item';
        card.innerHTML = `
            <p><span style="font-size: 1.5em; margin-right: 10px;">${rec.icon}</span>${rec.text}</p>
            ${rec.savings > 0 ? `<span class="savings-badge">Potential Savings: ₹${rec.savings.toFixed(2)}</span>` : ''}
        `;
        recommendationsList.appendChild(card);
    });
}

function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses') || '[]');
}

function getUserExpenses() {
    return getExpenses().filter(exp => exp.userId === currentUser.id);
}

function getBudgets() {
    return JSON.parse(localStorage.getItem('budgets') || '[]');
}

function getUserBudgets() {
    return getBudgets().filter(b => b.userId === currentUser.id);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
