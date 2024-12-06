# CSC-307-TA

CSC 307 Team Assignment: Arian Houshmand, Trey Martin, Sameer Nadeem, Duy Nguyen, Austin Voong


**Project Blurb:**

Our Project is the Task Arena. TaskArena is a gamified task management application designed for students and career-focused individuals. It helps users plan, track, and complete their daily tasks while earning points for each accomplishment. Users can monitor their progress, set priorities for tasks, and compete globally via a leaderboard. Features include task creation and tracking, calendar integration for rescheduling, and a robust authentication system. Unlike conventional task management tools like Apple’s Reminder, TaskArena adds a fun and competitive edge to productivity by incorporating gamification.

Project Vision: For students and career focused individuals who need to plan and record their daily tasks. The TaskArena is a To-Do List that allows an indiviual to track the tasks they have to complete. Our product will gamify completing tasks by rewarding points with a global leader board. 


**UI Prototype:**
Last Updated: 11/20/2024
Link to figma: https://www.figma.com/proto/KIxwDEJ3UhFwIYnl9dSTUG/treymartin.wv's-team-library?node-id=3318-2&starting-point-node-id=3318%3A2&scaling=contain&content-scaling=fixed

Link to picture of figma in docs: https://github.com/TaskMasters307/CSC307-TA/blob/main/docs/figma_UI_prototypes.png 

**Development Environment Set Up:**

To get started:

    1. git clone https://github.com/austinvoong/CSC-307-TA
    2. cd CSC-307-TA
    3. git checkout -b <your branch name>

To install dependencies:

    1. npm install
    2. npm install react react-dom
    3. npm install -g nodemon
    4. npm install express
    5. npm install mongoose
    6. npm install cors

To install prettier: # Prettier is our styler of choice

    1. On VSCode, install the Prettier extension
    2. Ensure Prettier is set as default formatter
    3. To automatically format code, ctrl + shift + f (Windows) and cmd + shift + p -> Format Document (Mac)
    4. To automatically format all files, use npx prettier . --write
    5. npm install --save-dev prettier, this will ensure all contributors are using the same version of Prettier

To install ESLint 1. npm init @eslint/config@latest 2. To use ESLint on any file or directory: npx eslint filename.js

Style guide, please follow this when writing your code!

    1. React/JSX: https://airbnb.io/javascript/react/

Submitting code:

    1. Ensure all code properly works and passes tests
    2. Ensure all code is properly formatted using Prettier and the above style guide
    3. git add <>
    4. git commit -m ""
    5. git push origin <your branch name>

If you want to run code locally:
    1. Go to packages/frontend/src/components/env.jsx 
    2. Change deployment to false
    3. Once you are ready to commit and push to deploy, change back to true

**UML Class Diagram:**
Last Updated: 11/05/2024

Link to diagram: https://drive.google.com/file/d/1jX6iP4qCyFg-Tok3iK1KulSrBmZrnmwZ/view

link to .io file in docs: https://github.com/TaskMasters307/CSC307-TA/blob/main/docs/taskarena.drawio

**Testing:**

We chose option 2 for testing. 

We tested the Calendar component of our React app, which is the most extensive component in the project. This component allows users to interact with a variety of elements, including navigating between months, selecting dates, and dragging and dropping tasks for rescheduling. It also features a color-coded task priority system.

The Calendar component was ideal for testing because it uses useState to manage internal states such as the currently selected date, the visible month, and task data. Additionally, it has at least three inputs or buttons: navigation arrows for changing months, date selection buttons, and a task rescheduling feature. We used Jest and React Testing Library to write tests that simulate user interactions such as clicking navigation arrows, selecting dates, and dragging tasks. Mock data was used to populate the calendar, ensuring that the tests reflected real-world usage scenarios. We also checked the component's state transitions and DOM updates to verify correctness.

Here is some examples of what we tested:
1. State Updates: Verified that navigation buttons correctly update the current month and selected date in the component's state.
2. Task Rescheduling: Ensured that dragging a task to a different date updates the task's associated date and state correctly.
3. Priority Display: Confirmed that task priority colors (e.g., high, medium, low) were rendered correctly based on task properties.

Bottom line: coverage of 93% 
Link to coverage:  https://github.com/TaskMasters307/CSC307-TA/blob/main/docs/CoverageReport.png

