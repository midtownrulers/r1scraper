const { districtId } = require("../../lib")
const { shouldMatchOuterHTMLSnapshot } = require("../lib")

beforeAll(async () => {
    const schoolId = "2348";
    const sportId = "7"
    await page.goto(`https://www.rankone.com/Schedules/View_Schedule_All_Web.aspx?P=0&D=${districtId}&S=${schoolId}&Sp=${sportId}&Mt=0`);
});

test('district name should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#lbl_DistrictName')
});

test('sport name should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#lbl_PageTitle')
});

test('team table should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#content')
});
