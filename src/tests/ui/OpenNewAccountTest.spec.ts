import { test, expect } from "@playwright/test";
import { OpenNewAccount } from "../../pages/OpenNewAccountPage";
import { TransferFunds } from "../../pages/TransferFundsPage";

test.describe.serial('Banking Flow: Open Account → Fund Transfer', () => {
  
  let newAccountNum: string; // shared variable for account number

  test.beforeEach(async ({ page }) => {
    await page.goto('/parabank/index.htm');
  });

  test('Verify New Account Test', async ({ page }) => {
    const openAcc = new OpenNewAccount(page);

    await openAcc.navigatetoOpenNewAccount();
    await openAcc.enternewAccountDetails("SAVINGS", 0);
    await page.waitForLoadState("networkidle");

    newAccountNum = await openAcc.newAccountID(); // store for next test
    await openAcc.verifyNewAccountOpened();

    console.log(`${newAccountNum} - New account created successfully.`);
  });

  test("Verify successful fund transfer between accounts", async ({ page }) => {
    const transferFund = new TransferFunds(page);

    // Use the account number created in previous test
    await page.waitForLoadState("networkidle");
    await transferFund.navigatetoTransferFund();
    await transferFund.enterTransferDetails(1000, 0, newAccountNum);
    await page.waitForLoadState("networkidle");

    await transferFund.submitTranferFund();
    await transferFund.verifyfundTransfered();
  });

});
