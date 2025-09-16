
<body class="mobile-first body">

   <div class="date-grid-container">
        <h2 class="grid-title">Select Event Date</h2>
        <ul class="date-grid">
            <li class="date-item" data-date="2024-11-08">
                November 8, 2024
                <button class="vote-button yes">Yes</button>
                <button class="vote-button maybe">Maybe</button>
                <button class="vote-button no">No</button>
            </li>
            <li class="date-item" data-date="2024-11-09">
                November 9, 2024
                <button class="vote-button yes">Yes</button>
                <button class="vote-button maybe">Maybe</button>
                <button class="vote-button no">No</button>
            </li>
            <li class="date-item" data-date="2024-11-10">
                November 10, 2024
                <button class="vote-button yes">Yes</button>
                <button class="vote-button maybe">Maybe</button>
                <button class="vote-button no">No</button>
            </li>
        </ul>
    </div>

</body>

<style>
/* Mobile First - Base Styles */
.body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
}

.date-grid-container {
    padding: 20px;
    border: 1px solid #ccc;
    margin: 20px;
    max-width: 960px; /* Limit the width on larger screens */
    margin: 0 auto; /* Center the container */
}

.date-grid-container h2 {
    text-align: center;
}

.date-grid {
    list-style: none;
    padding: 0;
    display: flex; /* Use flexbox for the entire grid */
    flex-wrap: wrap; /* Allow items to wrap to the next line */
    gap: 20px;
}

.date-item {
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
}

.date-item button {
    padding: 8px 12px;
    border: none;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    margin-bottom: 5px;
}

.date-item button:hover {
    background-color: #3e8e41;
}

</style>