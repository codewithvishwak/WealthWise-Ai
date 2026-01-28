// Charts Code

let expenseChart, categoryChart, priorityChart;

function updateCharts() {
    // Use allExpenses from the global scope defined in dash.html
    if (typeof allExpenses !== 'undefined' && allExpenses.length > 0) {
        updateExpenseChart(allExpenses);
        updateCategoryChart(allExpenses);
        updatePriorityChart(allExpenses);
    }
}

function updateExpenseChart(expenses) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    const data = getTimeframeData(expenses, currentTimeframe);
    
    expenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Expenses',
                data: data.values,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: false 
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return 'Spent: ₹' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        callback: value => '₹' + value,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function updateCategoryChart(expenses) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const byCategory = {};
    expenses.forEach(exp => {
        byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });
    
    const labels = Object.keys(byCategory);
    const values = Object.values(byCategory);
    
    if (labels.length === 0) {
        // Show empty state message
        ctx.font = '16px Arial';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#ec4899',
                    '#f59e0b',
                    '#10b981',
                    '#3b82f6',
                    '#ef4444',
                    '#14b8a6',
                    '#f97316'
                ],
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 13
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ₹' + value.toFixed(2) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

function updatePriorityChart(expenses) {
    const ctx = document.getElementById('priorityChart').getContext('2d');
    
    if (priorityChart) {
        priorityChart.destroy();
    }
    
    const byPriority = {
        'most_important': 0,
        'important': 0,
        'less_important': 0,
        'least_important': 0
    };
    
    expenses.forEach(exp => {
        byPriority[exp.priority] = (byPriority[exp.priority] || 0) + exp.amount;
    });
    
    const labels = Object.keys(byPriority).map(p => {
        return p.replace('_', ' ').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });
    const values = Object.values(byPriority);
    
    priorityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Amount Spent',
                data: values,
                backgroundColor: [
                    '#ef4444',
                    '#f59e0b',
                    '#3b82f6',
                    '#6b7280'
                ],
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Spent: ₹' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        callback: value => '₹' + value,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function getTimeframeData(expenses, timeframe) {
    const today = new Date();
    const data = { labels: [], values: [] };
    
    if (timeframe === 'weekly') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayExpenses = expenses.filter(exp => exp.date === dateStr);
            const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            
            data.labels.push(date.toLocaleDateString('en-IN', { weekday: 'short' }));
            data.values.push(total);
        }
    } else if (timeframe === 'monthly') {
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayExpenses = expenses.filter(exp => exp.date === dateStr);
            const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            
            data.labels.push(date.getDate());
            data.values.push(total);
        }
    } else {
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            const month = date.getMonth();
            const year = date.getFullYear();
            
            const monthExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === month && expDate.getFullYear() === year;
            });
            const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            
            data.labels.push(date.toLocaleDateString('en-IN', { month: 'short' }));
            data.values.push(total);
        }
    }
    
    return data;
}
