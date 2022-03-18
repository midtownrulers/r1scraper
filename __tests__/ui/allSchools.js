const { districtId } = require("../lib")
const { shouldMatchOuterHTMLSnapshot } = require("./lib")

beforeAll(async () => {
    await page.goto(`https://www.rankonesport.com/Schedules/View_Schedule_All_Web.aspx?D=${districtId}&MT=0`);
});

test('district name should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#lbl_DistrictName')
});


test('the schools table should match the snapshot', async () => {
    await shouldMatchOuterHTMLSnapshot('#content')
});
