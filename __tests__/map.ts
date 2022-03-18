import {
    districtId,
    r1
} from "./lib"
import {
   TeamMap
} from "../dist/types"

test("create basketball team map", async () => {
    const map: TeamMap = await r1.createTeamMap(districtId,"Middle","7",8)
    console.log(map)
})