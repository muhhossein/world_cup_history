///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 01. Setup //////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dimensions
let dimensions = {
    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.9,
    margin: {
        top: 70,
        right: 140,
        bottom: 70,
        left: 140,
    },
};

//Define drawing area within "dimensions" object
dimensions.vizboardWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;

dimensions.vizboardHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Draw SVG
const vizboardSide = 1200;

const vizboard = d3.select("#vizboard").append("svg").classed("svg-vizboard", true).attr("viewBox", `0 0 ${vizboardSide} ${vizboardSide}`);
// .attr("preserveAspectRatio", "xMinYMin meet");
// .style("border", "1px dashed lightblue")

let svg = vizboard.append("g").style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create SVG dimensions
let width = vizboardSide - dimensions.margin.left - dimensions.margin.right;
let height = vizboardSide - dimensions.margin.top - dimensions.margin.bottom;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 02. Data ///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// let points = [];
// for (var i = 0; i < 24; i++) {
//     var x = {
//         group: i % 2 == 0 ? 0 : 1, //0-4
//         // group: 1,
//         value: 10,
//     };
//     points.push(x);
// }

// // // Test Data
// // console.log("data:", points);
// const matches_file = "matches_1900_ar.csv";
// const matches_long_file = "matches_long_1900_ar.csv";
// const matches_summary_file = "matches_summary_1900.csv";
// const matches_stats_file = "matches_stats_1900.csv";

// // dataset
// var worldcup_matches = [];
// var worldcup_matches_long = [];
// var worldcup_matches_summary = [];
// var worldcup_matches_stats = [];
// var worldcup_countries = [];

// // matches converter function
// var matches_converter = function (point) {
//     return {
//         serial: +point.serial,
//         home_team: point.home_team_txt,
//         away_team: point.away_team_txt,
//         home_team_ar: point.home_team_ar,
//         away_team_ar: point.away_team_ar,
//         tournament_ar: point.tournament_ar,
//         home_score: +point.home_score,
//         away_score: +point.away_score,
//         home_result_desc: point.home_result_desc,
//         away_result_desc: point.away_result_desc,
//         match_serial: +point.serial,
//         year: +point.year,
//         day: +point.day,
//         decade: +point.decade,
//         year_n: +point.year_n,
//         size: +point.result,
//         home_random: +point.home_random,
//         away_random: +point.away_random,
//         home_group: +point.home_group,
//         away_group: +point.away_group,
//     };
// };

// // data converter function
// var matches_long_converter = function (point) {
//     return {
//         serial: +point.serial,
//         team: point.team_txt,
//         team_ar: point.team_ar,
//         home_team: point.home_team_txt,
//         away_team: point.away_team_txt,
//         home_team_ar: point.home_team_ar,
//         away_team_ar: point.away_team_ar,
//         match_serial: +point.serial,
//         year: +point.year,
//         month: +point.month,
//         day: +point.day,
//         decade: +point.decade,
//         year_n: +point.year_n,
//         result_desc: point.result_desc,
//         size: +point.size,
//         random: +point.random,
//         tournament_ar: point.tournament_ar,
//         home_score: point.home_score,
//         away_score: point.away_score,
//         country_ar: point.country_ar,

//         team_a_txt: point.team_a_txt,
//         team_b_txt: point.team_b_txt,
//         team_a_ar: point.team_a_ar,
//         team_b_ar: point.team_b_ar,
//         result_desc_a: point.result_desc_a,
//         result_desc_b: point.result_desc_b,
//         score_a: +point.score_a,
//         score_b: +point.score_b,
//         random_a: +point.random_a,
//         random_b: +point.random_b,
//     };
// };

// // data converter function
// var matches_summary_converter = function (point) {
//     return {
//         team: point.team,
//         team_ar: point.team_ar,
//         team_text: point.team_txt,
//         matches: +point.matches,
//         winning: +point.winner,
//         loss: +point.loser,
//         draw: +point.draw,
//         start_year: +point.start_year,
//         end_year: +point.end_year,
//         winning_perc: +point.winning_perc,
//         losing_perc: +point.losing_perc,
//         draw_perc: +point.draw_perc,
//     };
// };

// // data converter function
// var matches_stats_converter = function (point) {
//     return {
//         team_a: point.team_a,
//         team_a_ar: point.team_a_ar,
//         team_a_txt: point.team_a_txt,
//         team_b: point.team_b,
//         team_b_ar: point.team_b_ar,
//         team_b_txt: point.team_b_txt,
//         matches: +point.total,
//         winning_perc: +point.winning_perc,
//         losing_perc: +point.losing_perc,
//         draw_perc: +point.draw_perc,

//         winner: +point.winner,
//         loser: +point.loser,
//         draw: +point.draw,
//     };
// };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Promise.all([
    d3.csv(matches_file, matches_converter),
    d3.csv(matches_long_file, matches_long_converter),
    d3.csv(matches_summary_file, matches_summary_converter),
    d3.csv(matches_stats_file, matches_stats_converter),
]).then(function ([matches, matches_long, matches_summary, matches_stats]) {
    // save data in dataset variable
    worldcup_matches = matches;
    worldcup_matches_long = matches_long;
    worldcup_matches_summary = matches_summary;
    worldcup_matches_stats = matches_stats;

    // console.log(worldcup_matches_long[0]);
    // call the draw function
    dataviz();
}); //end of then method

