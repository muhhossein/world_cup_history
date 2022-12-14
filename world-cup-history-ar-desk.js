///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 01. Setup //////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dimensions
let dimensions_hist_d_ar = {
    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.9,
    margin: {
        top: 00,
        right: 140,
        bottom: 70,
        left: 140,
    },
};

//Define drawing area within "dimensions" object
dimensions_hist_d_ar.vizboardWidth = dimensions_hist_d_ar.width - dimensions_hist_d_ar.margin.left - dimensions_hist_d_ar.margin.right;

dimensions_hist_d_ar.vizboardHeight = dimensions_hist_d_ar.height - dimensions_hist_d_ar.margin.top - dimensions_hist_d_ar.margin.bottom;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Draw SVG
const vizboardWidth_hist_d_ar = 1200;
const vizboardHeight_hist_d_ar = 600;

const vizboard_hist_d_ar = d3
    .select("#vizboard-hist-d-ar")
    .append("svg")
    .classed("svg-vizboard", true)
    .attr("viewBox", `0 0 ${vizboardWidth_hist_d_ar} ${vizboardHeight_hist_d_ar}`)
    .attr("preserveAspectRatio", "xMinYMin meet");
// .style("border", "1px dashed red");

let svg_hist_d_ar = vizboard_hist_d_ar
    .append("g")
    .style("transform", `translate(${dimensions_hist_d_ar.margin.left}px, ${dimensions_hist_d_ar.margin.top}px)`);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create SVG dimensions
let width_hist_d_ar = vizboardWidth_hist_d_ar - dimensions_hist_d_ar.margin.left - dimensions_hist_d_ar.margin.right;
let height_hist_d_ar = vizboardHeight_hist_d_ar - dimensions_hist_d_ar.margin.top - dimensions_hist_d_ar.margin.bottom;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 02. Data ///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const worldcup_history_file = "world_cup_history.csv";

// // dataset
// var worldcup_history_data = [];

// // matches converter function
// var worldcup_history_converter = function (point) {
//     return {
//         serial: +point.serial,
//         cup_serial: +point.cup_serial,
//         team: point.team,
//         team_txt: point.team_txt,
//         year: +point.year,
//         host: point.host,
//         host_ar: point.host_ar,
//         appearances: +point.appearances,
//         stage: point.stage,
//         count: +point.count,
//         matches: +point.pld,
//         goals: +point.gf,
//     };
// };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Promise.all([d3.csv(worldcup_history_file, worldcup_history_converter)]).then(function ([history]) {
    // save data in dataset variable
    worldcup_history_data = history;

    // console.log(worldcup_history_data);
    // call the draw function
    dataviz_hist_d_ar();
}); //end of then method

