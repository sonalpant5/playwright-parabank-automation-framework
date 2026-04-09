// registration.spec.ts
/// <reference types="node" />
import { test } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';
import * as fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

test.beforeEach(() => {
    if (fs.existsSync(authFile)) {
        fs.writeFileSync(authFile, '{}', 'utf-8');
        console.log('Cleared authentication file before test');
    }
});

test('SetUp Login Details', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    
    // High-level flow handles retries and validation
    const username = await registrationPage.registerNewUser();
    console.log(`User registered successfully: ${username}`);
   
    await page.context().storageState({ path: authFile });
});
