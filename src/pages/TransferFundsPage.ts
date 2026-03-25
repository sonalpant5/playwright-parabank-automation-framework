import { Page, expect, Locator } from "playwright/test"

export class TransferFunds {
    readonly tranferFundLink: Locator;
    readonly amountText: Locator;
    readonly fromAccountDropdown: Locator;
    readonly toAccountDropdown: Locator;
    readonly tranferButton: Locator;
    readonly successMessage;
    readonly tranferMessage;
    readonly moreDetailMessage;

    constructor(page: Page) {
        this.tranferFundLink = page.locator('#leftPanel').getByRole('link', { name: 'Transfer Funds' });
        this.amountText = page.locator('#amount');
        this.fromAccountDropdown = page.locator('#fromAccountId');
        this.toAccountDropdown = page.locator('#toAccountId');
        this.tranferButton = page.getByRole('button', { name: 'Transfer' });
        this.successMessage = page.getByRole('heading', { name: 'Transfer Complete!' });
        this.tranferMessage = page.locator('#showResult')
        this.moreDetailMessage = page.getByText('See Account Activity for more details.', { exact: true });
    }

    async navigatetoTransferFund() {
        await expect(this.tranferFundLink).toBeVisible();
        await this.tranferFundLink.click();
    }

    async enterTransferDetails(amount: number, fromAccount: number, toAccount: string) {
        await this.amountText.fill(`${amount}`);
        await this.fromAccountDropdown.selectOption({ index: fromAccount });
        await this.toAccountDropdown.selectOption({ value: `${toAccount}` });
    }

    async submitTranferFund() {

        await this.tranferButton.click();
    }

    async verifyfundTransfered() {
        await expect(this.successMessage).toContainText("Transfer Complete!");
        const message = await this.tranferMessage.textContent();
        console.log(message);
        await expect(this.tranferMessage).toBeVisible();
        await expect(this.moreDetailMessage).toBeVisible();

    }


}

