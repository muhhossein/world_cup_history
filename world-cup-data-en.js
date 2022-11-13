///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 01. History ///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const worldcup_history_file = "world_cup_history.csv";

// dataset
var worldcup_history_data = [];

// matches converter function
var worldcup_history_converter = function (point) {
    return {
        serial: +point.serial,
        cup_serial: +point.cup_serial,
        team: point.team,
        team_txt: point.team_txt,
        year: +point.year,
        host: point.host,
        appearances: +point.appearances,
        stage: point.stage,
        count: +point.count,
        matches: +point.pld,
        goals: +point.gf,
    };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 02. Head to head ///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let points = [];
for (var i = 0; i < 24; i++) {
    var x = {
        group: i % 2 == 0 ? 0 : 1, //0-4
        // group: 1,
        value: 10,
    };
    points.push(x);
}

const matches_file = "matches_1900_en.csv";
const matches_long_file = "matches_long_1900_en.csv";
const matches_summary_file = "matches_summary_1900.csv";
const matches_stats_file = "matches_stats_1900.csv";

// dataset
var worldcup_matches = [];
var worldcup_matches_long = [];
var worldcup_matches_summary = [];
var worldcup_matches_stats = [];
var worldcup_countries = [];
var worldcup_matches_long_groups = [];

// matches converter function
var matches_converter = function (point) {
    return {
        serial: +point.serial,
        home_team: point.home_team_txt,
        away_team: point.away_team_txt,
        home_team_text: point.home_team,
        away_team_text: point.away_team,
        tournament: point.tournament,
        home_score: +point.home_score,
        away_score: +point.away_score,
        home_result_desc: point.home_result_desc,
        away_result_desc: point.away_result_desc,
        match_serial: +point.serial,
        year: +point.year,
        day: +point.day,
        decade: +point.decade,
        year_n: +point.year_n,
        size: +point.result,
        home_random: +point.home_random,
        away_random: +point.away_random,
        home_group: +point.home_group,
        away_group: +point.away_group,
    };
};

// data converter function
var matches_long_converter = function (point) {
    return {
        serial: +point.serial,
        team: point.team_txt,
        team_text: point.team,
        home_team: point.home_team_txt,
        away_team: point.away_team_txt,
        home_team_text: point.home_team,
        away_team_text: point.away_team,
        match_serial: +point.serial,
        year: +point.year,
        month: +point.month,
        day: +point.day,
        decade: +point.decade,
        year_n: +point.year_n,
        result_desc: point.result_desc,
        size: +point.size,
        random: +point.random,
        tournament: point.tournament,
        date: point.date,
        home_score: point.home_score,
        away_score: point.away_score,
        city: point.city,
        country: point.country,

        team_a: point.team_a,
        team_b: point.team_b,
        team_a_txt: point.team_a_txt,
        team_b_txt: point.team_b_txt,
        result_desc_a: point.result_desc_a,
        result_desc_b: point.result_desc_b,
        score_a: +point.score_a,
        score_b: +point.score_b,
        random_a: +point.random_a,
        random_b: +point.random_b,
    };
};

// data converter function
var matches_summary_converter = function (point) {
    return {
        team: point.team,
        team_text: point.team_txt,
        matches: +point.matches,
        winning: +point.winner,
        loss: +point.loser,
        draw: +point.draw,
        start_year: +point.start_year,
        end_year: +point.end_year,
        winning_perc: +point.winning_perc,
        losing_perc: +point.losing_perc,
        draw_perc: +point.draw_perc,
    };
};

// data converter function
var matches_stats_converter = function (point) {
    return {
        team_a: point.team_a,
        team_a_txt: point.team_a_txt,
        team_b: point.team_b,
        team_b_txt: point.team_b_txt,
        matches: +point.total,
        winning_perc: +point.winning_perc,
        losing_perc: +point.losing_perc,
        draw_perc: +point.draw_perc,

        winner: +point.winner,
        loser: +point.loser,
        draw: +point.draw,
    };
};
