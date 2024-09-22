const habitForm = document.getElementById('habitForm');
const habitInput = document.getElementById('habitInput');
const habitList = document.getElementById('habitList');
const progress = document.getElementById('progress');
const checkInButton = document.getElementById('checkInButton');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Load existing habits and check for daily check-in
updateHabitList();
checkForCheckIn();

// Form submission event
habitForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const habit = { name: habitInput.value, completed: false, priority: 'Medium' };
    habits.push(habit);
    localStorage.setItem('habits', JSON.stringify(habits));
    habitInput.value = '';
    updateHabitList();
    updateProgress();
});

// Daily check-in event
checkInButton.addEventListener('click', function() {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    localStorage.setItem('lastCheckIn', today);
    alert('Checked in for today!');
});

// Check for daily check-in
function checkForCheckIn() {
    const lastCheckIn = localStorage.getItem('lastCheckIn');
    const today = new Date().toISOString().split('T')[0];

    if (lastCheckIn !== today) {
        // Schedule a reminder (pseudocode)
        console.log("Reminder: Don't forget to check in!");
    }
}

// Function to update and display the entire habit list
function updateHabitList() {
    habitList.innerHTML = ''; // Clear the existing list
    const sortedHabits = sortHabitsByPriority();
    sortedHabits.forEach(habit => addHabitToList(habit));
}

// Function to add a habit to the list
function addHabitToList(habit) {
    const listItem = document.createElement('li');
    listItem.textContent = habit.name;

    const completeButton = document.createElement('button');
    completeButton.textContent = '✓';
    completeButton.onclick = () => {
        habit.completed = !habit.completed;
        localStorage.setItem('habits', JSON.stringify(habits));
        updateProgress();
        listItem.classList.toggle('completed', habit.completed);
    };

    const priorityButton = document.createElement('button');
    priorityButton.textContent = `Priority: ${habit.priority}`;
    priorityButton.onclick = () => changePriority(habit, priorityButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✖';
    deleteButton.onclick = () => deleteHabit(habit, listItem);

    listItem.appendChild(completeButton);
    listItem.appendChild(priorityButton);
    listItem.appendChild(deleteButton);
    habitList.appendChild(listItem);
}

// Function to sort habits by priority
function sortHabitsByPriority() {
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    return habits.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// Function to change a habit's priority
function changePriority(habit, button) {
    const priorities = ['Low', 'Medium', 'High'];
    let currentPriorityIndex = priorities.indexOf(habit.priority);
    currentPriorityIndex = (currentPriorityIndex + 1) % priorities.length; // Cycle through priorities
    habit.priority = priorities[currentPriorityIndex];
    localStorage.setItem('habits', JSON.stringify(habits));
    button.textContent = `Priority: ${habit.priority}`; // Update button text

    updateHabitList(); // Re-render sorted habits
}

// Function to delete a habit
function deleteHabit(habit, listItem) {
    habits = habits.filter(h => h !== habit);
    localStorage.setItem('habits', JSON.stringify(habits));
    updateHabitList(); // Re-render the entire list
}

// Function to update progress
function updateProgress() {
    const completedCount = habits.filter(h => h.completed).length;
    const totalCount = habits.length;
    progress.textContent = `Completed: ${completedCount} out of ${totalCount}`;
}
