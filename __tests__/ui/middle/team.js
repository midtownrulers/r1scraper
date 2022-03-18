const { districtId } = require("../../lib")
const { shouldMatchOuterHTMLSnapshot } = require("../lib")

beforeAll(async () => {
    const schoolId = "2348";
    const sportId = "7"
    const teamId = ["44458", "4"]
    await page.goto(`https://www.rankone.com/Schedules/View_Schedule_Web.aspx?P=0&D=${districtId}&S=${schoolId}&Sp=${sportId}&Tm=${teamId[0]}&L=${teamId[1]}&Mt=0`);
});

test('district name should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#lnk_District')
});

test('sport name should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot("#lnk_Sport")
});

test('school info block should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('.VSContentWrapper > .row > .col-sm-5.col-xs-12')
});

test("table header should match the snapshot", async () => {
    await shouldMatchOuterHTMLSnapshot(".row.VSContentHeader.NonMasterSubTitle")
})
