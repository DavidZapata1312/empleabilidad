const API_URL = 'http://localhost:3000/api';

async function verifyFullFlow() {
    // 1. Login as Admin
    console.log('1. Logging in as Admin...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    const { accessToken: adminToken } = await loginRes.json();
    console.log('Admin Token obtained.');

    // 1b. Login as Coder (for application)
    console.log('1b. Logging in as Coder...');
    const coderLoginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'coder@example.com', password: 'coder123' })
    });
    if (!coderLoginRes.ok) {
        console.error('Coder login failed', await coderLoginRes.text());
        process.exit(1);
    }
    const { accessToken: coderToken } = await coderLoginRes.json();
    console.log('Coder Token obtained.');


    // 2. Create Vacancy
    console.log('2. Creating Vacancy...');
    const crypto = require('crypto');
    const techId = crypto.randomUUID();

    const vacancyData = {
        title: 'Flow Test Vacancy',
        description: 'Created for full flow verification',
        seniority: 'Junior',
        softSkills: 'Testing',
        location: 'Remote',
        modality: 'REMOTE',
        salaryRange: '1000-2000',
        company: 'Test Corp',
        maxApplicants: 5,
        technologies: [techId]
    };

    const createRes = await fetch(`${API_URL}/vacancies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(vacancyData)
    });

    if (!createRes.ok) throw new Error(await createRes.text());
    const vacancy = await createRes.json();
    console.log('Vacancy Created:', vacancy.id);

    // 3. Apply to Vacancy (as Coder)
    console.log('3. Applying to Vacancy...');
    const applyRes = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${coderToken}`
        },
        body: JSON.stringify({ vacancyId: vacancy.id })
    });

    if (!applyRes.ok) throw new Error('Application failed: ' + await applyRes.text());
    console.log('Application submitted successfully.');

    // 4. Delete Vacancy (as Admin)
    console.log('4. Deleting Vacancy...');
    const deleteRes = await fetch(`${API_URL}/vacancies/${vacancy.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    });

    if (!deleteRes.ok) throw new Error('Delete failed: ' + await deleteRes.text());
    console.log('Vacancy Deleted successfully.');

    // 5. Verify Deletion
    const checkRes = await fetch(`${API_URL}/vacancies/${vacancy.id}`);
    if (checkRes.status === 404) {
        console.log('Verification PASSED: Vacancy correctly removed.');
    } else {
        console.error('Verification FAILED: Vacancy still exists.');
        process.exit(1);
    }
}

verifyFullFlow().catch(err => {
    console.error(err);
    process.exit(1);
});
