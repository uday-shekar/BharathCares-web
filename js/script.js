// --- Users Data (stored in localStorage for persistence) ---
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = {
            admin: { id: "admin", password: "admin123" },
            employees: [
                { name: "raja", id: "emp01", password: "1234", status: "offline", work: [] },
                { name: "suresh", id: "emp02", password: "abcd", status: "offline", work: [] }
            ]
        };
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users'));
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentEmployee() {
    return localStorage.getItem('currentEmployee');
}

function setCurrentEmployee(empId) {
    localStorage.setItem('currentEmployee', empId);
}

// Initialize on page load
initializeUsers();

// --- Login Page Functions ---
const adminBtn = document.getElementById("adminBtn");
const employeeBtn = document.getElementById("employeeBtn");
const studentBtn = document.getElementById("studentBtn");
const loginForm = document.getElementById("loginForm");
const loginTitle = document.getElementById("loginTitle");
const loginSubmit = document.getElementById("loginSubmit");
const loginError = document.getElementById("loginError");

let selectedUserType = "";

if (adminBtn) {
    adminBtn.onclick = () => {
        selectedUserType = "admin";
        loginForm.style.display = "block";
        loginTitle.innerText = "Admin Login";
        loginError.innerText = "";
    };
}

if (employeeBtn) {
    employeeBtn.onclick = () => {
        selectedUserType = "employee";
        loginForm.style.display = "block";
        loginTitle.innerText = "Employee Login";
        loginError.innerText = "";
    };
}

if (studentBtn) {
    studentBtn.onclick = () => {
        alert("Student login will be implemented later.");
    };
}

function resetLoginForm() {
    loginForm.style.display = "none";
    document.getElementById("userId").value = "";
    document.getElementById("userPassword").value = "";
    loginError.innerText = "";
    selectedUserType = "";
}

if (loginSubmit) {
    loginSubmit.onclick = () => {
        const id = document.getElementById("userId").value;
        const password = document.getElementById("userPassword").value;
        const users = getUsers();

        if (selectedUserType === "admin") {
            if (id === users.admin.id && password === users.admin.password) {
                window.location.href = "admin.html";
            } else {
                loginError.innerText = "Invalid Admin Credentials!";
            }
        } else if (selectedUserType === "employee") {
            let emp = users.employees.find(e => e.id === id && e.password === password);
            if (emp) {
                setCurrentEmployee(emp.id);
                window.location.href = "employee.html";
            } else {
                loginError.innerText = "Invalid Employee Credentials!";
            }
        }
    };
}

// --- Admin Page Functions ---
function showEmployees() {
    document.getElementById("employeesSection").style.display = "block";
    document.getElementById("studentsSection").style.display = "none";
    document.querySelectorAll(".sidebar-btn")[0].classList.add("active");
    document.querySelectorAll(".sidebar-btn")[1].classList.remove("active");
    document.getElementById("createEmployeeForm").style.display = "none";
    loadEmployeeList();
}

function showStudents() {
    document.getElementById("employeesSection").style.display = "none";
    document.getElementById("studentsSection").style.display = "block";
    document.querySelectorAll(".sidebar-btn")[0].classList.remove("active");
    document.querySelectorAll(".sidebar-btn")[1].classList.add("active");
}

function loadEmployeeList() {
    const users = getUsers();
    const employeeList = document.getElementById("employeeList");
    employeeList.innerHTML = "";

    users.employees.forEach(emp => {
        const card = document.createElement("div");
        card.className = "employee-card";
        card.onclick = () => showEmployeeDetails(emp.id);
        
        const statusClass = emp.status === "active" ? "active" : "offline";
        const statusText = emp.status === "active" ? "Active" : "Offline";
        
        card.innerHTML = `
            <h4>${emp.name}</h4>
            <p><strong>Employee ID:</strong> ${emp.id}</p>
            <span class="employee-status ${statusClass}">${statusText}</span>
            <button class="delete-btn" onclick="event.stopPropagation(); deleteEmployee('${emp.id}')">Delete</button>
        `;
        
        employeeList.appendChild(card);
    });
}

