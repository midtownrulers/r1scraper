// Types

// Implement validation for the IDs. It shoudn't be left a string. UUID? Regex?
export declare type ID = string;

export interface District {
  name: string;
  id: ID;
  schools: School["id"][];
}

export declare type SchoolType = "Middle" | "High";

export interface School {
  name: string;
  id: ID;
  districtId: District["id"];
  schoolType: SchoolType;
  sports: [Sport["id"], Sport["sportName"]][];
}

export interface Sport {
  id: string;
  districtId: string;
  schoolId: string;
  sportName: string;
  teams: Team["id"][];
}

// Is it possible to add an A-team or B-team prop?
// I don't think so, but if it's possible, add a property, and update the GetTeams function.

// Also does it make sense to allow to get all Teams in a district with GetTeams?
// Or do they strictly belong to a school

export interface Team {
  name: string;
  id: [ID, string];
  schoolId: School["id"];
  // If rosters aren't available, return null
  roster: Player["index"][] | null;
  games: Game["index"][] | null;
  sport: string;
}

export interface Player {
  name: string;
  // I'm not sure if it makes sense to have TeamIDs not be global, and only be valid inside a school.
  // Maybe just an array index instead of an ID?
  sportId: Sport["id"];
  teamId: Team["id"];
  schoolId: School["id"];
  districtId: District["id"];
  index: number;
}

// This can be changed to suit RankOne
export declare type GameState = "scheduled" | "pending" | "finished";

// most stuff is optional because schedules games have little to no data
export interface Game {
  index: number;
  status?: GameState;
  // again with the school -> team id system. I don't know if it makes sense.
  // Also maybe just a home boolean if Games are not assigned to both parties. (e.g global)
  homeDistrictId: District["id"];
  homeSchoolId: School["id"];
  homeTeamId: Team["id"];

  sport: Sport["id"];

  opponent?: string;

  startTime?: Date;
  // I don't know if endTimes are available.
  // Maybe just a TTL for an hour, and then progressivley get lower if state is not finished.
  home: boolean;

  homeTeamScore?: number;
  awayTeamScore?: number;
  won?: boolean;
}

// Getter Functions

// Maybe a district URL instead of an ID?
export declare type GetDistrict = (id: string) => Promise<District>;

// If other arguments make sense here, please change them. They kinda look off to me. This goes for all districtId stuff.
export declare type GetSchool = (
  districtId: District["id"],
  id: School["id"]
) => Promise<School>;

export declare type GetSchools = (
  districtId: District["id"],
  schoolType?: SchoolType
) => Promise<School[]>;

export declare type GetTeam = (
  districtId: District["id"],
  schoolId: School["id"],
  id: Team["id"],
  sport: Team["sport"]
) => Promise<Team>;

export declare type GetTeams = (
  districtId: District["id"],
  schoolId: School["id"],
  sport?: [string, string],
  // filter by grade or text in title
  level?: string | number
) => Promise<Team[]>;

// The cascading arguments are getting rediculous. Maybe there's a better solution, maybe not.
export declare type GetPlayer = (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  id: Player["index"],
  sportId: Sport["id"]
) => Promise<Player>;

export declare type GetPlayers = (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  sportId: Sport["id"]
) => Promise<Player[]>;

// Array index for the games instead of an ID? Not sure.
export declare type GetGame = (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  id: Game["index"],
  sportId: Sport["id"]
) => Promise<Game>;

export interface GameFilter {
  startTime?: Date;

  // maybe if we drop the school -> team hierarchy we can filter by more than one opponent.
  // I don't know how else to do it though.
  opponent?: {
    filterLeniant?: string;
    filterExact?: string;
  };

  home?: boolean;
  state?: GameState[];
  // if games don't belong to a team then change this to be home/away team score.

  ourScore?: [number, boolean?]; // number to filter by, whether to allow values greater than or equal to (defaults to only exact match)
  opponentScore?: [number, boolean?];
  won?: boolean;
}

export declare type GetGames = (
  districtId: District["id"],
  schoolId: School["id"],
  teamId: Team["id"],
  sportId: Sport["id"],
  filter?: GameFilter
) => Promise<Game[]>;
