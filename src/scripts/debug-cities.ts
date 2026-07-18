import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCity(stateCode: string) {
    console.log(`\n--- Checking State: ${stateCode} ---`);

    const { data: stateData, error: stateError } = await supabase
        .from('state')
        .select('id, code')
        .eq('code', stateCode)
        .single();

    if (stateError || !stateData) {
        console.error(`Error fetching state ${stateCode}:`, stateError?.message);
        return;
    }

    console.log(`State Found: ${stateCode}, ID: ${stateData.id}`);

    const { data: cities, error: cityError } = await supabase
        .from('city')
        .select('id, name')
        .eq('state_id', stateData.id);

    if (cityError) {
        console.error(`Error fetching cities for ${stateCode}:`, cityError.message);
        return;
    }

    const targetCities = stateCode === 'SP' ? ['São Paulo'] : ['Salvador', 'Feira de Santana'];

    cities?.forEach(city => {
        if (targetCities.includes(city.name)) {
            console.log(`City Found: "${city.name}"`);
            console.log(`  ID: "${city.id}"`);
            console.log(`  ID Length: ${city.id.length}`);
            console.log(`  HEX: ${Buffer.from(city.name).toString('hex')}`); // Check for hidden info
        }
    });
}

async function run() {
    await checkCity('SP');
    await checkCity('BA');
}

run();
