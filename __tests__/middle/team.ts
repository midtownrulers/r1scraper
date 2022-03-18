import {
    districtId,
    r1
} from "../lib"
import {
    Team,
    GetTeam
} from "../../dist/types"


test("get 8th grade Lively basketball A-team", async () => {
    const team: Team = await r1.getTeam(districtId, "2348", ['44458', '4'], "7")

    expect(team.name).toBe("8th grade Basketball (M) Lively - A Team")
    expect(team.games).toBeInstanceOf(Array)
    expect(team.gender).toBe("M")
    expect(team.sport).toBe("7")
})

test("get all basketball teams for Lively and check for 8th A-team", async () => {
    const teams: Team[] = await r1.getTeams(districtId, "2348", "7")
    expect(teams).arrayContainsObject({
            id: ['44458', '4'],
            name: '8th grade Basketball (M) Lively - A Team',
            schoolId: '2348',
            sport: '7',
            gender: 'M'
    })
})

test("get all 8th grade teams for Lively and check for 8th A-team", async () => {
    const teams: Team[] = await r1.getTeams(districtId, "2348", null, "8", "M")
    expect(teams).arrayContainsObject({
            id: ['44458', '4'],
            name: '8th grade Basketball (M) Lively - A Team',
            schoolId: '2348',
            sport: '7',
            gender: 'M'
    })
})