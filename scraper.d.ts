// Types

// Implement validation for the IDs. It shoudn't be left a string. UUID? Regex?
declare type ID = string;

interface District {
    name: string,
    id: ID,
    schools: [School]
}

declare type SchoolType = ("Elementary"|"Middle"|"High")

interface School {
    name: string,
    id: ID,
    districtId: District["id"],
    schoolType: SchoolType,
    teams: [Team]
}

// This can be extended however makes sense. Possibly IDs or a Sport class. It just must include every sport.
// Possible schema change to School -> Sport -> Team - I wasn't sure how to structure the data based on RankOne
// It might also make sense to make this a string if it gets crawled.
declare type Sport = ("Basketball"|"Soccer"|"Etc")


// Is it possible to add an A-team or B-team prop? 
// I don't think so, but if it's possible, add a property, and update the GetTeams function.

// Also does it make sense to allow to get all Teams in a district with GetTeams?
// Or do they strictly belong to a school

interface Team {
    name: string
    id: ID,
    grade: number,
    schoolId: School["id"]
    // If rosters aren't available, return null
    roster: [Player]
    games: [Game]
    sport: Sport
}

interface Player {
    name: string
    // I'm not sure if it makes sense to have TeamIDs not be global, and only be valid inside a school. 
    // Maybe just an array index instead of an ID?
    teamId: Team["id"]
    schoolId: School["id"]
    id: ID
    // I don't know if the following props are available in RankOne:
    height: number // in meters or whatever makes sense. MUST BE METRIC
    weight: number // in kilograms or whatever makes sense. MUST BE METRIC
}

// This can be changed to suit RankOne
declare type GameState = ("scheduled"|"pending"|"finished")

interface Game {
    id: ID
    status: GameState
    // again with the school -> team id system. I don't know if it makes sense. 
    // Also maybe just a home boolean if Games are not assigned to both parties. (e.g global)
    homeSchoolId: School["id"]
    awaySchoolId: School["id"]
    homeTeamId: Team["id"]
    awayteamid: Team["id"]
    startTime: Date
    // I don't know if endTimes are available. 
    // Maybe just a TTL for an hour, and then progressivley get lower if state is not finished.
    endTime: Date
    homeTeamScore: number
    awayTeamScore: number
    won: boolean

}

// Getter Functions


// Maybe a district URL instead of an ID?
declare type GetDistrict = (id: string) => District;

// If other arguments make sense here, please change them. They kinda look off to me. This goes for all districtId stuff.
declare type GetSchool = (districtId: District["id"], id: School["id"]) => School;

declare type GetSchools = (districtId: District["id"], schoolType?: SchoolType) => [School];



declare type GetTeam = (districtId: District["id"], schoolId: School["id"], id: Team["id"]) => Team

declare type GetTeams = (districtId: District["id"], schoolId: School["id"], sport?: Sport, grade?: Team["grade"]) => [Team]

// The cascading arguments are getting rediculous. Maybe there's a better solution, maybe not.
declare type GetPlayer = (districtId: District["id"], schoolId: School["id"], teamId: Team["id"], id: Player["id"]) => Player

declare type GetPlayers = (districtId: District["id"], schoolId: School["id"], teamId: Team["id"]) => [Player]

// Array index for the games instead of an ID? Not sure.
declare type GetGame = (districtId: District["id"], schoolId: School["id"], teamId: Team["id"], id: Game["id"]) => Game

interface GameFilter {
    startTime?: Date
    endTime?: Date
    // maybe if we drop the school -> team hierarchy we can filter by more than one opponent.
    // I don't know how else to do it though.
    opponent?: {
        schoolId: School["id"]
        teamId: Team["id"]
    }
    home?: boolean
    state?: [GameState]
    // if games don't belong to a team then change this to be home/away team score.
    ourScore?: number
    opponentScore?: number
    won?: boolean
}

declare type GetGames = (districtId: District["id"], schoolId: School["id"], teamId: Team["id"], filter?: GameFilter) => [Game]
