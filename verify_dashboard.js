const API_URL = 'http://localhost:3000/api';

async function verifyDashboard() {
    console.log('1. Logging in as Admin...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        process.exit(1);
    }

    const { accessToken } = await loginRes.json();
    console.log('Login successful. Token obtained.');

    // Verify token has role (simulating frontend decode)
    const parts = accessToken.split('.');
    const payload = JSON.parse(atob(parts[1]));
    console.log('Token Role:', payload.role);

    if (payload.role !== 'ADMIN') {
        console.error('Token does not have ADMIN role');
        process.exit(1);
    }

    // Simulate Dashboard Load Vacancies
    console.log('2. Fetching Vacancies (Dashboard View)...');
    const listRes = await fetch(`${API_URL}/vacancies`);
    const vacancies = await listRes.json();
    console.log(`Found ${vacancies.length} vacancies.`);

    // Simulate Create from Dashboard
    console.log('3. Creating Vacancy via Dashboard API call...');
    const crypto = require('crypto');
    const techId = crypto.randomUUID();

    const vacancyData = {
        title: 'Dashboard Vacancy',
        description: 'Created via dashboard verification',
        seniority: 'Junior',
        softSkills: 'Learning',
        location: 'Office',
        modality: 'ONSITE',
        salaryRange: '800-1200',
        company: 'Dash Corp',
        maxApplicants: 5,
        technologies: [techId]
    };

    const createRes = await fetch(`${API_URL}/vacancies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(vacancyData)
    });

    if (!createRes.ok) {
        console.error('Create vacancy failed:', await createRes.text());
        process.exit(1);
    }

    console.log('Vacancy created successfully via Dashboard flow.');
    console.log('Verification PASSED!');
}

verifyDashboard();
