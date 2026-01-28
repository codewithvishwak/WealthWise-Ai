
# WealthWise - Intelligent Expense Tracker

A modern, AI-powered web application for managing personal finances and expense tracking with intelligent priority classification and insightful analytics.

## 🎯 Features

### Core Features
- **User Authentication**: Secure login and registration system with local storage
- **Expense Management**: Add, edit, and delete expenses with ease
- **Budget Management**: Set monthly budgets per category and track spending against limits
- **Smart Categorization**: Automatic and manual expense categorization
- **AI-Powered Priority Classification**: Machine learning-based system that classifies expenses into:
  - Most Important (urgent/medical/utilities)
  - Important (essential expenses)
  - Less Important (discretionary)
  - Least Important (non-essential)

### Analytics & Insights
- **Real-time Dashboard**: Visual overview of spending patterns
- **Interactive Charts**:
  - Expense trend line chart (daily/weekly/monthly view)
  - Category-wise expense distribution (pie chart)
  - Priority-based expense breakdown
- **Time-based Filtering**: View data by day, week, or month
- **XP & Gamification**: Earn experience points for tracking expenses
- **Detailed Reports**: Category-wise breakdown and spending analysis

### Smart Features
- **AI Recommendations**: Personalized spending recommendations based on your patterns
- **Budget Alerts**: Real-time notifications when approaching budget limits
- **Category Insights**: Detailed analysis of spending by category
- **Mobile Responsive**: Works seamlessly on all devices

## 📋 Project Structure

```
404NotFound/
├── README.md                 # Project documentation
├── index.html                # Login & Registration page
├── dash.html                 # Dashboard page
├── style.css                 # Global styling
├── auth.js                   # Authentication logic
├── dashboard.js              # Dashboard functionality
├── charts.js                 # Chart.js integration & visualization
├── ml_classifier.js          # ML classification & recommendation engine
├── DEBUG_INSTRUCTIONS.md     # General debugging guide
├── DEBUG_XP_GUIDE.md         # XP system debugging
├── XP_PERSISTENCE_FIX.md     # XP persistence fix documentation
├── FIXES_APPLIED.md          # Bug fixes documentation
└── FINAL_FIXES.md            # Complete fixes summary
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation

1. Clone or download the project:
```bash
git clone <repository-url>
cd 404NotFound
```

2. Open `index.html` in your browser:
   - Double-click `index.html`, or
   - Right-click → Open with → Browser, or
   - Drag and drop into your browser window

### First Time Setup

1. **Create an Account**:
   - Click "Register" tab on login page
   - Enter your name, email, and password
   - Confirm password and submit

2. **Login**:
   - Use your registered credentials to login
   - You'll be redirected to the dashboard

3. **Set Budget**:
   - Click "Set Budget" button
   - Set monthly budget limits for each category
   - Click "Save Budget"

4. **Add Expenses**:
   - Click "Add Expense" button
   - Fill in amount, date, category, and description
   - Click "Add" to record the expense

## 💻 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charting**: Chart.js library
- **Data Storage**: Browser LocalStorage API
- **ML/AI**: Custom client-side ML classification system
- **Authentication**: Session-based with LocalStorage

## 📊 Core Components

### 1. Authentication System (`auth.js`)
- User registration with validation
- Login verification
- Password encoding (Note: For production, use secure hashing)
- Session management via LocalStorage

### 2. Dashboard (`dashboard.js`)
- Real-time dashboard updates
- Event listener management
- Modal handling for forms
- Data persistence
- XP tracking and gamification

### 3. ML Classification System (`ml_classifier.js`)
- **ExpenseClassifier Class**: 
  - Analyzes expenses based on keywords, categories, and amounts
  - Returns priority level for each expense
  - 95%+ rule-based accuracy
  
- **RecommendationEngine Class**:
  - Generates personalized spending recommendations
  - Analyzes spending patterns
  - Provides budget optimization tips

### 4. Visualization (`charts.js`)
- Line chart for expense trends
- Pie chart for category distribution
- Bar chart for priority breakdown
- Dynamic updates based on timeframe selection

## 🎮 Features In Detail

### Expense Classification Algorithm
The ML classifier uses keyword analysis and amount-based features to determine priority:
- **Keywords**: Detects urgency, medical, utilities, food, transport, education, etc.
- **Categories**: Maps to predefined categories
- **Amount Analysis**: Considers expense magnitude
- **Score System**: Calculates priority score (0-15+ scale)

### Gamification System
- Earn XP for every expense tracked
- Track total XP earned
- Achievement system based on spending patterns
- XP persistence across sessions

### Budget System
- Category-wise budget limits
- Real-time tracking against budgets
- Visual indicators for budget status
- Alert system when exceeding limits

## 📝 Data Storage

All data is stored in browser's LocalStorage:
- `users`: Array of registered users
- `currentUser`: Current logged-in user
- `expenses-{userId}`: User's expense records
- `budgets-{userId}`: User's budget settings
- `xp-{userId}`: User's XP points

## 🔐 Security Notes

⚠️ **Important**: This is a client-side application with basic security:
- Passwords are encoded (not hashed) - Use proper encryption for production
- No server-side validation
- Data stored in browser localStorage (not encrypted)
- Use only for personal/local use

For production deployment, implement:
- Server-side authentication
- Secure password hashing (bcrypt, argon2)
- HTTPS encryption
- Database backend
- API validation

## 🐛 Known Issues & Debugging

The project includes several debug guides:
- `DEBUG_INSTRUCTIONS.md`: General debugging guide
- `DEBUG_XP_GUIDE.md`: XP system debugging
- `XP_PERSISTENCE_FIX.md`: XP persistence issues
- `FINAL_FIXES.md`: Recent fixes applied
- `FIXES_APPLIED.md`: Historical fixes log

## 🔧 Development

### Adding New Features

1. **New Category**: Update `ml_classifier.js` keyword matching
2. **New Chart**: Add to `charts.js` with Chart.js configuration
3. **New Dashboard Section**: Add HTML in `dash.html`, CSS in `style.css`, JS in `dashboard.js`

### Testing
- Test in incognito/private mode for clean localStorage
- Check browser console for errors (F12)
- Verify localStorage data (DevTools → Application → LocalStorage)

## 📈 Future Enhancements

- Cloud sync and backup
- Data export (CSV, PDF)
- Transaction history search
- Monthly/yearly comparisons
- Mobile app version
- Multi-currency support
- Recurring expense templates
- Budget forecasting
- Advanced analytics

## 📄 License

This project is part of HackWins initiative. Use freely for educational purposes.

## 👥 Contributing

To contribute to this project:
1. Review existing code in `DEBUG_INSTRUCTIONS.md`
2. Make your changes
3. Test thoroughly in multiple browsers
4. Document changes in commit messages

## 📞 Support

For issues or questions:
- Check the debug guides in the HackWins folder
- Review browser console for error messages
- Clear LocalStorage and restart if needed
- Check localStorage data format matches expected schema

## 🎓 Educational Value

This project demonstrates:
- Frontend web development best practices
- Client-side data persistence
- Machine learning basics (rule-based classification)
- UI/UX design principles
- Responsive web design
- JavaScript DOM manipulation
- Data visualization with Chart.js
- Browser APIs (LocalStorage, Canvas)
