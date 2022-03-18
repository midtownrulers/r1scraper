import { parse } from "node-html-parser";
import {
  District,
  Game,
  GameFilter,
  GameState,
  GetDistrict,
  GetGame,
  GetGames,
  GetPlayer,
  GetPlayers,
  GetSchool,
  GetSchools,
  GetTeam,
  CreateTeamMap,
  GetTeams,
  Player,
  School,
  SchoolType,
  Sport,
  SportsGender,
  Team,
  TeamMap,
  GetStandings,
} from "./scraper";

import puppeteer, { registerCustomQueryHandler } from "puppeteer";
import got from "got"

import * as Promise from "bluebird";

import crypto from "node:crypto";

export const getDistrict: GetDistrict = async (id): Promise<District> => {
  const district = await got.get(
    "https://www.rankonesport.com/Schedules/View_Schedule_All_Web.aspx",
    {
      searchParams: {
        D: id,
        MT: 0,
      },
    }
  );

  const dom = parse(district.body);

  const districtName = dom.querySelector("#lbl_DistrictName")?.innerText ?? "";

  const schoolIds: string[] = dom
    .querySelectorAll("#schoolCont td a")
    .map((schoolElement) => {
      const href = schoolElement.getAttribute("href");
      if (href) {
        return new URLSearchParams(href).get("S");
      }
      return undefined;
    })
    .filter((schoolId) => {
      return schoolId != null;
    });

  return {
    id: id,
    name: districtName,
    schools: schoolIds,
  };
};

export const getSchools: GetSchools = async (
  districtId: string,
  schoolType?: SchoolType
): Promise<School[]> => {
  const district = await got.get(
    "https://www.rankonesport.com/Schedules/View_Schedule_All_Web.aspx",
    {
      searchParams: {
        D: districtId,
        MT: 0,
      },
    }
  );

  const dom = parse(district.body);

  const highSchools = dom
    .querySelectorAll("#schoolCont #highCont td a")
    .map((schoolElement): [string, SchoolType] => {
      const href = schoolElement.getAttribute("href");
      if (href) {
        return [new URLSearchParams(href).get("S"), "High"];
      }
      return undefined;
    })
    .filter((schoolId) => {
      return schoolId != null;
    });

  const middleSchools: [string, SchoolType][] = dom
    .querySelectorAll("#schoolCont #middleCont td a")
    .map((schoolElement): [string, SchoolType] => {
      const href = schoolElement.getAttribute("href");
      if (href) {
        return [new URLSearchParams(href).get("S"), "Middle"];
      }
      return undefined;
    })
    .filter((schoolId) => {
      return schoolId != null;
    });

  let schools: [string, SchoolType][] = [];

  if (schoolType === "High") schools = highSchools;
  else if (schoolType === "Middle") schools = middleSchools;
  else {
    schools = highSchools.concat(middleSchools);
  }

  const promises: Promise<School>[] = schools.map((school) => {
    return new Promise.Promise((resolve) => {
      getSchoolWithType(districtId, school[0], school[1]).then(
        (asSchoolType) => {
          resolve({
            districtId,
            id: school[0],
            name: asSchoolType.name,
            schoolType: school[1],
            sports: asSchoolType.sports,
          });
        }
      );
    });
  });

  return await Promise.all(promises);
};

export const getSchoolIds = async (
  districtId: string,
  schoolType?: SchoolType
): Promise<School["id"][]> => {
  const district = await got.get(
    "https://www.rankonesport.com/Schedules/View_Schedule_All_Web.aspx",
    {
      searchParams: {
        D: districtId,
        MT: 0,
      },
    }
  );

  const dom = parse(district.body);

  const highSchools = dom
    .querySelectorAll("#schoolCont #highCont td a")
    .map((schoolElement): string => {
      const href = schoolElement.getAttribute("href");
      if (href) {
        return new URLSearchParams(href).get("S");
      }
      return undefined;
    })
    .filter((schoolId) => {
      return schoolId != null;
    });

  const middleSchools = dom
    .querySelectorAll("#schoolCont #middleSchool td a")
    .map((schoolElement): string => {
      const href = schoolElement.getAttribute("href");
      if (href) {
        return new URLSearchParams(href).get("S");
      }
      return undefined;
    })
    .filter((schoolId) => {
      return schoolId != null;
    });

  let schools: string[] = [];

  if (schoolType === "High") schools = highSchools;
  else if (schoolType === "Middle") schools = middleSchools;
  else {
    schools = highSchools.concat(middleSchools);
  }

  return schools;
};

