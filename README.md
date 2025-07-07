# Task Board Application

A task management application built with pure HTML, CSS, and JavaScript. This project serves as a reference implementation for teaching React.

This simplified, list-only approach demonstrates several important concepts that will carry over to React:

- **Conditional Rendering**: Showing/hiding completed tasks
- **State Management**: Tracking task data and completion status
- **Handling Events**: Button clicks for task actions
- **Rendering Lists**: Dynamic task list generation
- **Component Thinking**: How to break down UI into logical pieces

## Features

### Core Functionality
- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Due date tracking with visual indicators
- ✅ Real-time search functionality
- ✅ Responsive design for all screen sizes
- ✅ Filter for completed tasks

### UI/UX
- ✅ Clean, modern interface matching the design reference
- ✅ Hover effects and smooth transitions
- ✅ Color-coded due dates (overdue vs upcoming)
- ✅ Professional typography and spacing
- ✅ Accessible form controls

## Project Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styling and responsive design
├── script.js           # JavaScript functionality and interactions
└── README.md           # Project documentation
```

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Start creating and managing tasks!

### Local Development

For a better development experience, you can serve the files using a local server:

```bash
# Using Python 3
python -m http.server 3000

# Using Node.js (if you have http-server installed)
npx http-server -p 3000

# Using PHP
php -S localhost:3000
```

Then open `http://localhost:3000` in your browser.

## Key Learning Concepts (for React)

This project demonstrates several concepts that are fundamental to React development:

### 1. Component-Based Architecture
- The sidebar, header, task cards, and modal are structured as reusable components
- Each section has its own styling and functionality

### 2. State Management
- Task data is managed in a central `TaskBoard` class
- State changes trigger UI re-renders
- Demonstrates the concept of single source of truth

### 3. Event Handling
- Click events, form submissions, keyboard shortcuts
- Event delegation and binding patterns
- Shows how React's synthetic events improve on native events

### 4. Conditional Rendering
- Tasks display different styles based on completion status
- Due dates show different colors based on urgency
- Modal visibility toggling

### 5. List Rendering and Keys
- Dynamic task list generation
- Demonstrates why unique keys are important for list items

### 6. Form Handling
- Controlled form inputs
- Form validation and submission
- State updates from form data

### 7. Lifecycle Concepts
- Initialization and cleanup
- Event listener management
- Component mounting and unmounting patterns


## Future Enhancements

Ideas for extending this project:

- [ ] Local storage persistence
- [ ] Task categories and filtering
- [ ] Due date reminders
- [ ] Task priority levels
- [ ] Collaborative features
- [ ] Dark mode toggle
- [ ] Keyboard navigation
- [ ] Accessibility improvements

## React Migration Guide

1. **Components**: Convert HTML sections to React components
2. **State**: Use `useState` hooks for task management
3. **Effects**: Use `useEffect` for side effects and lifecycle
4. **Events**: Convert to React event handlers
5. **Styling**: Migrate to CSS modules or styled-components
6. **Forms**: Use controlled components
7. **Lists**: Add proper keys and use map functions