function dataviz() {
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 03. Nested Data ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Teams Data
    worldcup_countries = d3.flatRollup(
        worldcup_matches_long,
        (v) => v.length,
        (d) => d.team,
        (s) => s.team_text
    );

    // console.log(worldcup_countries[1]);
    worldcup_matches_long = worldcup_matches_long.slice().sort((a, b) => d3.ascending(a.team, b.team));
    worldcup_countries = worldcup_countries.slice().sort((a, b) => d3.ascending(a[0], b[0]));
    worldcup_countries = worldcup_countries.map((d, i) => {
        return {
            team: d[0],
            team_text: d[1],
            group: i % 2 == 0 ? 1 : 0,
        };
    });
    // console.log(worldcup_countries);

    // Nested Data
    var worldcup_matches_long_groups = d3.flatGroup(worldcup_matches_long, (d) => d.team);

    // console.log(worldcup_matches_long_groups);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 04. Scales /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Radial Scale
    const radial_domain = [0, 115];
    const inner_r = 0;
    const outer_r = d3.min([width, height]) * 0.5;
    const radial_scale = d3.scaleLinear().domain(radial_domain).range([inner_r, outer_r]);

    // Angle Scale
    const angluar_domain = [0, 32]; // 0-23، we have a domain reserved for 23 element.
    const angluar_scale = d3
        .scaleLinear()
        .domain(angluar_domain)
        .range([0, 2 * Math.PI]);

    // Angle Slice
    const angleSlice = (Math.PI * 2) / (worldcup_countries.length + 0);

    // A scale that gives a X target position for each group
    const group_scale = d3.scalePoint().domain([0, 1]).range([87, 115]);

    // Sub Circles Scale
    const subGroups_scale = d3.scaleLinear().domain([1, 13]).range([10, 67]);

    // Team Group Scale
    const teams_domain = worldcup_countries.map((d, i) => d.team);
    const teams_range = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

    const teams_group_serial = d3.scaleOrdinal().domain(teams_domain).range(d3.range(0, 32, 1));

    const teams_group_scale = d3.scaleOrdinal().domain(teams_domain).range(teams_range);

    // circles radius scale
    const r_scale = d3.scaleLinear().domain([0, 100]).range([0, 50]);

    // Color Scale
    // https://github.com/d3/d3-scale-chromatic
    // const color_scale = d3
    //   .scaleSequential()
    //   .domain(d3.extent(points, (d) => d.value))
    //   .interpolator(d3.interpolateCividis);

    // Angle Match Slice
    const angleMatchSlice = (Math.PI * 2) / 10;

    // Match Color Scale
    const match_color_scale = d3.scaleOrdinal().domain(["winner", "loser", "draw"]).range(["#0286fa", "#990261", "grey"]);

    // Match Color Scale
    const cline_color_scale = d3.scaleOrdinal().domain(["winner", "loser", "draw"]).range(["#0286fa", "#990261", "grey"]);

    // Match Result Scale
    const match_result_scale = d3.scaleSqrt().domain([0, 12]).range([0.5, 5]);

    // Match Result Scale
    const match_line_scale = d3.scaleLinear().domain([0, 12]).range([0.2, 2.5]);

    // Opacity Scale
    const result_opacity_scale = d3.scaleLinear().domain([0, 12]).range([0.1, 0.4]);

    // Match Color Scale
    const month_scale = d3
        .scaleOrdinal()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        .range(["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]);

    // teams arab cup scale
    const acup_domain = worldcup_countries.map((d, i) => d.team);
    const acup_range = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
    const acup_scale = d3.scaleOrdinal().domain(acup_domain).range(acup_range);
    // console.log(acup_domain);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 05. Shapes Creation ////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create Group
    const mainGroup = svg
        .append("g")
        .classed("main-group", true)
        .attr("transform", `translate(${width * 0.5}, ${height * 0.5})`);

    const p_position = function (d, i) {
        let x = radial_scale(group_scale(d.group)) * Math.cos(angleSlice * (i + 1) - Math.PI / 2);
        let y = radial_scale(group_scale(d.group)) * Math.sin(angleSlice * (i + 1) - Math.PI / 2);

        return [x, y];
    };

    const subGroups = mainGroup
        .selectAll("g.sub-groups")
        .data(worldcup_countries)
        .enter()
        .append("g")
        .classed("sub-groups", true)
        .attr("id", (d) => d.team)
        .attr("transform", (d, i) => `translate(${p_position(d, i)})`);

    // Reference Circles
    const refCircles = subGroups.each(function (d, i) {
        d3.select(this)
            .selectAll("circle.ref-circles")
            .data(d3.range(1, 14, 1))
            .enter()
            .append("circle")
            .classed("ref-circles", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", (d, i) => subGroups_scale(d))
            .style("fill", "#dbdbdb")
            .style("fill-opacity", 0)
            .style("stroke", "grey")
            // .style("stroke-dasharray", "5,0")
            .style("stroke-width", 0.7)
            .style("stroke-opacity", 0.5);
    });

    const back_circle = mainGroup.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 800).style("opacity", 0).style("fill", "#dbdbdb");

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 06. Matches Circles ////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Position Functions
    const team_position = function (d, i) {
        let x = radial_scale(group_scale(teams_group_scale(d[0]))) * Math.cos(angleSlice * teams_group_serial(d[0]) - Math.PI / 2);

        let y = radial_scale(group_scale(teams_group_scale(d[0]))) * Math.sin(angleSlice * teams_group_serial(d[0]) - Math.PI / 2);

        return [x, y];
    };

    // Team Groups
    let teamGroups = mainGroup
        .selectAll("g.team-groups")
        .data(worldcup_matches_long_groups)
        .enter()
        .append("g")
        .classed("team-groups", true)
        .attr("id", (d) => `${d[0]}_team`)
        .attr("transform", (d, i) => `translate(${team_position(d, i)})`);
    // .each(function (d, i) {
    //     // d3.select(this).append("circle").attr("cx", 0).attr("cy", 0).attr("r", 3).style("fill", "#96005f");
    // });

    // console.log(worldcup_matches_long_groups[0][1]);
    // console.log(teamGroups.data());

    ///////////////////////////////////////////////////////////////////////////
    // Position Functions
    const match_Xposition = function (d) {
        let x_delta = ((d.random - 0.5) * Math.PI) / 1;
        let y_delta = (d.random - 0.5) / 10;
        let x = (subGroups_scale(d.decade) + y_delta) * Math.cos(angleMatchSlice * d.year_n + x_delta - Math.PI / 2);
        return x;
    };

    const match_Yposition = function (d) {
        let x_delta = ((d.random - 0.5) * Math.PI) / 1;
        let y_delta = (d.random - 0.5) / 10;
        let y = (subGroups_scale(d.decade) + y_delta) * Math.sin(angleMatchSlice * d.year_n + x_delta - Math.PI / 2);
        return y;
    };

    //////////////////////////////////////////////////////////////////////////////
    var connection_line;

    // Match Circles
    let matchCircles = teamGroups.each(function (d, i) {
        d3.select(this)
            .selectAll("circle.match-circles")
            .data((d, i) => d[1])
            .enter()
            .append("circle")
            .attr("class", (d) => `match-circles home_team_${d.home_team} away_team_${d.away_team} serial_${d.serial} team_${d.team}`)
            .attr("cx", (d, i) => match_Xposition(d, i))
            .attr("cy", (d, i) => match_Yposition(d, i))
            .attr("r", (d, i) => match_result_scale(d.size))
            .style("fill", (d, i) => match_color_scale(d.result_desc))
            .style("stroke-width", 1)
            .style("stroke", (d, i) => match_color_scale(d.result_desc))
            .style("fill-opacity", 0.6)
            .style("stroke-opacity", 0.5);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 08. Connection lines Functions /////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Position Functions
    const line_x1 = function (d) {
        let p1 =
            radial_scale(group_scale(teams_group_scale(d.home_team))) *
            Math.cos(angleSlice * teams_group_serial(d.home_team) - Math.PI / 2);

        let x_delta = ((d.home_random - 0.5) * Math.PI) / 1;
        let y_delta = (d.home_random - 0.5) / 10;

        let p2 = (subGroups_scale(d.decade) + y_delta) * Math.cos(angleMatchSlice * d.year_n + x_delta - Math.PI / 2);

        let p = p1 + p2;
        return p;
    };
    const line_y1 = function (d) {
        let p1 =
            radial_scale(group_scale(teams_group_scale(d.home_team))) *
            Math.sin(angleSlice * teams_group_serial(d.home_team) - Math.PI / 2);

        let x_delta = ((d.home_random - 0.5) * Math.PI) / 1;
        let y_delta = (d.home_random - 0.5) / 10;

        let p2 = (subGroups_scale(d.decade) + y_delta) * Math.sin(angleMatchSlice * d.year_n + x_delta - Math.PI / 2);
        let p = p1 + p2;
        return p;
    };
    const line_x2 = function (d) {
        let p1 =
            radial_scale(group_scale(teams_group_scale(d.away_team))) *
            Math.cos(angleSlice * teams_group_serial(d.away_team) - Math.PI / 2);

        let x_delta = ((d.away_random - 0.5) * Math.PI) / 1;
        let y_delta = (d.away_random - 0.5) / 10;

        let p2 = (subGroups_scale(d.decade) + y_delta) * Math.cos(angleMatchSlice * d.year_n + x_delta - Math.PI / 2);
        let p = p1 + p2;
        return p;
    };
    const line_y2 = function (d) {
        let p1 =
            radial_scale(group_scale(teams_group_scale(d.away_team))) *
            Math.sin(angleSlice * teams_group_serial(d.away_team) - Math.PI / 2);

        let x_delta = ((d.away_random - 0.5) * Math.PI) / 1;
        let y_delta = (d.away_random - 0.5) / 10;

        let p2 = (subGroups_scale(d.decade) + y_delta) * Math.sin(angleMatchSlice * d.year_n + x_delta - Math.PI / 2);
        let p = p1 + p2;
        return p;
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 09. Connection lines ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Connection lines
    const connection_lines = mainGroup
        .selectAll("line.connection-lines")
        .data(worldcup_matches)
        .enter()
        .append("path")
        .classed("connection-lines", true)
        .attr(
            "class",
            (d) =>
                `cline_${teams_group_serial(d.home_team)} cline_${teams_group_serial(d.away_team)} line_serial_${d.serial} home_team_l_${
                    d.home_team
                } away_team_l_${d.away_team}`
        )
        .attr("d", (d) => `M ${line_x1(d)} ${line_y1(d)} Q 0 0 ${line_x2(d)} ${line_y2(d)}`)
        .style("stroke-width", (d) => match_line_scale(d.size))
        .style("stroke", "black")
        .style("fill", "none")
        .attr("opacity", 1)
        .style("opacity", (d) => result_opacity_scale(d.size) / 2)
        .style("stroke-linecap", "round");
    // .lower();
    matchCircles.raise();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 10. Radial Text ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Position Functions
    const text_position = function (d, i) {
        let radial_length = radial_scale(group_scale(teams_group_scale(d[0])));
        // console.log(radial_length);
        let x =
            (radial_length > 400 ? radial_length + 118 : radial_length + 170) *
            Math.cos(angleSlice * teams_group_serial(d[0]) - Math.PI / 2);

        let y =
            (radial_length > 400 ? radial_length + 118 : radial_length + 170) *
            Math.sin(angleSlice * teams_group_serial(d[0]) - Math.PI / 2);

        return [x, y];
    };

    // console.log(worldcup_matches_long_groups[29][0]);
    // Text Groups
    let textGroups = mainGroup
        .selectAll("g.text-groups")
        .data(worldcup_matches_long_groups)
        .enter()
        .append("g")
        .classed("text-groups", true)
        .attr("id", (d) => `${d[0]}_team_txt`)
        .attr("transform", (d, i) => `translate(${text_position(d, i)})`)
        .each(function (d, i) {
            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 22)
                .attr("class", "blue-circle-s")
                .style("fill", "grey")
                .style("opacity", 0.1);

            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 30)
                .attr("class", "blue-circle-l")
                .style("fill", "grey")
                .style("opacity", 0.1);

            d3.select(this)
                .append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("id", (d) => `label_${d[0]}`)
                .text((d, i) => d[1][0].team_ar)
                .style("fill", "black")
                .style("font-size", "14px")
                .style("font-weight", "600")
                .style("text-anchor", "middle")
                .style("alignment-baseline", "middle");

            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 40)
                .attr("class", "hover-circle")
                .style("fill", "#96005f")
                .style("opacity", 0);
        });

    // change labels
    d3.select("#label_Saudi_Arabia").text("السعودية");
    // d3.select("#label_Denmark").attr("transform", "translate(5,0)");
    d3.select("#label_South_Korea").attr("transform", "translate(5,-12)");
    d3.select("#label_United_States").text("الولايات المتحدة").attr("transform", "translate(0,0)");
    // d3.select("#label_Costa_Rica").text("Costa Rica").attr("transform", "translate(0,0)");

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 11. Flags ///////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Position Functions
    const flag_position = function (d, i) {
        let radial_length = radial_scale(group_scale(teams_group_scale(d[0])));
        // console.log(radial_length);
        let x =
            (radial_length > 400 ? radial_length + 80 : radial_length + 133) *
            Math.cos(angleSlice * teams_group_serial(d[0]) - Math.PI / 2);

        let y =
            (radial_length > 400 ? radial_length + 80 : radial_length + 133) *
            Math.sin(angleSlice * teams_group_serial(d[0]) - Math.PI / 2);

        return [x, y];
    };

    // Text Groups
    let flagGroups = mainGroup
        .selectAll("g.flag-groups")
        .data(worldcup_matches_long_groups)
        .enter()
        .append("g")
        .classed("flag-groups", true)
        .attr("id", (d) => `${d[0]}_team_txt`)
        .attr("transform", (d, i) => `translate(${flag_position(d, i)})`)
        .each(function (d, i) {
            d3.select(this).append("circle").attr("cx", 0).attr("cy", 0).attr("r", 12).style("fill", "#dbdbdb").style("opacity", 1);

            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 11)
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-width", 0.5)
                .style("stroke-opacity", 0.6)
                .style("fill-opacity", 0.5);

            d3.select(this)
                .append("image")
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", "16px")
                .attr("height", "16px")
                .attr("href", (d) => `flags/${d[0]}.png`)
                .style("opacity", 1);
        });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 10. Default Text ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const default_text = mainGroup
        .append("g")
        .attr("id", "id-default-text")
        .style("transform", "translate(0px,0px)")
        .style("font-size", "18px")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "pink")
        .style("opacity", 1)
        .each(function (d, i) {
            // central circle
            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 180)
                .attr("class", "id-central-circle")
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-opacity", 0.6)
                .style("fill-opacity", 0.3);

            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 170)
                .style("fill", "white")
                .style("stroke", "white")
                .style("fill-opacity", 0.6)
                .style("opacity", 0.6);

            d3.select(this)
                .append("image")
                .attr("x", -60)
                .attr("y", -100)
                .attr("width", "120px")
                .attr("height", "120px")
                .style("opacity", 1)
                .attr("href", "flags/football_ar.png");

            d3.select(this)
                .append("text")
                .attr("x", 0)
                .attr("y", 65)
                .style("font-size", "14px")
                .style("font-weight", "600")
                .style("fill", "black")
                .style("text-align", "center")
                .style("text-anchor", "middle")
                .style("direction", "rtl")
                .text("استكشف تاريخ المنافسة لمنتخبات");

            d3.select(this)
                .append("text")
                .attr("x", 0)
                .attr("y", 81)
                .style("font-size", "14px")
                .style("font-weight", "600")
                .style("fill", "black")
                .style("text-align", "center")
                .style("text-anchor", "middle")
                .style("direction", "rtl")
                .text("كأس العالم منذ عام 1900 إلى عام 2022");
        });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 11. Central Text 1 /////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var goals_a_length = 5;
    var goals_a_data = d3.range(0, goals_a_length, 1);

    var goals_b_length = 5;
    var goals_b_data = d3.range(0, goals_b_length, 1);
    var goals_a, goals_b;

    const match_text = mainGroup
        .append("g")
        .attr("id", "id-g-text")
        .style("transform", "translate(0px,0px)")
        .style("font-size", "18px")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "black") //ff0062
        .style("font-weight", "600")
        .style("opacity", 0)
        .each(function (d, i) {
            // central circle
            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 200)
                .attr("class", "id-central-circle")
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-opacity", 0.6)
                .style("fill-opacity", 0.5);

            d3.select(this).append("text").attr("y", -50).style("font-size", "26px").style("fill", "grey").text(" : ");
            // team a
            d3.select(this)
                .append("text")
                .attr("id", "id-team-a")
                .attr("x", -10)
                .attr("y", -50)
                .style("font-size", "26px")
                .style("fill", "black")
                .style("text-align", "right")
                .style("text-anchor", "end")
                .text("Team A");

            // team b
            d3.select(this)
                .append("text")
                .attr("id", "id-team-b")
                .attr("x", 10)
                .attr("y", -50)
                .style("font-size", "26px")
                .style("fill", "black")
                .style("text-align", "left")
                .style("text-anchor", "start")
                .text("Team B");

            // score
            d3.select(this).append("text").attr("y", -20).style("font-size", "26px").style("fill", "grey").text(" : ");

            d3.select(this)
                .append("text")
                .attr("id", "id-score-a")
                .attr("x", -10)
                .attr("y", -20)
                .style("font-size", "26px")
                .style("fill", "black")
                .style("text-align", "right")
                .style("text-anchor", "end")
                .text("Scores");

            d3.select(this)
                .append("text")
                .attr("id", "id-score-b")
                .attr("x", 10)
                .attr("y", -20)
                .style("font-size", "26px")
                .style("fill", "black")
                .style("text-align", "left")
                .style("text-anchor", "start")
                .text("Scores");

            // tournament
            d3.select(this)
                .append("text")
                .attr("id", "id-tournament")
                .attr("y", 50)
                .style("fill", "black")
                .style("font-size", "22px")
                .text("Teams");

            // country
            d3.select(this)
                .append("text")
                .attr("id", "id-country")
                .attr("y", 80)
                .style("direction", "rtl")
                .style("font-size", "20px")
                .style("opacity", 0.8)
                .text("Teams");

            // team a and b flags
            d3.select(this)
                .append("rect")
                .attr("x", -74)
                .attr("y", -136)
                .attr("height", 32)
                .attr("width", 48)
                .style("fill", "white")
                .style("stroke", "black")
                .style("fill-opacity", 0.3)
                .style("opacity", 1);

            d3.select(this)
                .append("rect")
                .attr("x", 26)
                .attr("y", -136)
                .attr("height", 32)
                .attr("width", 48)
                .style("fill", "white")
                .style("stroke", "black")
                .style("fill-opacity", 0.3)
                .style("opacity", 1);

            d3.select(this)
                .append("image")
                .attr("id", "id-team-a-flag")
                .attr("x", -70)
                .attr("y", -140)
                .attr("width", "40px")
                .attr("height", "40px")
                .style("opacity", 1)
                .attr("href", "flags/football_ar.png");

            d3.select(this)
                .append("image")
                .attr("id", "id-team-b-flag")
                .attr("x", 30)
                .attr("y", -140)
                .attr("width", "40px")
                .attr("height", "40px")
                .style("opacity", 1)
                .attr("href", "flags/football_ar.png");
        });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 12. Central Text 2 /////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const team_text = mainGroup
        .append("g")
        .attr("id", "id-team-text")
        .style("transform", "translate(0px,0px)")
        .style("font-size", "24px")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("opacity", 0)
        .each(function (d, i) {
            // central circle
            d3.select(this)
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 200)
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-opacity", 0.6)
                .style("fill-opacity", 0.5);

            d3.select(this)
                .append("rect")
                .attr("id", "t-image-circle")
                .attr("x", -35)
                .attr("y", -152)
                .attr("height", 44)
                .attr("width", 70)
                .style("fill", "white")
                .style("stroke", "black")
                .style("fill-opacity", 0.5)
                .style("opacity", 1);

            d3.select(this)
                .append("image")
                .attr("id", "t-image")
                .attr("x", -30)
                .attr("y", -160)
                .attr("width", "60px")
                .attr("height", "60px")
                .style("opacity", 1)
                .attr("href", "flags/football_ar.png");

            // team
            // .range(["#ffffff", "#e80093", "#00e1ff"]);
            d3.select(this)
                .append("text")
                .attr("id", "t-team")
                .attr("y", -60)
                .style("direction", "rtl")
                .style("font-size", "30px")
                .style("font-weight", "600")
                .style("fill", "black")
                .text("");

            // total matches line
            d3.select(this)
                .append("text")
                .attr("y", -12)
                .attr("id", "t-matches")
                .style("direction", "rtl")
                .style("font-size", "26px")
                .style("font-weight", "500")
                .style("opacity", 1)
                .text("");

            // years
            d3.select(this)
                .append("text")
                .attr("id", "t-years")
                .attr("y", 20)
                .style("font-size", "20px")
                .style("direction", "rtl")
                .text("");

            // stats line
            d3.select(this)
                .append("text")
                .attr("y", 70)
                .attr("id", "t-results")
                .style("font-size", "18px")
                .style("direction", "rtl")
                .style("opacity", 1)
                .text("");

            // stats
            //.range(["#195aa6", "#bf3d72", "#e8cc5d"]);
            //.range(["#003470", "#ad0a4c", "#ffcc00"]);
            d3.select(this)
                .append("rect")
                .attr("x", -100)
                .attr("y", 90)
                .attr("height", 10)
                .attr("width", 50)
                .attr("id", "rect-wins")
                .style("fill", "#990261")
                .style("opacity", 0.8);

            d3.select(this)
                .append("rect")
                .attr("x", 0)
                .attr("y", 90)
                .attr("height", 10)
                .attr("width", 20)
                .attr("id", "rect-draw")
                .style("fill", "grey")
                .style("opacity", 0.4);

            d3.select(this)
                .append("rect")
                .attr("x", 20)
                .attr("y", 90)
                .attr("height", 10)
                .attr("width", 30)
                .attr("id", "rect-losses")
                .style("fill", "#0286fa")
                .style("opacity", 0.8);

            // sep line
            d3.select(this)
                .append("line")
                .attr("x1", -10)
                .attr("y1", 85)
                .attr("x2", -10)
                .attr("y2", 115)
                .attr("id", "team-stats-line1")
                .style("stroke", "#990261")

                .style("opacity", 0.9);

            d3.select(this)
                .append("line")
                .attr("x1", 10)
                .attr("y1", 85)
                .attr("x2", 10)
                .attr("y2", 115)
                .attr("id", "team-stats-line2")
                .style("stroke", "#0286fa")
                .style("opacity", 0.9);

            // sep line text
            d3.select(this)
                .append("text")
                .attr("x", -10)
                .attr("y", 137)
                .attr("id", "team-stats-txt1")
                .style("fill", "#990261")
                .style("font-size", "20px")
                .style("font-weight", "500")
                .style("opacity", 1)
                .text("50%");

            d3.select(this)
                .append("text")
                .attr("x", 10)
                .attr("y", 137)
                .attr("id", "team-stats-txt2")
                .style("fill", "#0286fa")
                .style("font-size", "20px")
                .style("font-weight", "500")
                .style("opacity", 1)
                .text("50%");

            // Others
            d3.select(this)
                .append("text")
                .attr("y", 110)
                .attr("class", "t-info")
                .style("fill", "white")
                .style("font-size", "20px")
                .style("opacity", 1)
                .text("");

            d3.select(this)
                .append("text")
                .attr("y", 135)
                .attr("class", "t-info")
                .style("fill", "white")
                .style("font-size", "20px")
                .style("opacity", 1)
                .text("");
        });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 12. Central Text 3 /////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const stats_text = mainGroup
        .append("g")
        .attr("id", "id-stats-text")
        .style("transform", "translate(0px,0px)")
        .style("font-size", "18px")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "#ff0062")
        .style("opacity", 0)
        .each(function (d, i) {
            // central circle
            d3.select(this).append("circle").attr("cx", 0).attr("cy", 0).attr("r", 200).style("fill", "#00023b").style("opacity", 0.5);

            d3.select(this).append("text").attr("y", -50).style("font-size", "22px").style("fill", "pink").text(" : ");

            // team a
            d3.select(this)
                .append("text")
                .attr("id", "id-team-stats-a")
                .attr("x", -10)
                .attr("y", -50)
                .style("font-size", "22px")
                .style("fill", "white")
                .style("text-align", "right")
                .style("text-anchor", "end")
                .text("Team A");

            // team b
            d3.select(this)
                .append("text")
                .attr("id", "id-team-stats-b")
                .attr("x", 10)
                .attr("y", -50)
                .style("font-size", "22px")
                .style("fill", "deeppink")
                .style("text-align", "left")
                .style("text-anchor", "start")
                .text("Team B");

            // score
            d3.select(this).append("text").attr("y", -20).style("font-size", "22px").style("fill", "pink").text(" : ");

            d3.select(this)
                .append("text")
                .attr("id", "id-wins-a")
                .attr("x", -10)
                .attr("y", -20)
                .style("font-size", "22px")
                .style("fill", "white")
                .style("text-align", "right")
                .style("text-anchor", "end")
                .text("Scores");

            d3.select(this)
                .append("text")
                .attr("id", "id-wins-b")
                .attr("x", 10)
                .attr("y", -20)
                .style("font-size", "22px")
                .style("fill", "deeppink")
                .style("text-align", "left")
                .style("text-anchor", "start")
                .text("Scores");

            // stats
            d3.select(this)
                .append("rect")
                .attr("x", -100)
                .attr("y", 50)
                .attr("height", 10)
                .attr("width", 50)
                .attr("id", "rect-stats-wins")
                .style("fill", "#ffffff")
                .style("opacity", 0.8);

            d3.select(this)
                .append("rect")
                .attr("x", 0)
                .attr("y", 50)
                .attr("height", 10)
                .attr("width", 20)
                .attr("id", "rect-stats-draw")
                .style("fill", "#00e1ff")
                .style("opacity", 0.8);

            d3.select(this)
                .append("rect")
                .attr("x", 20)
                .attr("y", 50)
                .attr("height", 10)
                .attr("width", 30)
                .attr("id", "rect-stats-losses")
                .style("fill", "#e80093")
                .style("opacity", 0.8);

            // sep line
            d3.select(this)
                .append("line")
                .attr("x1", -10)
                .attr("y1", 35)
                .attr("x2", -10)
                .attr("y2", 65)
                .attr("id", "sep-stats-line1")
                .style("stroke", "white")
                .style("opacity", 0.9);

            d3.select(this)
                .append("line")
                .attr("x1", 10)
                .attr("y1", 45)
                .attr("x2", 10)
                .attr("y2", 75)
                .attr("id", "sep-stats-line2")
                .style("stroke", "deeppink")
                .style("opacity", 0.9);

            // sep line text
            d3.select(this)
                .append("text")
                .attr("x", -10)
                .attr("y", 30)
                .attr("id", "sep-stats-txt1")
                .style("fill", "white")
                .style("font-size", "24px")
                .style("opacity", 1)
                .text("50%");

            d3.select(this)
                .append("text")
                .attr("x", 10)
                .attr("y", 90)
                .attr("id", "sep-stats-txt2")
                .style("fill", "deeppink")
                .style("font-size", "24px")
                .style("opacity", 1)
                .text("50%");

            // draw
            d3.select(this)
                .append("text")
                .attr("y", 5)
                .attr("id", "t-stats-draw")
                .style("fill", "#00e1ff")
                .style("font-size", "16px")
                .style("opacity", 1)
                .text("Hover over any match");

            // total matches line
            d3.select(this)
                .append("text")
                .attr("y", 140)
                .attr("id", "t-stats-matches")
                .style("fill", "pink")
                .style("font-size", "16px")
                .style("opacity", 1)
                .text("Hover over any match");
        });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 12. Events /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var detect_result_desc = function (selected_team, home_team, away_team, home_result_desc, away_result_desc) {
        let x;
        if (selected_team == home_team) {
            x = home_result_desc;
        } else if (selected_team == away_team) {
            x = away_result_desc;
        }
        return x;
    };
    //////////////////////////////////////////////////////////// mouse over
    function mouseover() {
        let selected_team = d3.select(this).data()[0][0];
        // console.log(selected_team);

        // text groups
        d3.select(`#${selected_team}_team_txt`).style("opacity", 1);
        d3.select(`#${selected_team}_team_txt .blue-circle-s`).transition().duration(200).style("fill", "black").attr("r", 34);
        d3.select(`#${selected_team}_team_txt .blue-circle-l`).transition().duration(200).style("fill", "black").attr("r", 24);
    }

    //////////////////////////////////////////////////////////// mouse down
    function mousedown() {
        // default text
        default_text.style("opacity", 0);

        //////////////////////
        let selected_team = d3.select(this).data()[0][0];
        console.log(selected_team);

        connection_lines.style("stroke", "black");
        connection_lines.style("opacity", 0);

        d3.selectAll(`path.cline_${teams_group_serial(selected_team)}`)
            .style("stroke", (d, i) =>
                cline_color_scale(detect_result_desc(selected_team, d.home_team, d.away_team, d.home_result_desc, d.away_result_desc))
            )
            .style("opacity", (d) => result_opacity_scale(d.size) * 1.5);

        // Match Circles
        d3.selectAll(".match-circles").style("fill-opacity", 0).style("stroke-opacity", 0).style("visibility", "hidden");

        d3.selectAll(`circle.home_team_${selected_team}`)
            .style("fill-opacity", 0.6)
            .style("stroke-opacity", 0.5)
            .style("visibility", "visible");

        d3.selectAll(`circle.away_team_${selected_team}`)
            .style("fill-opacity", 0.6)
            .style("stroke-opacity", 0.5)
            .style("visibility", "visible");

        // text groups
        // textGroups.style("opacity", 0.65);
        d3.select(`#${selected_team}_team_txt`).style("opacity", 1);
        // d3.select(`#${selected_team}_team_txt .blue-circle-s`).transition().duration(200).attr("r", 22);
        // d3.select(`#${selected_team}_team_txt .blue-circle-l`).transition().duration(200).attr("r", 30);

        // team text groups
        let team_summary = worldcup_matches_summary.filter((d) => d.team_text == selected_team)[0];
        // console.log(team_summary);

        team_text.style("opacity", 1);
        d3.select("#t-team").text(`${team_summary.team_ar}`);
        d3.select("#t-years").text(`من ${team_summary.start_year} إلي ${team_summary.end_year}`);
        d3.select("#t-matches").text(`${team_summary.matches} مباراة`);
        d3.select("#t-results").text(
            `${team_summary.winning_perc}% فوز | ${team_summary.draw_perc}% تعادل | ${team_summary.losing_perc}% خسارة`
        );

        // stats rect and lines
        d3.select("#rect-wins").attr("width", `${team_summary.losing_perc * 2}`);
        d3.select("#rect-draw")
            .attr("x", `${-100 + team_summary.losing_perc * 2}`)
            .attr("width", `${team_summary.draw_perc * 2}`);
        d3.select("#rect-losses")
            .attr("x", `${-100 + team_summary.losing_perc * 2 + team_summary.draw_perc * 2}`)
            .attr("width", `${team_summary.winning_perc * 2}`);

        d3.select("#team-stats-line1")
            .attr("x1", `${-100 + team_summary.losing_perc * 2}`)
            .attr("x2", `${-100 + team_summary.losing_perc * 2}`);
        d3.select("#team-stats-txt1")
            .attr("x", `${-100 + team_summary.losing_perc * 2}`)
            .text(`${team_summary.losing_perc}%`);

        d3.select("#team-stats-line2")
            .attr("x1", `${-100 + team_summary.losing_perc * 2 + team_summary.draw_perc * 2}`)
            .attr("x2", `${-100 + team_summary.losing_perc * 2 + team_summary.draw_perc * 2}`);
        d3.select("#team-stats-txt2")
            .attr("x", `${-100 + team_summary.losing_perc * 2 + team_summary.draw_perc * 2}`)
            .text(`${team_summary.winning_perc}%`);

        // text groups
        // textGroups.style("opacity", 0.65);
        d3.select(`#${selected_team}_team_txt`).style("opacity", 1);
        d3.select(`#${selected_team}_team_txt .blue-circle-s`).transition().duration(200).style("fill", "black").attr("r", 28);
        d3.select(`#${selected_team}_team_txt .blue-circle-l`).transition().duration(200).style("fill", "black").attr("r", 33);
        d3.select("#t-image").style("opacity", 0.85).attr("href", `flags/${selected_team}.jpg`);

        // team
        team_text.style("opacity", 1);
        d3.selectAll(".t-info").style("opacity", 0);

        // stats
        stats_text.style("opacity", 0);
    }

    //////////////////////////////////////////////////////////// mouse leave
    function mouseleave() {
        connection_lines.style("stroke", "black").style("opacity", (d) => result_opacity_scale(d.size) / 2);

        // Match Circles //
        d3.selectAll(".match-circles")
            .style("fill-opacity", 0.6)
            .style("stroke-opacity", 0.5)
            .style("stroke", (d, i) => match_color_scale(d.result_desc))
            .style("visibility", "visible");

        // text groups
        textGroups.style("opacity", 1);
        d3.selectAll(`.blue-circle-s`).transition().duration(50).attr("r", 22);
        d3.selectAll(`.blue-circle-l`).transition().duration(50).attr("r", 30);

        // goals
        d3.selectAll("circle.goals-a").style("opacity", 0);
        d3.selectAll("circle.goals-b").style("opacity", 0);

        match_text.style("opacity", 0);
        team_text.style("opacity", 0);
        default_text.style("opacity", 1);
    }

    // overCircles.on("mouseenter", mouseover).on("mouseleave", mouseleave);
    d3.selectAll(".hover-circle")
        .on("mouseover", mouseover)
        .on("mousedown", mousedown)
        .on("mouseleave", function () {
            // team_text.style("opacity", 0);
            d3.selectAll(".blue-circle-s").transition().duration(50).style("fill", "grey").attr("r", 22);
            d3.selectAll(".blue-circle-l").transition().duration(50).style("fill", "grey").attr("r", 30);
        });
    // .on("mouseleave", mouseleave);
    // default text

    back_circle.on("mousedown", mouseleave);
    refCircles.lower();

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // mouse over
    function match_mouseover() {
        let match_data = d3.select(this).data()[0];
        // console.log(match_data);

        match_text.style("opacity", 1);
        // text
        d3.select("#id-team-a").text(`${match_data.home_team_ar}`);
        d3.select("#id-team-b").text(`${match_data.away_team_ar}`);
        d3.select("#id-score-a").text(`${match_data.home_score}`);
        d3.select("#id-score-b").text(`${match_data.away_score}`);
        d3.select("#id-tournament").text(`${match_data.tournament_ar}`);
        d3.select("#id-country").text(`${match_data.country_ar} | ${month_scale(match_data.month)} ${match_data.day}, ${match_data.year}`);
        d3.select("#id-team-a-flag").attr("href", `flags/${match_data.home_team}.jpg`);
        d3.select("#id-team-b-flag").attr("href", `flags/${match_data.away_team}.jpg`);
        // goals
        goals_a_length = match_data.home_score;
        goals_a_data = d3.range(0, goals_a_length, 1);
        goals_b_length = match_data.away_score;
        goals_b_data = d3.range(0, goals_b_length, 1);

        goals_a = mainGroup.each(function (d, i) {
            d3.select(this)
                .selectAll("circle.goals-a")
                .data(goals_a_data)
                .join("circle")
                .attr("id", "id-goals-a")
                .attr("class", "goals-a")
                .attr("cx", (d, i) => -40 - 12 * i)
                .attr("cy", -27)
                .attr("r", 4)
                .style("fill-opacity", 1)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("fill", "grey");
        });
        goals_b = mainGroup.each(function (d, i) {
            d3.select(this)
                .selectAll("circle.goals-b")
                .data(goals_b_data)
                .join("circle")
                .attr("id", "id-goals-b")
                .attr("class", "goals-b")
                .attr("cx", (d, i) => 40 + 12 * i)
                .attr("cy", -27)
                .attr("r", 4)
                .style("fill-opacity", 1)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("fill", "grey");
        });

        // connection line
        const line_color = d3.select(`.line_serial_${match_data.serial}`).style("stroke");
        // console.log(line_color);

        connection_line = mainGroup
            .selectAll("line.connection-line")
            .data(worldcup_matches.filter((d) => d.match_serial == match_data.serial))
            .enter()
            .append("path")
            .classed("connection-line", true)
            .attr("d", (d) => `M ${line_x1(d)} ${line_y1(d)} Q 0 0 ${line_x2(d)} ${line_y2(d)}`)
            .style("stroke-width", 2)
            .style("stroke", `black`)
            .style("fill", "none")
            .style("opacity", 1)
            .style("stroke-linecap", "round")
            .raise();

        d3.selectAll(`.line_serial_${match_data.serial}`)
            // .style("stroke-width", 2.5) ///////////////////////////////////////
            .style("stroke-linecap", "round")
            .lower();

        // circles
        d3.selectAll(`.serial_${match_data.serial}`)
            .style("fill-opacity", 1)
            .style("stroke-opacity", 1)
            .style("stroke", "black")
            .attr("r", (d, i) => match_result_scale(d.size) + 5)
            .raise();

        match_text.raise();
        matchCircles.raise();

        team_text.style("opacity", 0);
        d3.selectAll(".t-info").style("opacity", 0);

        // stats
        stats_text.style("opacity", 0);

        // default text
        default_text.style("opacity", 0);
    } //end of mouse over

    // mouse leave
    function match_mouseleave() {
        let match_data = d3.select(this).data()[0];
        match_text.style("opacity", 0);

        // connection_lines
        //   .style("stroke-width", match_line_scale(match_data.size))
        //   .style("opacity", result_opacity_scale(match_data.size) / 1.2);

        connection_line.remove();
        // Match Circles
        d3.selectAll(".match-circles")
            .style("fill-opacity", 0.6)
            .style("stroke-opacity", 0.5)
            .style("stroke", (d, i) => match_color_scale(d.result_desc))
            .attr("r", (d, i) => match_result_scale(d.size) + 0);

        // goals
        d3.selectAll("circle.goals-a").style("opacity", 0);
        d3.selectAll("circle.goals-b").style("opacity", 0);

        // default text
        default_text.style("opacity", 0);
    }

    d3.selectAll("circle.match-circles").on("mouseover", match_mouseover).on("mouseleave", match_mouseleave);

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    function resolveAfter2Seconds(x) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(x);
            }, 2000);
        });
    }

    async function team_selection(team_x) {
        let selected_team = team_x;

        // default text
        default_text.style("opacity", 0);

        //////////////////////

        connection_lines.style("stroke", "black");
        connection_lines.style("opacity", 0);

        d3.selectAll(`path.cline_${teams_group_serial(selected_team)}`)
            .style("stroke", (d, i) =>
                cline_color_scale(detect_result_desc(selected_team, d.home_team, d.away_team, d.home_result_desc, d.away_result_desc))
            )
            .style("opacity", (d) => result_opacity_scale(d.size) * 1.5);

        // Match Circles
        d3.selectAll(".match-circles").style("fill-opacity", 0).style("stroke-opacity", 0).style("visibility", "hidden");

        d3.selectAll(`circle.home_team_${selected_team}`)
            .style("fill-opacity", 0.8)
            .style("stroke-opacity", 1)
            .style("visibility", "visible");

        d3.selectAll(`circle.away_team_${selected_team}`)
            .style("fill-opacity", 0.8)
            .style("stroke-opacity", 1)
            .style("visibility", "visible");

        // text groups
        // textGroups.style("opacity", 0.65);
        d3.select(`#${selected_team}_team_txt`).style("opacity", 1);
        d3.select(`#${selected_team}_team_txt .blue-circle-s`).attr("r", 22);
        d3.select(`#${selected_team}_team_txt .blue-circle-l`).attr("r", 33);

        // team text groups
        let team_summary = worldcup_matches_summary.filter((d) => d.team_text == selected_team)[0];
        // console.log(team_summary);

        team_text.style("opacity", 1);
        d3.select("#t-team").text(`${team_summary.team}`);
        d3.select("#t-years").text(`from ${team_summary.start_year} to ${team_summary.end_year}`);
        d3.select("#t-matches").text(`${team_summary.matches} matches`);
        d3.select("#t-results").text(
            `${team_summary.winning_perc}% wins | ${team_summary.draw_perc}% draw | ${team_summary.losing_perc}% losses`
        );

        // stats rect and lines
        d3.select("#rect-wins").attr("width", `${team_summary.winning_perc * 2}`);
        d3.select("#rect-draw")
            .attr("x", `${-100 + team_summary.winning_perc * 2}`)
            .attr("width", `${team_summary.draw_perc * 2}`);
        d3.select("#rect-losses")
            .attr("x", `${-100 + team_summary.winning_perc * 2 + team_summary.draw_perc * 2}`)
            .attr("width", `${team_summary.losing_perc * 2}`);

        d3.select("#team-stats-line1")
            .attr("x1", `${-100 + team_summary.winning_perc * 2}`)
            .attr("x2", `${-100 + team_summary.winning_perc * 2}`);
        d3.select("#team-stats-txt1")
            .attr("x", `${-100 + team_summary.winning_perc * 2}`)
            .text(`${team_summary.winning_perc}%`);

        d3.select("#team-stats-line2")
            .attr("x1", `${-100 + team_summary.winning_perc * 2 + team_summary.draw_perc * 2}`)
            .attr("x2", `${-100 + team_summary.winning_perc * 2 + team_summary.draw_perc * 2}`);
        d3.select("#team-stats-txt2")
            .attr("x", `${-100 + team_summary.winning_perc * 2 + team_summary.draw_perc * 2}`)
            .text(`${team_summary.losing_perc}%`);

        // text groups
        // textGroups.style("opacity", 0.65);
        d3.select(`#${selected_team}_team_txt`).style("opacity", 1);
        d3.select(`#${selected_team}_team_txt .blue-circle-s`).style("fill", "#8d32a8").attr("r", 18);
        d3.select(`#${selected_team}_team_txt .blue-circle-l`).style("fill", "#8d32a8").attr("r", 33);
        d3.select("#t-image").style("opacity", 0.85).attr("href", `flags/${selected_team}.jpg`);

        // team
        team_text.style("opacity", 1);
        d3.selectAll(".t-info").style("opacity", 0);

        // stats
        stats_text.style("opacity", 0);
    }

    refCircles.lower();
} // end of the dataviz