export const getSchoolWithType = async (
  districtId: string,
  schoolId: string,
  schoolType: SchoolType
): Promise<School> => {
  const school = await got.get(
    "https://www.rankone.com/Schedules/View_Schedule_All_Web.aspx",
    {
      searchParams: {
        P: "0",
        D: districtId,
        S: schoolId,
        Mt: "0",
      },
    }
  );

  const dom = parse(school.body);

  const schoolName = dom.querySelector("#lbl_PageTitle")?.innerText ?? "";

  const sports: [string, string][] = dom
    .querySelectorAll("#schoolCont tr a")
    .map((teamElement): [string, string] => {
      const href = teamElement.getAttribute("href");
      if (href) {
        return [new URLSearchParams(href).get("Sp"), teamElement.innerText];
      }
      return undefined;
    })
    .filter((teamId) => {
      return teamId != null;
    });

  return {
    districtId,
    id: schoolId,
    name: schoolName,
    schoolType: schoolType,
    sports,
  };
};

export const getSchool: GetSchool = async (
  districtId: string,
  schoolId: string
): Promise<School> => {
  const school = await got.get(
    "https://www.rankone.com/Schedules/View_Schedule_All_Web.aspx",
    {
      searchParams: {
        P: "0",
        D: districtId,
        S: schoolId,
        Mt: "0",
      },
    }
  );

  const dom = parse(school.body);

  const schoolName = dom.querySelector("#lbl_PageTitle")?.innerText ?? "";

  const sports = dom
    .querySelectorAll("#schoolCont tr a")
    .map((sportElement): [string, string] => {
      const href = sportElement.getAttribute("href");
      if (href) {
        return [new URLSearchParams(href).get("Sp"), sportElement.innerText];
      }
      return undefined;
    })
    .filter((sportId) => {
      return sportId != null;
    });

  return {
    districtId,
    id: schoolId,
    name: schoolName,
    schoolType: (await getSchoolIds(districtId, "High")).includes(schoolId)
      ? "High"
      : "Middle",
    sports,
  };
};

export const getSport = async (
  districtId: string,
  schoolId: string,
  id: string
): Promise<Sport> => {
  const sport = await got.get(
    "https://www.rankone.com/Schedules/View_Schedule_All_Web.aspx",
    {
      searchParams: {
        P: "0",
        D: districtId,
        S: schoolId,
        Sp: id,
        Mt: "0",
      },
    }
  );

  const dom = parse(sport.body);

  if (
    dom.toString().includes("There is no team found for the selected sport")
  ) {
    return {
      id: id,
      districtId,
      schoolId,
      sportName: "",
      gender: null,
      teams: [],
    };
  }

  const sportName = dom.querySelector("#lbl_PageTitle")?.innerText ?? "";

  const teams = dom
    .querySelectorAll("#schoolCont td a")
    .map((team): [string, string] => {
      const href = team.getAttribute("href");
      if (href) {
        return [
          new URLSearchParams(href).get("Tm"),
          new URLSearchParams(href).get("L"),
        ];
      }
      return undefined;
    })
    .filter((schoolId) => {
      return schoolId != null;
    });

    let gender: SportsGender = null;
    if(sportName.includes("(M)")) {
      gender = "M"
    } else if(sportName.includes("(F)")) {
      gender = "F"
    }
  return {
    id,
    districtId,
    schoolId,
    sportName,
    gender,
    teams,
  };
};

export const getTeam: GetTeam = async (
  districtId: string,
  schoolId: string,
  id: [string, string],
  sport: string
): Promise<Team> => {
  const games = await got.get(
    "https://www.rankone.com/Schedules/View_Schedule_Web.aspx",
    {
      searchParams: {
        D: districtId,
        S: schoolId,
        Sp: sport,
        L: id[1],
        Tm: id[0],
        Mt: "0",
      },
    }
  );

  const gamesDom = parse(games.body);

  let gameIds: Team["games"] = null;

  const teamName =
    gamesDom.querySelector("#lbl_Description p:nth-child(2)")?.innerText ?? "";

  if (!gamesDom.querySelector("#th_None")) {
    gameIds = gamesDom
      .querySelectorAll("tr[id^=rpt_Games_repeaterGameRow]")
      .map((_, idx) => {
        return idx;
      });
  }

  const roster = await got.get(
    "https://www.rankone.com/Schedules/View_Program.aspx",
    {
      searchParams: {
        P: "0",
        D: districtId,
        S: schoolId,
        Sp: sport,
        Tm: id[0],
        L: id[0],
        Mt: "0",
      },
    }
  );

  const rosterDom = parse(roster.body);

  let playerIds: Team["roster"] = null;

  if (
    !rosterDom
      .toString()
      .includes(
        "The roster for this team has not been made public, please check back later."
      )
  ) {
    playerIds = rosterDom
      .querySelectorAll("tr[id^=rpt_Games_repeaterGameRow]")
      .map((_, idx) => {
        return idx;
      });
  }
  let gender: SportsGender = null;
  if(teamName.includes("(M)")) {
    gender = "M"
  } else if(teamName.includes("(F)")) {
    gender = "F"
  }

  let totalWins = 0
  let totalLosses = 0
  let netRecord = 0
  
  
  if(gameIds) {
    await Promise.each(gameIds, async (gameId) => {
      const game = await getGame(districtId,schoolId,id,gameId,sport)
      if(game.won) {
        totalWins++
        netRecord++
      } else {
        totalLosses++
        netRecord--
      }
    }) 
  }

  return {
    id,
    name: teamName,
    games: gameIds,
    roster: playerIds,
    schoolId: schoolId,
    sport: sport,
    gender: gender,
    totalWins: totalWins,
    totalLosses: totalLosses,
    netRecord: netRecord
  };
};