function dataviz_hist_d_ar() {
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 03. Nested Data ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // teams data
    let worldcup_countries = d3.flatRollup(
        worldcup_history_data,
        (v) => v.length,
        (d) => d.team
    );

    // years Data
    let worldcup_years = d3.flatRollup(
        worldcup_history_data,
        (v) => v.length,
        (d) => d.year,
        (d) => d.host,
        (d) => d.host_ar,
        (d) => d.cup_serial
    );

    // sort years
    worldcup_years = worldcup_years.sort((a, b) => d3.ascending(a[0], b[0]));

    let worldcup_years_domain = worldcup_years.map((d, i) => d[0]);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 04. Scales /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const wc_years_scale = d3
        .scalePoint()
        .domain(worldcup_years_domain)
        .range([width_hist_d_ar - 40, 0 + 40]);

    const wc_stages_scale = d3
        .scalePoint()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range([0 + 120, height_hist_d_ar - 150]);

    const wc_labels_scale = d3
        .scalePoint()
        .domain(["?????????? ??????????", "?????????? ????????????", "?????? ??????????????", "???????????? ????????????", "???????????? ????????????", "???????????? ????????????", "????????????"])
        .range([0 + 120, height_hist_d_ar - 150]);

    const wc_h_scale = d3
        .scaleLinear()
        .domain([1, 8])
        .range([width_hist_d_ar - 200, 0 + 200]);

    const color_scale = d3
        .scaleOrdinal()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range(["#B3EEFF", "#7CDAFF", "#47C6FF", "#32A2EF", "#A8603D", "#ADADAD", "#FFBA00"]);
    // .range(["#a1a1a1", "#a36880", "#99365d", "#87a16d", "#628045", "#466b9c", "#003470"]);

    const color_scale_txt = d3
        .scaleOrdinal()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range(["grey", "white", "white", "white", "white", "white", "black"]);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 06. Gradient ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Create the svg:defs element and the main gradient definition.
    var svgDefs = svg_hist_d_ar.append("defs");
    // 1
    var gradient_1 = svgDefs.append("linearGradient").attr("id", "gradient-1");
    gradient_1
        .attr("x1", "0%") // from 0% to 100%
        .attr("y1", "0%") // from 0% to 100%
        .attr("x2", "100%") // from 0% to 100%
        .attr("y2", "100%"); // from 0% to 100%
    gradient_1.append("stop").attr("class", "stop-left-1").attr("offset", "0");
    gradient_1.append("stop").attr("class", "stop-center-1").attr("offset", "0.5");
    gradient_1.append("stop").attr("class", "stop-right-1").attr("offset", "1");

    // 2
    var gradient_2 = svgDefs.append("linearGradient").attr("id", "gradient-2");
    gradient_2
        .attr("x1", "0%") // from 0% to 100%
        .attr("y1", "0%") // from 0% to 100%
        .attr("x2", "100%") // from 0% to 100%
        .attr("y2", "100%"); // from 0% to 100%
    gradient_2.append("stop").attr("class", "stop-left-2").attr("offset", "0");
    gradient_2.append("stop").attr("class", "stop-center-2").attr("offset", "0.5");
    gradient_2.append("stop").attr("class", "stop-right-2").attr("offset", "1");

    //3
    var gradient_3 = svgDefs.append("linearGradient").attr("id", "gradient-3");
    gradient_3
        .attr("x1", "0%") // from 0% to 100%
        .attr("y1", "0%") // from 0% to 100%
        .attr("x2", "100%") // from 0% to 100%
        .attr("y2", "100%"); // from 0% to 100%
    gradient_3.append("stop").attr("class", "stop-left-3").attr("offset", "0");
    gradient_3.append("stop").attr("class", "stop-center-3").attr("offset", "0.5");
    gradient_3.append("stop").attr("class", "stop-right-3").attr("offset", "1");
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 06. Body /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const central_group = svg_hist_d_ar.append("g").classed("central-group", true).attr("transform", `translate(0,0)`);

    // border
    central_group
        .append("rect")
        .attr("x", -70)
        .attr("y", 60)
        .attr("height", 420)
        .attr("width", width_hist_d_ar + 140)
        .style("fill", "none")
        .style("fill-opacity", 1)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    // rects
    const bars = central_group
        .selectAll("rect.team-bars")
        .data(worldcup_history_data)
        .join("rect")
        .attr("class", (d) => `team-bars bars-${d.team_txt}`)
        .attr("x", (d) => wc_h_scale(d.count))
        .attr("y", (d) => wc_stages_scale(d.stage))
        .attr("height", 30)
        .attr("width", 60)
        .style("fill", (d) => color_scale(d.stage))
        .style("fill-opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", 1)
        .style("stroke-opacity", 1);

    // year
    const years = central_group
        .selectAll("text.team-labels")
        .data(worldcup_history_data)
        .join("text")
        .attr("class", (d) => `team-labels labels-${d.team_txt}`)
        .attr("x", (d) => wc_h_scale(d.count) + 30)
        .attr("y", (d) => wc_stages_scale(d.stage) + 18)
        .style("fill", (d) => color_scale_txt(d.stage))
        .style("fill-opacity", 1)
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text((d) => d.year);

    // labels
    const stage_labels = central_group
        .selectAll("text.stage-label")
        .data(["?????????? ??????????", "?????????? ????????????", "?????? ??????????????", "???????????? ????????????", "???????????? ????????????", "???????????? ????????????", "????????????"])
        .join("text")
        .attr("class", "stage-label")
        .attr("x", width_hist_d_ar - 70)
        .attr("y", (d) => wc_labels_scale(d) + 17)
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .text((d) => d);

    // v line
    central_group
        .append("line")
        .attr("x1", width_hist_d_ar - 100)
        .attr("y1", 120)
        .attr("x2", width_hist_d_ar - 100)
        .attr("y2", 410)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    // footer
    central_group
        .append("text")
        .attr("x", width_hist_d_ar - 0)
        .attr("y", 440)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .style("direction", "rtl")
        .text("(1) 1930 ?? 1950-1970  ?? 1986-2018: ?????? ?????????????????? | 1934-1938: ?????? ?????? 16 | 1974-1982: ?????? ?????????????????? ??????????.");

    central_group
        .append("text")
        .attr("x", width_hist_d_ar)
        .attr("y", 455)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "right")
        .style("fill", "grey")
        .style("direction", "rtl")
        .text("(2) 1974-1982: ?????? ?????????????????? ???????????? | 1986-2022: ?????? ??????16.");

    central_group
        .append("text")
        .attr("x", width_hist_d_ar - 85)
        .attr("y", 136)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(1)");

    central_group
        .append("text")
        .attr("x", width_hist_d_ar - 85)
        .attr("y", 178)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(2)");

    // matches
    central_group
        .append("text")
        .attr("x", width_hist_d_ar / 2 + 100)
        .attr("y", 75)
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .text("????????????");

    central_group
        .append("text")
        .attr("id", "id-matches")
        .attr("x", width_hist_d_ar / 2 + 100)
        .attr("y", 53)
        .style("font-size", "22px")
        .style("font-weight", "600")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("100");

    // goals
    central_group
        .append("text")
        .attr("x", width_hist_d_ar / 2 - 100)
        .attr("y", 75)
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .text("??????");

    central_group
        .append("text")
        .attr("id", "id-goals")
        .attr("x", width_hist_d_ar / 2 - 100)
        .attr("y", 53)
        .style("font-size", "22px")
        .style("font-weight", "600")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("300");

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 00. flag ///////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const flag = central_group.append("g").each(function (d, i) {
        d3.select(this)
            .append("rect")
            .attr("x", width_hist_d_ar / 2 - 52.5)
            .attr("y", 19)
            .attr("width", 105)
            .attr("height", 62)
            .style("fill", "white")
            .style("stroke", "#4d1c3e")
            .style("opacity", 1);

        d3.select(this)
            .append("image")
            .attr("id", "id-flag-a")
            .attr("x", width_hist_d_ar / 2 - 50)
            .attr("y", 50 - 35)
            .attr("width", "100px")
            .attr("height", "70px")
            .attr("href", `flags/Brazil.jpg`)
            .style("opacity", 1);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 05. Header /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var selected_team = "Brazil";

    var main_group = svg_hist_d_ar.append("g").classed("main-group", true).attr("transform", "translate(0,490)");

    // border
    main_group
        .append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("height", 75)
        .attr("width", width_hist_d_ar - 20)
        .style("fill", "none")
        .style("fill-opacity", 1)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    // line
    main_group
        .append("line")
        .attr("x1", 10)
        .attr("y1", 30)
        .attr("x2", width_hist_d_ar - 10)
        .attr("y2", 30)
        .style("stroke", "grey")
        .style("stroke-width", 8)
        .style("stroke-opacity", 0.3);

    // title
    // main_group
    //     .append("text")
    //     .attr("x", width / 2)
    //     .attr("y", -10)
    //     .style("fill", "black")
    //     .style("fill-opacity", 1)
    //     .style("font-size", "16px")
    //     .style("font-weight", "500")
    //     .style("text-align", "center")
    //     .style("text-anchor", "middle")
    //     .text("Team's history in World Cup");

    // right
    main_group
        .append("text")
        .attr("id", "id-appearances")
        .attr("x", 0 - 30)
        .attr("y", 45)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "22px")
        .style("font-weight", "600")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text(worldcup_history_data.filter((d) => d.team == selected_team).length);

    main_group
        .append("text")
        .attr("x", 0 - 30)
        .attr("y", 63)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "10px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text("????????????");

    main_group
        .append("text")
        .attr("x", 0 - 30)
        .attr("y", 75)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "10px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text("??????????");

    main_group
        .append("rect")
        .attr("x", width_hist_d_ar - 8)
        .attr("y", 10)
        .attr("height", 75)
        .attr("width", 78)
        .style("fill", "none")
        .style("fill-opacity", 1)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    // left group
    main_group
        .append("text")
        .attr("x", width_hist_d_ar + 30)
        .attr("y", 35)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text("?????? ????????????");

    main_group
        .append("text")
        .attr("x", width_hist_d_ar + 30)
        .attr("y", 65)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "10px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text("????????????????");

    main_group
        .append("line")
        .attr("x1", width_hist_d_ar + 30)
        .attr("y1", 40)
        .attr("x2", width_hist_d_ar + 30)
        .attr("y2", 55)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    main_group
        .append("circle")
        .attr("r", 2)
        .attr("cx", width_hist_d_ar + 30)
        .attr("cy", 55)
        .style("fill", "grey")
        .style("fill-opacity", 1);

    main_group
        .append("rect")
        .attr("x", -70)
        .attr("y", 10)
        .attr("height", 75)
        .attr("width", 78)
        .style("fill", "none")
        .style("fill-opacity", 1)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    ///////////////////////////////////////////////////////////////////////////////////////
    var year_sub_groups;

    year_sub_groups = main_group
        .selectAll("g.timeline")
        .data(worldcup_history_data)
        .enter()
        .append("g")
        .attr("class", (d) => `timeline cup-${d.team_txt}`)
        .attr("transform", (d, i) => `translate(${wc_years_scale(d.year)}, 20)`);

    // Reference rect
    var years_rects = year_sub_groups.each(function (d, i) {
        // connections
        d3.select(this)
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", (d, i) => (d.cup_serial % 2 ? 25 : 40))
            .style("stroke", "grey")
            .style("stroke-width", 1)
            .style("stroke-opacity", 0.3);

        d3.select(this)
            .append("circle")
            .attr("r", 2)
            .attr("cx", 0)
            .attr("cy", (d, i) => (d.cup_serial % 2 ? 28 : 43))
            .style("fill", "grey")
            .style("fill-opacity", 1);

        // back rect
        d3.select(this)
            .append("rect")
            .attr("x", -17)
            .attr("y", 0)
            .attr("height", 20)
            .attr("width", 34)
            .style("fill", (d) => color_scale(d.stage))
            .style("fill-opacity", 1)
            .style("stroke", "none")
            .style("stroke-width", 1)
            .style("stroke-opacity", 1);
        // .style("stroke-dasharray", "5,0")

        // year
        d3.select(this)
            .append("text")
            .attr("x", 0)
            .attr("y", 14)
            .style("fill", (d) => color_scale_txt(d.stage))
            .style("fill-opacity", 1)
            .style("font-size", "11px")
            .style("font-weight", "400")
            .style("text-align", "center")
            .style("text-anchor", "middle")
            .text((d) => d.year);

        // host
        d3.select(this)
            .append("text")
            .attr("x", 0)
            .attr("y", (d, i) => (d.cup_serial % 2 ? 40 : 55))
            .style("fill", "grey")
            .style("fill-opacity", 1)
            .style("font-size", "8px")
            .style("font-weight", "500")
            .style("text-align", "center")
            .style("text-anchor", "middle")
            .text((d) => d.host_ar);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 00. dropdown ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initial settings
    // timeline
    d3.selectAll(".timeline").style("opacity", 0);
    d3.selectAll(".cup-Brazil").style("opacity", 1);
    d3.select("#id-appearances").text(worldcup_history_data.filter((d) => d.team_txt == "Brazil").length);

    // bars
    d3.selectAll(".team-bars").style("opacity", 0);
    d3.selectAll(".bars-Brazil").style("opacity", 1);

    // labels
    d3.selectAll(".team-labels").style("opacity", 0);
    d3.selectAll(`.labels-Brazil`).style("opacity", 1);

    d3.select(`#id-matches`).text(worldcup_history_data.filter((d) => d.team_txt == "Brazil")[0].matches);
    d3.select(`#id-goals`).text(worldcup_history_data.filter((d) => d.team_txt == "Brazil")[0].goals);

    // update function
    function team_stats_show(team_x) {
        //timeline
        d3.selectAll(".timeline").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.cup-${team_x}`).transition().duration(50).style("opacity", 1);
        d3.selectAll("#id-appearances").text(worldcup_history_data.filter((d) => d.team_txt == team_x).length);

        //bars
        d3.selectAll(".team-bars").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.bars-${team_x}`).transition().duration(50).style("opacity", 1);

        // labels
        d3.selectAll(".team-labels").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.labels-${team_x}`).transition().duration(50).style("opacity", 1);

        // flag
        d3.selectAll("#id-flag-a").attr("href", `flags/${team_x}.jpg`);

        // matches and goals
        if (team_x != "Qatar") {
            d3.selectAll(`#id-matches`).text(worldcup_history_data.filter((d) => d.team_txt == team_x)[0].matches);
            d3.selectAll(`#id-goals`).text(worldcup_history_data.filter((d) => d.team_txt == team_x)[0].goals);
        } else {
            d3.selectAll(`#id-matches`).text("0");
            d3.selectAll(`#id-goals`).text("0");
        }
    }

    /* When the user clicks on the button,
        toggle between hiding and showing the dropdown content */
    var a_team = document.getElementById("team-d");
    var atext, avalue;

    // console.log(a_team);
    //////////////////////////////////////////////////
    var x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select-d");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
            /* For each option in the original select element,
          create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                /* When an item is clicked, update the original select box,
              and the selected item: */
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function (e) {
            /* When the select box is clicked, close any other select boxes,
          and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");

            atext = a_team.options[a_team.selectedIndex].text;
            avalue = a_team.options[a_team.selectedIndex].value;
            //log value
            // console.log(atext, btext);
            // console.log(avalue, bvalue);

            // selection function
            // team_selection(avalue, bvalue);
            team_stats_show(avalue);
        });
    }

    function closeAllSelect(elmnt) {
        /* A function that will close all select boxes in the document,
        except the current select box: */
        var x,
            y,
            i,
            xl,
            yl,
            arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i);
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    //     /* If the user clicks anywhere outside the select box,
    //   then close all select boxes: */
    document.addEventListener("click", closeAllSelect);
} // end of the dataviz
