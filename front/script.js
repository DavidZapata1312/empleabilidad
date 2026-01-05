const API_URL = 'http://localhost:3000/api';

// --- Auth Helpers ---

function getToken() {
    return localStorage.getItem('accessToken');
}

function setToken(token) {
    localStorage.setItem('accessToken', token);
}

function removeToken() {
    localStorage.removeItem('accessToken');
}

function isLoggedIn() {
    return !!getToken();
}

function getAuthHeaders() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function logout() {
    removeToken();
    window.location.href = 'login.html';
}

function updateNav() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    if (isLoggedIn()) {
        const user = parseJwt(getToken());
        let links = '<a href="#" onclick="logout()">Logout</a>';
        if (user.role === 'ADMIN' || user.role === 'GESTOR') {
            links = `<a href="dashboard.html">Dashboard</a> ` + links;
        }
        navAuth.innerHTML = links;
    } else {
        navAuth.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// --- API Wrappers ---

async function fetchJson(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Optional: auto-logout on 401, but maybe not if we are just checking something
        // removeToken();
        // window.location.href = 'login.html';
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// --- Page Logic ---

// Login Page
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');

        try {
            const data = await fetchJson('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            setToken(data.accessToken);
            window.location.href = 'index.html';
        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.style.display = 'block';
        }
    });
}

// Register Page
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value; // Added role selection for demo purposes, backend might restrict
        const errorDiv = document.getElementById('error-message');

        try {
            await fetchJson('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role }), // Sending role if backend accepts it
            });
            window.location.href = 'login.html';
        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.style.display = 'block';
        }
    });
}

// Index Page (Vacancies)
if (document.getElementById('vacancy-list')) {
    updateNav();
    loadVacancies();
}

async function loadVacancies() {
    const list = document.getElementById('vacancy-list');
    list.innerHTML = '<p>Loading vacancies...</p>';

    try {
        const vacancies = await fetchJson('/vacancies');
        list.innerHTML = '';

        if (vacancies.length === 0) {
            list.innerHTML = '<p>No vacancies found.</p>';
            return;
        }

        vacancies.forEach(vacancy => {
            const card = document.createElement('div');
            card.className = 'vacancy-card';
            // Adjust fields based on actual vacancy DTO
            card.innerHTML = `
        <div class="vacancy-header">
          <h3 class="vacancy-title">${vacancy.title}</h3>
          <span class="vacancy-meta">${vacancy.company}</span>
        </div>
        <div class="vacancy-meta">
          <span>📍 ${vacancy.location}</span>
          <span>💼 ${vacancy.modality}</span>
          <span>⚡ ${vacancy.seniority}</span>
        </div>
        <p class="vacancy-description">${vacancy.description}</p>
        ${isLoggedIn() ? `<button class="btn-small" onclick="applyToVacancy('${vacancy.id}')">Apply Now</button>` : '<a href="login.html" class="btn-small" style="text-decoration:none; background-color: var(--primary-color); color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; display:inline-block;">Login to Apply</a>'}
      `;
            list.appendChild(card);
        });
    } catch (err) {
        list.innerHTML = `<p style="color: red">Error loading vacancies: ${err.message}. Make sure backend is running.</p>`;
    }
}

async function applyToVacancy(vacancyId) {
    if (!confirm('Are you sure you want to apply for this position?')) return;

    try {
        await fetchJson('/applications', {
            method: 'POST',
            body: JSON.stringify({ vacancyId }),
        });
        alert('Application submitted successfully!');
    } catch (err) {
        alert(`Failed to apply: ${err.message}`);
    }
}

// Dashboard Page
if (document.getElementById('dashboard-container')) {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    } else {
        updateNav(); // Update nav for dashboard page too
        loadDashboard();
    }
}

async function loadDashboard() {
    const user = parseJwt(getToken());
    document.getElementById('user-name').textContent = user.email;
    document.getElementById('user-role').textContent = user.role;

    if (user.role === 'ADMIN' || user.role === 'GESTOR') {
        document.getElementById('admin-controls').classList.remove('hidden');
        loadMyVacancies();
        loadTechnologies();
    } else {
        document.getElementById('coder-controls').classList.remove('hidden');
    }
}

async function loadTechnologies() {
    try {
        const technologies = await fetchJson('/technologies');
        const select = document.getElementById('vacancy-technologies');
        select.innerHTML = ''; // clear mock options

        technologies.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech.id;
            // Assuming tech object has 'name' property
            option.textContent = tech.name || 'Unknown Tech';
            select.appendChild(option);
        });
    } catch (e) {
        console.error('Error loading technologies:', e);
    }
}

async function loadMyVacancies() {
    // Ideally backend has DELETE endpoint. Re-using findAll for now but filtering in client?
    // Actually backend findOne/update/remove exists.
    // We will just show all vacancies for Admin/Gestor to manage
    const list = document.getElementById('admin-vacancy-list');
    const vacancies = await fetchJson('/vacancies');
    list.innerHTML = '';
    vacancies.forEach(v => {
        const li = document.createElement('div');
        li.className = 'vacancy-card';
        li.innerHTML = `
        <div class="vacancy-header">
            <h4>${v.title}</h4>
            <button class="btn-small" style="background-color: var(--error-color)" onclick="deleteVacancy('${v.id}')">Delete</button>
        </div>
       `;
        list.appendChild(li);
    });
}

async function handleCreateVacancy(e) {
    e.preventDefault();
    const form = e.target;
    // Collect data
    const technologies = Array.from(form.technologies.selectedOptions).map(o => o.value);

    // Hardcoded logic for demo since form is simple
    const data = {
        title: document.getElementById('v-title').value,
        description: document.getElementById('v-description').value,
        seniority: document.getElementById('v-seniority').value,
        softSkills: document.getElementById('v-softSkills').value,
        location: document.getElementById('v-location').value,
        modality: document.getElementById('v-modality').value,
        salaryRange: document.getElementById('v-salary').value,
        company: document.getElementById('v-company').value,
        maxApplicants: parseInt(document.getElementById('v-max').value),
        technologies: technologies // use collected values
    };

    try {
        await fetchJson('/vacancies', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        alert('Vacancy Created');
        loadMyVacancies();
        form.reset();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteVacancy(id) {
    if (!confirm('Delete?')) return;
    try {
        await fetchJson(`/vacancies/${id}`, { method: 'DELETE' });
        loadMyVacancies();
    } catch (err) {
        alert(err.message);
    }
}
