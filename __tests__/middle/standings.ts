import { districtId, r1 } from "../lib"
import { TeamMap } from "../../dist/types"

let teamMap: TeamMap;

beforeAll(async () => {
    teamMap = await r1.createTeamMap(districtId,"Middle","7",8)
})

test("get 8th basketball standings", async () => {
    const standings = await r1.getStandings("A Team",teamMap)
    console.log(standings)
})
