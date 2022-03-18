const { districtId } = require("../../lib")
const { shouldMatchOuterHTMLSnapshot } = require("../lib")

beforeAll(async () => {
    const schoolId = "2348";
    await page.goto(`https://www.rankone.com/Schedules/View_Schedule_All_Web.aspx?P=0&D=${districtId}&S=${schoolId}&Mt=0`);
});

test('district name should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#lbl_DistrictName')
});

test('school name should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#lbl_PageTitle')
});

test('sports table should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#content')
});
