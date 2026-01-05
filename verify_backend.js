const API_URL = 'http://localhost:3000/api';

async function verify() {
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

    /* Technologies endpoint returns string, so we mock a UUID */
    // const techRes = await fetch(`${API_URL}/technologies`);
    const crypto = require('crypto');
    const techId = crypto.randomUUID();
    console.log('Using Mock Technology ID:', techId);

    console.log('2. Creating Vacancy...');
    const vacancyData = {
        title: 'Test Vacancy',
        description: 'A test vacancy created by verification script',
        seniority: 'Senior',
        softSkills: 'Testing',
        location: 'Remote',
        modality: 'REMOTE', // Enum ONSITE, REMOTE, HYBRID
        salaryRange: '1000-2000',
        company: 'Test Corp',
        maxApplicants: 10,
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

    console.log('Vacancy created successfully.');

    console.log('3. Fetching Vacancies...');
    const listRes = await fetch(`${API_URL}/vacancies`);
    const vacancies = await listRes.json();

    console.log(`Found ${vacancies.length} vacancies.`);
    if (vacancies.length > 0) {
        console.log('Verification PASSED!');
    } else {
        console.error('Verification FAILED: No vacancies found.');
        process.exit(1);
    }
}

// Wait for server to start
setTimeout(verify, 3000);
