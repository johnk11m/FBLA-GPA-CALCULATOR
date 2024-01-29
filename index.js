document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();

    setupEventListeners();

    var introModal = M.Modal.init(document.getElementById('introModal'));
    introModal.open();
});

const maxCourses = 15;
let unweightedCourses = 0;
let weightedCourses = 0;

function setupEventListeners() {
    document.getElementById("calculateUnweighted").addEventListener("click", calculateTotalGPA);
    document.getElementById("calculateWeighted").addEventListener("click", calculateTotalWeightedGPA);
    document.querySelector(".add-Course").addEventListener("click", addCourseInputFields);
}

function addCourseInputFields() {
    var courseContainer = document.getElementById("courseContainer");

    var newCourseDiv = document.createElement("div");
    newCourseDiv.classList.add("row");
    newCourseDiv.innerHTML = `
        <span class="add-course"></span>
        <div class="col s6">
            <div class="card-panel blue">
                <input class="white-text course-name-input" placeholder="Course Name" type="text">
            </div>
        </div>
        <div class="col s2">
            <div class="card-panel blue">
                <div class="input-field">
                    <select class="white-text credits-select">
                        <option value="" disabled selected>Choose Credits</option>
                        <option value="0.5" class="white-text">0.5</option>
                        <option value="1" class="white-text">1</option>
                    </select>
                    <label class="white-text">Credits</label>
                </div>
            </div>
        </div>
        <div class="col s4">
            <div class="card-panel blue">
                <div class="input-field">
                    <select class="white-text grade-select">
                        <option value="" disabled selected>Choose Your Grade</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="C-">C-</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="D-">D-</option>
                        <option value="F">F</option>
                    </select>
                    <label class="white-text">Choose Your Grade</label>
                </div>
            </div>
        </div>
    `;

    var activeTab = getActiveTab();

    if (activeTab === 'unweightedTab') {
        if (unweightedCourses >= maxCourses) {
            M.toast({ html: 'You can only add up to 15 courses in Unweighted GPA.', classes: 'red' });
            return;
        }
        courseContainer.querySelector(`#${activeTab}`).appendChild(newCourseDiv);
        unweightedCourses++;
    } else if (activeTab === 'weightedTab') {
        if (weightedCourses >= maxCourses) {
            M.toast({ html: 'You can only add up to 15 courses in Weighted GPA.', classes: 'red' });
            return;
        }
        courseContainer.querySelector(`#${activeTab}`).appendChild(newCourseDiv);
        weightedCourses++;
    }

    M.AutoInit();

    var newCreditsSelect = newCourseDiv.querySelector('.credits-select');
    newCreditsSelect.addEventListener('change', activeTab === 'unweightedTab' ? calculateTotalGPA : calculateTotalWeightedGPA);

    var toastContent = document.createElement("div");
    toastContent.innerHTML = `<span>Course added successfully!</span><button class='btn-flat toast-action' onclick='undoAddCourse("${activeTab}")'>Undo</button>`;
    M.toast({ html: toastContent, classes: 'green', displayLength: 1500 });
}

function undoAddCourse(tab) {
    if (tab === 'unweightedTab') {
        unweightedCourses--;
    } else if (tab === 'weightedTab') {
        weightedCourses--;
    }

    var courseContainers = document.querySelectorAll(`#${tab} .row`);
    if (courseContainers.length > 0) {
        courseContainers[courseContainers.length - 1].remove();
    }

    M.toast({ html: 'Course removed.', classes: 'orange' });
}

function getActiveTab() {
    var tabs = document.querySelectorAll('.tabs');
    var activeTab;

    tabs.forEach(function (tab) {
        if (tab.querySelector('li.tab a.active')) {
            activeTab = tab.querySelector('li.tab a.active').getAttribute('href').substring(1);
        }
    });

    return activeTab;
}

function calculateTotalGPA() {
    var courseContainers = document.querySelectorAll('#unweightedTab .row');
    var totalGradePoints = 0;
    var totalCredits = 0;

    courseContainers.forEach(function (courseContainer) {
        var creditsSelect = courseContainer.querySelector('.credits-select');
        var selectedGradeSelect = courseContainer.querySelector('.grade-select');
        
        var credits = parseFloat(creditsSelect.value);
        var selectedGrade = selectedGradeSelect.value;

        var gradePoints = calculateUnweightedGradePoints(selectedGrade);
        totalGradePoints += gradePoints * credits;
        totalCredits += credits;
    });

    var totalGPA = (totalGradePoints / totalCredits).toFixed(2);
    document.getElementById("totalGPA").textContent = isNaN(totalGPA) ? '-' : totalGPA;
    
}

function calculateTotalWeightedGPA() {
    var courseContainers = document.querySelectorAll('#weightedTab .row');
    var totalGradePoints = 0;
    var totalCredits = 0;

    courseContainers.forEach(function (courseContainer) {
        var creditsSelect = courseContainer.querySelector('.credits-select');
        var selectedGradeSelect = courseContainer.querySelector('.grade-select');

        var credits = parseFloat(creditsSelect.value);
        var selectedGrade = selectedGradeSelect.value;

        var gradePoints = calculateWeightedGradePoints(selectedGrade);
        totalGradePoints += gradePoints * credits;
        totalCredits += credits;
    });

    var totalWeightedGPA = (totalGradePoints / totalCredits).toFixed(2);
    document.getElementById("totalWeightedGPA").textContent = isNaN(totalWeightedGPA) ? '-' : totalWeightedGPA;
}
//-------Unweighted Grading Standards---------//
function calculateUnweightedGradePoints(grade) {
    switch (grade) {
        case 'A':
            return 4.0;
        case 'A-':
            return 3.67;
        case 'B+':
            return 3.33;
        case 'B':
            return 3.0;
        case 'B-':
            return 2.67;
        case 'C+':
            return 2.33;
        case 'C':
            return 2.0;
        case 'C-':
            return 1.67
        case 'D+':
            return 1.33;
        case 'D-':
            return 0.67;
        case 'F':
            return 0.0;
        default:
            return 0.0;
    }
}
//-----Weighted Grading Standards------//
function calculateWeightedGradePoints(grade) {
    switch (grade) {
        case 'A':
            return 5.0;
        case 'A-':
            return 4.67;
        case 'B+':
            return 4.33;
        case 'B':
            return 4.0;
        case 'B-':
            return 3.67;
        case 'C+':
            return 3.33;
        case 'C':
            return 3.0;
        case 'C-':
            return 2.67
        case 'D+':
            return 2.33;
        case 'D':
            return 2.0;
        case 'D-':
            return 1.67;
        case 'F':
            return 0.0;
        default:
            return 0.0;
    }
}






    