export const getTeams: GetTeams = async (
  districtId: District["id"],
  schoolId: School["id"],
  sport?: string,
  level?: string | number,
  gender?: SportsGender
): Promise<Team[]> => {
  const school: School = await getSchool(districtId, schoolId);
  const sports: Sport[] = [];

  if (sport) {
    sports.push(await getSport(districtId, schoolId, sport));
  } else {
    for (const sportId of school.sports) {
      sports.push(await getSport(districtId, schoolId, sportId[0]));
    }
  }

  let returnable = [];

  for (const sportObj of sports) {
    const teams = [];
    for (const teamId of sportObj.teams) {
      const team = await getTeam(districtId, schoolId, teamId, sportObj.id);

      const checkLevel = () => {
        if (typeof level === "number" || typeof level === "string") {
            if (team.name.includes(String(level))) {
              teams.push(team);
            }
          } else {
            teams.push(team);
          }
        }

      if(gender) {
        if(team.gender == gender) {
          checkLevel()
        }
      } else {
        checkLevel()
      }
    }
    returnable = returnable.concat(teams);
  }

  return returnable;
};

export const getPlayer: GetPlayer = async (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  id: Player["index"],
  sportId: Sport["id"]
): Promise<Player> => {
  const roster = await got.get(
    "https://www.rankone.com/Schedules/View_Program.aspx",
    {
      searchParams: {
        D: districtId,
        S: schoolId,
        L: teamId[1],
        Sp: sportId,
        Tm: teamId[0],
        Mt: 0,
      },
    }
  );

  const dom = parse(roster.body);

  const table = dom.querySelector("#gv_Program tbody");

  const row = table.childNodes[id];
  const rowDom = parse(row.rawText);
  const name = `${
    rowDom.querySelector("#gv_Program_AthleteFirstName_0").textContent
  } ${rowDom.querySelector("#gv_Program_AthleteLastName_0").textContent}`;

  return {
    districtId: districtId,
    index: id,
    name,
    schoolId: schoolId,
    sportId: sportId,
    teamId: teamId,
  };
};

export const getPlayers: GetPlayers = async (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  sportId: Sport["id"]
): Promise<Player[]> => {
  const roster = await got.get(
    "https://www.rankone.com/Schedules/View_Program.aspx",
    {
      searchParams: {
        D: districtId,
        S: schoolId,
        L: teamId[1],
        Sp: sportId,
        Tm: teamId[0],
        Mt: 0,
      },
    }
  );

  const dom = parse(roster.body);

  if(dom
    .toString()
    .includes(
      "The roster for this team has not been made public, please check back later."
    )) {
      return [];
    }
  const table = dom.querySelector("#gv_Program tbody");

  const returnable = [];

  for (let i = 0; i < table.childNodes.length; i++) {
    const row = table.childNodes[i];

    const rowDom = parse(row.rawText);
    const name = `${
      rowDom.querySelector("#gv_Program_AthleteFirstName_0").textContent
    } ${rowDom.querySelector("#gv_Program_AthleteLastName_0").textContent}`;

    returnable.push({
      districtId,
      index: i,
      name,
      schoolId: schoolId,
      sportId: sportId,
      teamId: teamId,
    });
  }

  return returnable;
};

