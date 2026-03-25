import{Page, expect, test, Locator} from '@playwright/test';

export class OpenNewAccount{

    readonly page:Page;
    readonly openAccountLink:Locator;
    readonly selectAccountDropdown:Locator;
    readonly existingAccountDropdown:Locator;
    readonly openNewAccountButton:Locator;
    readonly verifyMessage:Locator;
    readonly newAccountNumber:Locator;

    constructor (page:Page)
    {
        this.page=page;
        this.openAccountLink = page.getByText('Open New Account');
        this.selectAccountDropdown= page.locator('#type');
        this.existingAccountDropdown=page.locator('#fromAccountId');
        this.openNewAccountButton=page.getByRole('button', {name:'Open New Account'});
        this.verifyMessage = page.getByText('Account Opened!', { exact: true });
        this.newAccountNumber = page.locator(`#newAccountId`);

    }

    async navigatetoOpenNewAccount()
    {
        await expect(this.openAccountLink).toBeVisible();
        await this.openAccountLink.click();
    }
    async enternewAccountDetails(accountType:string, existingAcc:number)
    {
        await this.selectAccountDropdown.selectOption(accountType);
        await this.existingAccountDropdown.selectOption({index: existingAcc});
        await this.openNewAccountButton.click();
    }

    async newAccountID(): Promise<string>
    {
        const newAccnum:string|null = await this.newAccountNumber.textContent();
        if(!newAccnum){
            throw new Error("New Account number is not found")
        }
        return newAccnum.trim();
    }
    async verifyNewAccountOpened()
    {
        await expect(this.verifyMessage).toBeVisible();
        await expect(this.verifyMessage).toContainText("Account Opened!");
        await expect(this.newAccountNumber).toBeVisible();
        
    }


    
}
