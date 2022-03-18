import {
    districtId,
    r1
} from "../lib"
import {
    Game, GameFilter, GetGames, TeamMap
} from "../../dist/types"

let teamMap: TeamMap;

beforeAll(async () => {
    teamMap = await r1.createTeamMap(districtId,"Middle","7",8)
})

test("get all games from Lively A-team", async () => {
    const games: Game[] = await r1.getGames(districtId, "2348", ['44458', '4'],"7", null, teamMap)

    expect(games).toBeInstanceOf(Array)
    games.forEach(game => {
        expect(game.homeTeamId).toStrictEqual(['44458', '4'])
        expect(game.homeSchoolId).toBe("2348")
    });
})


test("get first game from Lively A-team", async () => {
    const game: Game = await r1.getGame(districtId, "2348", ['44458', '4'],0,"7",teamMap)
    console.log(game)
})