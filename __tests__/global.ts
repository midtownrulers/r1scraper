import {
    districtId,
    r1
} from "./lib"
import {
    School
} from "../dist/types"

test('get Austin ISD', async () => {
    expect((await r1.getDistrict(districtId)).name).toBe("Austin ISD");
});

test("check if getSchools without filters contains Lively Middle School and Austin High School", async () => {
    const arr: School[] = await r1.getSchools(districtId)

    expect(arr).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                name: "Lively Middle School",
                id: "2348"
            }),
            expect.objectContaining({
                name: "Austin High School",
                id: "2331"
            })
        ])
    )
})