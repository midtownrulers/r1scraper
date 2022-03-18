import { districtId, r1 } from "../lib"
import { School } from "../../dist/types"

test('get all schools with a middle filter check if it returns Lively Middle School', async () => {
  const arr: School[] = await r1.getSchools(districtId, "Middle")
  expect(arr).toEqual(          // 1
    expect.arrayContaining([      // 2
      expect.objectContaining({   // 3
        name: "Lively Middle School",
        id: "2348"
      })
    ])
  )
});


test('get Lively Middle School and check if the school plays basketball and competes in 10 sports.`', async () => {
  const school: School = await r1.getSchool(districtId, "2348")
  expect(school.name).toBe("Lively Middle School");
  expect(school.id).toBe("2348");
  expect(school.sports).toHaveLength(10)
  expect(school.sports).toEqual(expect.arrayContaining([["7","Basketball"]]))
})
//getSport(districtId,"2352","25").then((sport) => console.log(sport))
// getTeams(districtId,"2331","7","Varsity","M").then((ids)=> console.log(ids))
//getGame(districtId,"2352",[ '44590', '4' ],7, "7").then((games) => console.log(games))
// getPlayers(districtId,"2352",[ '44590', '4' ],"7").then((games)=> console.log(games))
// can't test getPlayer
 //getTeam(districtId,"2352",["44612", "15"],"25").then((team) => console.log(team))
// getSchool(districtId, "2352").then((school) => console.log(school))
/*const filter: GameFilter = {
  state: ["scheduled"]
}

getGames(districtId,"2331",["43833","1"],"7",filter).then((games)=>console.log(games))*/