function showEmployeeDetails(empId) {
    const users = getUsers();
    const emp = users.employees.find(e => e.id === empId);
    
    if (!emp) return;
    
    const modal = document.getElementById("employeeDetailsModal");
    const nameElement = document.getElementById("employeeDetailsName");
    const contentElement = document.getElementById("employeeDetailsContent");
    
    nameElement.textContent = `${emp.name} - Work Details`;
    
    if (emp.work && emp.work.length > 0) {
        let workHtml = `<div class="employee-details">`;
        workHtml += `<p><strong>Total Work Entries:</strong> ${emp.work.length}</p>`;
        workHtml += `<p><strong>Total Schools Visited:</strong> ${emp.work.length}</p>`;
        
        let totalStudents = 0;
        emp.work.forEach(work => {
            totalStudents += parseInt(work.studentsRegistered || 0);
        });
        workHtml += `<p><strong>Total Students Registered:</strong> ${totalStudents}</p>`;
        workHtml += `<hr style="margin: 20px 0;">`;
        
        emp.work.forEach((work, index) => {
            workHtml += `<div class="work-item">`;
            workHtml += `<h4>Day ${index + 1} - ${work.date || 'Date not specified'}</h4>`;
            workHtml += `<p><strong>School Name:</strong> ${work.schoolName}</p>`;
            workHtml += `<p><strong>Location:</strong> ${work.location}</p>`;
            if (work.picUrl) {
                workHtml += `<img src="${work.picUrl}" alt="School Picture" onerror="this.style.display='none'">`;
            }
            workHtml += `<p><strong>Students Registered:</strong> ${work.studentsRegistered || 0}</p>`;
            workHtml += `<p><strong>Number of Schools:</strong> ${work.numberOfSchools || 1}</p>`;
            if (work.workDescription) {
                workHtml += `<p><strong>Work Description:</strong> ${work.workDescription}</p>`;
            }
            workHtml += `</div>`;
        });
        
        workHtml += `</div>`;
        contentElement.innerHTML = workHtml;
    } else {
        contentElement.innerHTML = `<p>No work entries found for this employee.</p>`;
    }
    
    modal.style.display = "block";
}

function closeEmployeeDetails() {
    document.getElementById("employeeDetailsModal").style.display = "none";
}

function showCreateEmployee() {
    document.getElementById("createEmployeeForm").style.display = "block";
    document.getElementById("employeeListContainer").style.display = "none";
}

function cancelCreateEmployee() {
    document.getElementById("createEmployeeForm").style.display = "none";
    document.getElementById("employeeListContainer").style.display = "block";
    document.getElementById("newEmpName").value = "";
    document.getElementById("newEmpId").value = "";
    document.getElementById("newEmpPassword").value = "";
}

function createEmployee() {
    const name = document.getElementById("newEmpName").value;
    const id = document.getElementById("newEmpId").value;
    const password = document.getElementById("newEmpPassword").value;
    
    if (!name || !id || !password) {
        alert("Please fill all fields!");
        return;
    }
    
    const users = getUsers();
    
    // Check if employee ID already exists
    if (users.employees.find(e => e.id === id)) {
        alert("Employee ID already exists!");
        return;
    }
    
    users.employees.push({
        name: name,
        id: id,
        password: password,
        status: "offline",
        work: []
    });
    
    saveUsers(users);
    alert("Employee Created Successfully!");
    cancelCreateEmployee();
    loadEmployeeList();
}

function deleteEmployee(empId) {
    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }
    
    const users = getUsers();
    users.employees = users.employees.filter(e => e.id !== empId);
    saveUsers(users);
    loadEmployeeList();
    alert("Employee deleted successfully!");
}

// Load employee list when admin page loads
if (document.getElementById("employeeList")) {
    showEmployees();
}

// Update employee status periodically
setInterval(() => {
    if (document.getElementById("employeeList")) {
        loadEmployeeList();
    }
}, 2000);

// --- Employee Page Functions ---
const activeBtn = document.getElementById("activeBtn");
const statusIndicator = document.getElementById("statusIndicator");
const workEntryForm = document.getElementById("workEntryForm");

if (activeBtn) {
    activeBtn.onclick = () => {
        const currentEmpId = getCurrentEmployee();
        if (!currentEmpId) return;
        
        const users = getUsers();
        const emp = users.employees.find(e => e.id === currentEmpId);
        
        if (emp) {
            emp.status = "active";
            saveUsers(users);
            statusIndicator.textContent = "Active";
            statusIndicator.className = "status-indicator active";
        }
    };
}

