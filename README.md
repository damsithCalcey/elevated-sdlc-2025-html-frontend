# HTML/CSS/JS Task Board Application

A task board application built only with vanilla HTML, CSS, and JavaScript. This project will serve as a reference for the React application we will be building.

## 🎯 Purpose

This project is designed to teach React concepts by first showcasing a vanilla JavaScript application, and then converting it to React. It demonstrates:

- **Component-like thinking** - Modular HTML structure
- **State management** - JavaScript objects and arrays
- **Event handling** - DOM event listeners
- **Conditional rendering** - Show/hide elements based on state
- **Data persistence** - localStorage integration
- **Drag & Drop functionality** - Interactive task management
- **Modal dialogs** - Complex UI interactions

## ✨ Features

- ✅ **Kanban Board Layout** - Four-column task board (Backlog, To Do, In Process, Done)
- ✅ **Drag & Drop** - Move tasks between columns
- ✅ **Task Management** - Add, edit, delete tasks
- ✅ **Rich Task Cards** - Assignees, priorities, categories, comments, attachments
- ✅ **Search & Filter** - Find tasks quickly
- ✅ **Sidebar Navigation** - Project organization
- ✅ **Modal Interfaces** - Clean task creation/editing
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Local Storage** - Persistent data
- ✅ **Smooth Animations** - Polished user experience
- ✅ **Demo Data** - Pre-populated examples
- ✅ **Real-time Updates** - Task counts and status updates

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding tasks!

No build process or dependencies required - just open and use!

## 📁 Project Structure

```
├── index.html      # Main HTML structure with sidebar, header, and kanban board
├── styles.css      # Complete styling including responsive design and animations
├── script.js       # Application logic, drag & drop, and data management
└── README.md       # This file
```

## 🎓 Teaching Notes

### Key Concepts Demonstrated

1. **Advanced DOM Manipulation**
   - Dynamic component creation (`createTaskElement()`)
   - Event delegation and complex event handling
   - Drag and drop API implementation

2. **Sophisticated State Management**
   - Global application state (`TaskBoard` class)
   - Complex data structures (tasks with assignees, metadata)
   - State synchronization across multiple UI components

3. **Component-like Architecture**
   - `TaskBoard` class as main application controller
   - Modular methods for rendering different UI sections
   - Reusable component patterns

4. **Advanced Event Handling**
   - Mouse events (drag/drop, click, hover)
   - Keyboard shortcuts and accessibility
   - Form submission and validation
   - Modal interactions

5. **Data Flow & Architecture**
   - Unidirectional data flow
   - Separation of concerns (data, UI, events)
   - Local storage integration with complex data

6. **UI/UX Patterns**
   - Modal dialogs and overlays
   - Real-time search and filtering
   - Loading states and animations
   - Responsive navigation and layout

### React Migration Path

When converting to React, these concepts map to:

- **TaskBoard Class** → React App component with hooks
- **DOM Manipulation** → JSX and Virtual DOM
- **Global State** → useState/useReducer + Context API
- **Manual Re-rendering** → Automatic re-rendering with state changes
- **Event Listeners** → JSX event props
- **createTaskElement()** → TaskCard React component
- **Drag & Drop** → React DnD library or native hooks
- **Modal System** → React Portal + Modal component
- **Local Storage** → useEffect with localStorage

## 🛠️ Development Features

### Demo Data
Open browser console and run `addDemoData()` to populate with sample tasks.

### Clear All
Run `clearAllTasks()` in console to reset the app.

### Export Tasks
Run `exportTasks()` to download tasks as JSON file.

### Task Statistics
Run `getTaskStats()` to view detailed task analytics.

### Available Console Commands
- `addDemoData()` - Load demo tasks
- `clearAllTasks()` - Clear all tasks  
- `exportTasks()` - Export tasks to JSON
- `getTaskStats()` - View task statistics


## 🚀 Advanced Functionality

### Drag & Drop
- Native HTML5 drag and drop API
- Visual feedback during drag operations
- Cross-column task movement
- Automatic state updates

### Search & Filter
- Real-time search across task titles, descriptions, and categories
- Instant results with no page refresh
- Keyboard shortcut support (Ctrl+K)

### Modal System
- Overlay-based task creation
- Form validation and error handling
- Keyboard navigation support
- Click-outside-to-close functionality

### Data Persistence
- Automatic localStorage integration
- JSON-based data export/import capability
- Preserved state across browser sessions

## 🔄 React Conversion Plan

1. **Setup** - Create React app with Vite
2. **Component Architecture** - Break down into TaskBoard, TaskCard, Sidebar, Modal components  
3. **State Management** - Replace TaskBoard class with React hooks and Context API
4. **Event System** - Convert DOM events to React event handlers
5. **Effects & Side Effects** - Use useEffect for localStorage, search, and data fetching
6. **Props & Component Communication** - Pass data and callbacks between components
7. **Custom Hooks** - Extract reusable logic (useLocalStorage, useDragDrop)
8. **React Libraries** - Integrate React DnD for drag & drop, React Router for navigation
9. **Performance** - Add React.memo, useMemo, useCallback optimizations
10. **Testing** - Add Jest and React Testing Library tests