export const createTeamMap: CreateTeamMap = async ( districtId: District["id"], schoolType: SchoolType, sportId: Sport["id"], level: string | number): Promise<TeamMap> => {

  // FIX TEAM MAP - 8th grade teams don't show up


  const map: TeamMap = new Map()

  const allSchools = await getSchools(districtId, schoolType)

  await Promise.each(allSchools, async (school: School) => {
      const sport = await getSport(districtId, school.id, sportId)
      await Promise.each(sport.teams, async (teamId: Team["id"]) => {
        const team = await getTeam(districtId,school.id,teamId,sport.id)
        const splitName = team.name.split(`(${team.gender}) `)
        if (team.name.includes(String(level))) {
          map.set(splitName[1], team)
        }
        return;
      })
    return;
  })
  return map;
}

export const getGame: GetGame = async (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  id: Game["index"],
  sportId: Sport["id"],
  teamMap?: TeamMap,
): Promise<Game> => {
  const games = await got.get(
    "https://www.rankone.com/Schedules/View_Schedule_Web.aspx",
    {
      searchParams: {
        D: districtId,
        S: schoolId,
        Sp: sportId,
        L: teamId[1],
        Tm: teamId[0],
        Mt: 0,
      },
    }
  );

  const dom = parse(games.body);

  const date = dom.querySelector(
    `#rpt_Games_lbl_Start_Date_${id}`
  )?.textContent;

  const time = dom.querySelector(
    `#rpt_Games_lbl_Start_Time_${id}`
  )?.textContent;

  const opponent = dom.querySelector(
    `#rpt_Games_lbl_Opponent_${id}`
  )?.textContent;

  const score = dom
      .querySelector(`#rpt_Games_lbl_Score_${id}`)
      ?.textContent.replace(/\s\s+/g, " ");

  const homeScore = parseInt(score?.split(" ")[1]);
  const awayScore = parseInt(score?.split(" ")[3]);

  const today = new Date();

  const asDate: Date = new Date(`${date}, ${today.getFullYear()} ${time}`);

  let isHome = false
  const location = dom.querySelector(`#rpt_Games_lbl_Location_${id}`)?.textContent

  if(location == "VS") {
    isHome = true;
  }

  let opponentTeamId: Team["id"], opponentSchoolId: School["id"] = null
  if (teamMap) {
    const opponentTeam = teamMap.get(opponent)
    opponentTeamId = opponentTeam.id
    opponentSchoolId = opponentTeam.schoolId
  }

  return {
    homeSchoolId: schoolId,
    homeTeamId: teamId,
    homeDistrictId: districtId,
    sport: sportId,
    index: id,
    status: score != null ? "finished" : "scheduled", // what is pending for?
    won: score?.startsWith("W"),
    startTime: isNaN(asDate.getTime()) ? undefined : asDate,
    opponent: opponent,
    opponentTeamId: opponentTeamId,
    opponentSchoolId: opponentSchoolId,
    homeTeamScore: homeScore,
    awayTeamScore: awayScore,
    home: isHome,
  };
};