if (workEntryForm) {
    workEntryForm.onsubmit = (e) => {
        e.preventDefault();
        
        const currentEmpId = getCurrentEmployee();
        if (!currentEmpId) {
            alert("Please login first!");
            return;
        }
        
        const users = getUsers();
        const emp = users.employees.find(e => e.id === currentEmpId);
        
        if (!emp) {
            alert("Employee not found!");
            return;
        }
        
        const workEntry = {
            date: document.getElementById("workDate").value || new Date().toISOString().split('T')[0],
            schoolName: document.getElementById("schoolName").value,
            location: document.getElementById("location").value,
            picUrl: document.getElementById("picUrl").value,
            studentsRegistered: document.getElementById("studentsRegistered").value || 0,
            numberOfSchools: document.getElementById("numberOfSchools").value || 1,
            workDescription: document.getElementById("workDescription").value
        };
        
        if (!emp.work) {
            emp.work = [];
        }
        
        emp.work.push(workEntry);
        saveUsers(users);
        
        alert("Work entry submitted successfully!");
        workEntryForm.reset();
        loadWorkHistory();
    };
}

function loadWorkHistory() {
    const currentEmpId = getCurrentEmployee();
    if (!currentEmpId) return;
    
    const users = getUsers();
    const emp = users.employees.find(e => e.id === currentEmpId);
    
    if (!emp || !emp.work) return;
    
    const workHistory = document.getElementById("workHistory");
    if (!workHistory) return;
    
    workHistory.innerHTML = "";
    
    if (emp.work.length === 0) {
        workHistory.innerHTML = "<p>No work history found.</p>";
        return;
    }
    
    emp.work.reverse().forEach((work, index) => {
        const item = document.createElement("div");
        item.className = "work-history-item";
        item.innerHTML = `
            <h4>${work.schoolName}</h4>
            <p><strong>Date:</strong> ${work.date || 'Not specified'}</p>
            <p><strong>Location:</strong> ${work.location}</p>
            ${work.picUrl ? `<img src="${work.picUrl}" alt="School Picture" onerror="this.style.display='none'">` : ''}
            <p><strong>Students Registered:</strong> ${work.studentsRegistered || 0}</p>
            <p><strong>Number of Schools:</strong> ${work.numberOfSchools || 1}</p>
            ${work.workDescription ? `<p><strong>Description:</strong> ${work.workDescription}</p>` : ''}
        `;
        workHistory.appendChild(item);
    });
}

// Set default date to today
if (document.getElementById("workDate")) {
    document.getElementById("workDate").value = new Date().toISOString().split('T')[0];
}

// Load work history when employee page loads
if (document.getElementById("workHistory")) {
    loadWorkHistory();
    
    // Check current status
    const currentEmpId = getCurrentEmployee();
    if (currentEmpId) {
        const users = getUsers();
        const emp = users.employees.find(e => e.id === currentEmpId);
        if (emp) {
            if (emp.status === "active") {
                statusIndicator.textContent = "Active";
                statusIndicator.className = "status-indicator active";
            } else {
                statusIndicator.textContent = "Offline";
                statusIndicator.className = "status-indicator offline";
            }
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("employeeDetailsModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Mobile Menu Toggle Function
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuToggle = document.querySelector(".menu-toggle");
    
    if (navLinks && menuToggle) {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");
    }
}

// Close mobile menu when clicking on a link
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.getElementById("navLinks");
    if (navLinks) {
        const links = navLinks.querySelectorAll("a");
        links.forEach(link => {
            link.addEventListener("click", function() {
                navLinks.classList.remove("active");
                const menuToggle = document.querySelector(".menu-toggle");
                if (menuToggle) {
                    menuToggle.classList.remove("active");
                }
            });
        });
    }
});

// Admin Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".sidebar-toggle-mobile");
    const overlay = document.querySelector(".sidebar-overlay");
    
    if (sidebar && toggleBtn) {
        sidebar.classList.toggle("active");
        toggleBtn.classList.toggle("active");
        if (overlay) {
            overlay.classList.toggle("active");
        }
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener("click", function(event) {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".sidebar-toggle-mobile");
    const overlay = document.querySelector(".sidebar-overlay");
    
    if (sidebar && toggleBtn && overlay && window.innerWidth <= 768) {
        if (event.target === overlay) {
            sidebar.classList.remove("active");
            toggleBtn.classList.remove("active");
            overlay.classList.remove("active");
        }
    }
});

// Close sidebar when clicking on sidebar menu items on mobile
document.addEventListener("DOMContentLoaded", function() {
    const sidebarBtns = document.querySelectorAll(".sidebar-btn");
    sidebarBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    toggleSidebar();
                }, 300);
            }
        });
    });
});
