import { districtId, r1 } from "../lib"
import { Sport, SportsGender, Team } from "../../dist/types"

test("get basketball for Lively", async () => {
    const sport: Sport = await r1.getSport(districtId,"2348","7")
    expect(sport.sportName).toBe("Basketball (M)")
    expect(sport.id).toBe("7")
    expect(sport.gender).toBe("M")
    expect(sport.teams).toMatchObject<Team["id"][]>([
        [ '44458', '4' ],
        [ '44459', '4' ],
        [ '44460', '5' ],
        [ '44461', '5' ]
    ])
})

test("get soccer for Lively", async () => {
    const sport: Sport = await r1.getSport(districtId,"2348","25")
    expect(sport.sportName).toBe<Sport["sportName"]>("Soccer (F)")
    expect(sport.id).toBe<Sport["id"]>("25")
    expect(sport.gender).toBe<SportsGender>("F")
    expect(sport.teams).toMatchObject<Team["id"][]>([
        [ '44954', '15' ], 
        [ '44955', '15' ]
    ])
})
