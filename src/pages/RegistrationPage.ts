
import { Page, Locator, expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class RegistrationPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly streetInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly ssnInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly repeatPasswordInput: Locator;
    readonly registerButton: Locator;
    readonly userAlreadyExistsError: Locator;
    readonly allValidationErrors: Locator;


    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('#customer\\.firstName');
        this.lastNameInput = page.locator('#customer\\.lastName');
        this.streetInput = page.locator('#customer\\.address\\.street');
        this.cityInput = page.locator('#customer\\.address\\.city');
        this.stateInput = page.locator('#customer\\.address\\.state');
        this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
        this.phoneNumberInput = page.locator('#customer\\.phoneNumber');
        this.ssnInput = page.locator('#customer\\.ssn');
        this.usernameInput = page.locator('#customer\\.username');
        this.passwordInput = page.locator('#customer\\.password');
        this.repeatPasswordInput = page.locator('#repeatedPassword');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.userAlreadyExistsError = page.getByText('This username already exists.', { exact: true });
        this.allValidationErrors = page.locator('.error');
    }

    async navigateToRegistrationPage() {
        await this.page.goto('/parabank/index.htm');
        await this.page.getByRole('link', { name: 'Register' }).click();
    }

    async fillRegistrationForm() {
        await this.firstNameInput.fill(faker.person.firstName());
        await this.lastNameInput.fill(faker.person.lastName());
        await this.streetInput.fill(faker.location.streetAddress());
        await this.cityInput.fill(faker.location.city());
        await this.stateInput.fill(faker.location.state());
        await this.zipCodeInput.fill(faker.location.zipCode());
        await this.phoneNumberInput.fill(faker.phone.number());
        await this.ssnInput.fill(faker.string.alphanumeric(9));
       // const username = "Emily.Cartwright56";
        const username = faker.internet.username();
        await this.usernameInput.fill(username);
        const password = faker.internet.password(); // generate password
        await this.passwordInput.fill(password);     // fill first field
        await this.repeatPasswordInput.fill(password);

        return username; // return to caller
    }

    async submitRegistrationForm() {
        await this.registerButton.click();
    }

    async ifValidationErrorVisible() {
        try {
            await this.allValidationErrors.waitFor({ state: 'visible', timeout: 5000 });
            const errors = await this.allValidationErrors.allTextContents();
            console.log(`Validation errors: ${errors.join(', ')}`);
            return true;
        } catch {
            return false;
        }
    }

    async verifyRegistrationSuccess(username: string) {
        await expect(this.page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
        await expect(this.page.locator('#rightPanel')).toContainText(
            'Your account was created successfully. You are now logged in.'
        );
    }


    /** 
     * High-level flow: register user with retries and validation handling
     * Returns username and password for login
     */
   async registerNewUser(maxRetries = 2): Promise<string> {
    await this.navigateToRegistrationPage();
    let username = '';

    for (let i = 0; i <= maxRetries; i++) {
        // Fill form and get credentials
        username = await this.fillRegistrationForm();

        // Submit the form
        await this.submitRegistrationForm();

        // Check for validation errors
        if (await this.ifValidationErrorVisible()) {
            console.log(`Attempt ${i + 1}: Validation error. Retrying...`);
            continue; // retry with new form
        }

        break; // success
    }

    // Verify registration success after successful submission
    await this.verifyRegistrationSuccess(username);

        return username; // return to spec
    }

}