export const getGames: GetGames = async (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  sportId: Sport["id"],
  filter?: GameFilter,
  teamMap?: TeamMap
): Promise<Game[]> => {
  let html = "";

  if (filter?.home != null) {
    html = await getRawFilteredSchedule(
      districtId,
      schoolId,
      sportId,
      teamId,
      filter?.home
    );
  } else {
    const games = await got.get(
      "https://www.rankone.com/Schedules/View_Schedule_Web.aspx",
      {
        searchParams: {
          D: districtId,
          S: schoolId,
          Sp: sportId,
          L: teamId[1],
          Tm: teamId[0],
          Mt: 0,
        },
      }
    );
    html = games.body;
  }

  const dom = parse(html);

  const rowCount = dom.querySelectorAll(
    "tr[id^=rpt_Games_repeaterGameRow_]"
  ).length;

  const returnable: Game[] = [];

  for (let id = 0; id < rowCount; id++) {
    const date = dom.querySelector(
      `#rpt_Games_lbl_Start_Date_${id}`
    )?.textContent;

    const time = dom.querySelector(
      `#rpt_Games_lbl_Start_Time_${id}`
    )?.textContent;

    const opponent = dom.querySelector(
      `#rpt_Games_lbl_Opponent_${id}`
    )?.textContent;

    let opponentTeamId: Team["id"], opponentSchoolId: School["id"] = null
    if (teamMap) {
      const opponentTeam = teamMap.get(crypto.createHmac("sha256","basketball").update(`${opponent}${sportId}`).digest("hex"))
      if(opponentTeam) {
        opponentTeamId = opponentTeam.id
        opponentSchoolId = opponentTeam.schoolId
      }
    }
    if (filter?.opponent?.filterExact || filter?.opponent?.filterLeniant) {
      if (opponent == null) continue;

      if (
        filter?.opponent?.filterExact &&
        opponent !== filter?.opponent?.filterExact
      ) {
        continue;
      }

      if (
        filter?.opponent?.filterLeniant &&
        !opponent.includes(filter?.opponent?.filterLeniant)
      ) {
        continue;
      }
    }

    const score = dom
      .querySelector(`#rpt_Games_lbl_Score_${id}`)
      ?.textContent.replace(/\s\s+/g, " ");

    const won = score?.startsWith("W");

    if (filter?.won === true && won !== true) continue;
    if (filter?.won === false && won !== false) continue;

    const winnerScore = won ? parseInt(score?.split(" ")[1]) : parseInt(score?.split(" ")[3]);

    if (
      filter?.ourScore &&
      !filter?.ourScore[1] &&
      filter?.ourScore[0] !== winnerScore
    )
      continue;
    if (
      filter?.ourScore &&
      filter?.ourScore[1] &&
      filter?.ourScore[0] >= winnerScore
    )
      continue;

    const loserScore = won ? parseInt(score?.split(" ")[3]) : parseInt(score?.split(" ")[1]);

    if (
      filter?.opponentScore &&
      !filter?.opponentScore[1] &&
      filter?.opponentScore[0] !== loserScore
    )
      continue;
    if (
      filter?.opponentScore &&
      filter?.opponentScore[1] &&
      filter?.opponentScore[0] >= loserScore
    )
      continue;

    const today = new Date();
    const asDate: Date = new Date(`${date}, ${today.getFullYear()} ${time}`);

    if (
      filter?.startTime &&
      asDate.getTime() !== filter?.startTime?.getTime()
    ) {
      continue;
    }

    // what is pending for?
    const status: GameState = score != null ? "finished" : "scheduled";

    if (filter?.state && !filter?.state.includes(status)) continue;

    if (filter?.home != null) {
      returnable.push({
        homeSchoolId: schoolId,
        homeTeamId: teamId,
        homeDistrictId: districtId,
        sport: sportId,
        index: id,
        status,
        won,
        startTime: isNaN(asDate.getTime()) ? undefined : asDate,
        opponent: opponent,
        opponentTeamId: opponentTeamId,
        opponentSchoolId: opponentSchoolId,
        winnerScore,
        loserScore,
        home: filter.home,
      });
    } else {
      
      let isHome = false
      const location = dom.querySelector(`#rpt_Games_lbl_Location_${id}`)?.textContent

      if(location == "VS") {
        isHome = true;
      } 



      returnable.push({
        homeSchoolId: schoolId,
        homeTeamId: teamId,
        homeDistrictId: districtId,
        sport: sportId,
        index: id,
        status,
        won,
        startTime: isNaN(asDate.getTime()) ? undefined : asDate,
        opponent: opponent,
        opponentTeamId: opponentTeamId,
        opponentSchoolId: opponentSchoolId,
        winnerScore,
        loserScore,
        home: isHome,
      });
    }
  }

  return returnable;
};

export const getStandings: GetStandings = async ( 
  level: string | number,
  teamMap: TeamMap
) => {
  const teams: [Team] = [{
    name: undefined,
    id: [undefined,undefined],
    schoolId: undefined,
    // If rosters aren't available, return null
    roster: null,
    games: null,
    sport: undefined,
    gender: undefined,
    totalWins: undefined,
    totalLosses: undefined,
    netRecord: undefined
  }];
  await Promise.each(teamMap.values(), async (team: Team) => {
    if (typeof level === "number" || typeof level === "string") {
      console.log(team.name.includes("8"))
      if (team.name.includes(String(level))) {
        console.log(true)
        teams.push(team);
      }
    } else {
      teams.push(team);
    }
  })

  if(teams.length > 1) {
    try { 
      teams.shift()
    } catch(e) {
      return;
    }
  }
  const sortedArray = teams.sort((a: Team,b: Team) => {
    return a.netRecord - b.netRecord
  })
  return sortedArray.reverse()
}
const getRawFilteredSchedule = async (
  districtId: District["id"],
  schoolId: School["id"],
  sportId: Sport["id"],
  teamId: Team["id"],
  home: boolean
): Promise<string> => {
  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();
  await page.goto(
    `https://www.rankone.com/Schedules/View_Schedule_Web.aspx?P=0&D=${districtId}&S=${schoolId}&Sp=${sportId}&Tm=${teamId[0]}&L=${teamId[1]}&Mt=0`
  );

  const checkbox = await page.$(home ? "#cblHomeAway_1" : "#cblHomeAway_0");
  await checkbox.click();

  await page.waitForSelector(`#cblHomeAway_${home ? "0" : "1"}:checked`);

  const content = await page.content();

  await browser.close();

  return content;
};