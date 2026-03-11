const fs = require('fs');
const path = require('path');

// Manually parse .env.local because dotenv is not installed
function loadEnvLocal() {
    const envPath = path.resolve(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) return;

    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length > 0) {
            const value = vals.join('=').trim().replace(/^["']|["']$/g, '');
            if (key.trim() && !key.trim().startsWith('#')) {
                process.env[key.trim()] = value;
            }
        }
    });
}

loadEnvLocal();

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    console.error("Error: DIRECTUS_URL or DIRECTUS_TOKEN is missing in .env.local");
    process.exit(1);
}

const USER_EMAIL = 'carcha_zarina@men2corp.com';
const USER_PASS = 'zcc1190029';
const DEPT_ID = 2; // Required for payroll access

async function seed() {
    const baseUrl = DIRECTUS_URL.replace(/\/$/, "");
    const url = `${baseUrl}/items/user`;

    console.log(`Checking if user exists: ${USER_EMAIL}...`);

    try {
        const searchRes = await fetch(`${url}?filter[user_email][_eq]=${USER_EMAIL}&limit=1`, {
            headers: {
                'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!searchRes.ok) {
            throw new Error(`Search failed: ${searchRes.statusText}`);
        }

        const searchJson = await searchRes.json();
        const existingUser = searchJson.data && searchJson.data[0];

        if (existingUser) {
            console.log(`User exists (ID: ${existingUser.user_id}). Updating credentials...`);
            const updateRes = await fetch(`${url}/${existingUser.user_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_password: USER_PASS,
                    user_department: DEPT_ID,
                    is_deleted: false
                })
            });

            if (!updateRes.ok) {
                throw new Error(`Update failed: ${updateRes.statusText}`);
            }
            console.log("User updated successfully.");
        } else {
            console.log("User not found. Creating new user...");
            const createRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_email: USER_EMAIL,
                    user_password: USER_PASS,
                    user_department: DEPT_ID,
                    is_deleted: false
                })
            });

            if (!createRes.ok) {
                throw new Error(`Creation failed: ${createRes.statusText}`);
            }
            console.log("User created successfully.");
        }
    } catch (err) {
        console.error("Seed Error:", err.message);
        process.exit(1);
    }
}

seed();
