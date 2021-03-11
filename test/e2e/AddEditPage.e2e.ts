import { ClientFunction, Selector } from 'testcafe';

const getPageUrl = ClientFunction(() => window.location.href);
const getPageTitle = ClientFunction(() => document.title);
// Navbar Setup
const navbarSelector = Selector('[data-tid="navbar"]');
const addEditBtn = navbarSelector.nth(0);
const pdfReviewBtn = navbarSelector.nth(1);
// Search Form
const searchSelector =  Selector('[data-tid="searchContainer"]');

// Run assertNoConsoleErrors method after each test including new testing to verify no error messages
const assertNoConsoleErrors = async (t) => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};
// This will the assertNoConsoleErrors function after each test to verify no console log errors
fixture`App Main Page`
  .page('../../app/app.html')
  .afterEach(assertNoConsoleErrors);

test('e2e', async (t) => {
  await t.expect(getPageTitle()).eql('Electron-React Tester!');
});

test('should open window and contain expected page title', async (t) => {
  await t.expect(getPageTitle()).eql('Electron-React Tester!');
});

test(
  'should not have any logs in console of main window',
  assertNoConsoleErrors
);
