import fs from 'fs';

export default async function globalSetup() {
    fs.writeFileSync(
        'run-info.txt',
        'Run by: 23127543'
    );
}