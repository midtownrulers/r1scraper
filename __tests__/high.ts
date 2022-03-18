import { districtId, r1 } from "./lib"
import { School } from "r1scraper"

test('check if getSchools with a high filter contains Austin High School', async () => {
  const arr: School[] = await r1.getSchools(districtId, "High")
  expect(arr).toEqual(          // 1
    expect.arrayContaining([      // 2
      expect.objectContaining({   // 3
        name: "Austin High School",
        id: "2331"
      })
    ])
  )
});

test('get Austin High School and check if the school plays basketball and competes in 20 sports ', async () => {
  const school: School = await r1.getSchool(districtId, "2331")
  expect(school.name).toBe("Austin High School");
  expect(school.id).toBe("2331");
  expect(school.sports).toHaveLength(20)
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