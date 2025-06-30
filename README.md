# HTML/CSS/JS TODO App

A simple, TODO application built only with vanilla HTML, CSS, and JavaScript. This project will serve as a reference for the React application we will be building.

## 🎯 Purpose

This project is designed to teach React concepts by first showcasing a vanilla JavaScript application, and then converting it to React. It demonstrates:

- **Component-like thinking** - Modular HTML structure
- **State management** - JavaScript objects and arrays
- **Event handling** - DOM event listeners
- **Conditional rendering** - Show/hide elements based on state
- **Data persistence** - localStorage integration

## ✨ Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete individual tasks
- ✅ Filter tasks (All, Active, Completed)
- ✅ Clear all completed tasks
- ✅ Task counter
- ✅ Local storage persistence
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Empty state handling

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding tasks!

No build process or dependencies required - just open and use!

## 📁 Project Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Application logic and DOM manipulation
└── README.md       # This file
```

## 🎓 Teaching Notes

### Key Concepts Demonstrated

1. **DOM Manipulation**
   - `document.getElementById()`, `createElement()`, `appendChild()`
   - Event listeners and handlers

2. **State Management**
   - Global state object (`todos` array)
   - State updates trigger re-renders

3. **Component-like Structure**
   - `createTodoElement()` function acts like a component
   - Reusable, parameterized element creation

4. **Data Flow**
   - Unidirectional data flow from state to UI
   - User actions update state, which updates UI

5. **Event Handling**
   - Multiple event types (click, keypress, input)
   - Event delegation patterns

6. **Conditional Rendering**
   - Show/hide elements based on state
   - Dynamic class names and content

### React Migration Path

When converting to React, these concepts map to:

- **DOM Manipulation** → JSX and Virtual DOM
- **Global State** → useState/useReducer hooks
- **Manual Re-rendering** → Automatic re-rendering
- **Event Listeners** → JSX event props
- **createTodoElement()** → React components

## 🛠️ Development Features

### Demo Data
Open browser console and run `addDemoData()` to populate with sample tasks.

### Clear All
Run `clearAllTodos()` in console to reset the app.


## 🔄 React Conversion Plan

1. **Setup** - Create React app with Vite
2. **Components** - Convert HTML sections to React components
3. **State** - Replace global variables with useState
4. **Events** - Convert DOM events to React event handlers
5. **Effects** - Use useEffect for localStorage and effects like sending API requests
6. **Props** - Pass data between components
