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
        top: 90,
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
const vizboardWidth = 1200;
const vizboardHeight = 760;

const vizboard = d3
    .select("#vizboard-desktop")
    .append("svg")
    .classed("svg-vizboard", true)
    .attr("viewBox", `0 0 ${vizboardWidth} ${vizboardHeight}`);
// .attr("preserveAspectRatio", "xMinYMin meet");
// .style("border", "1px dashed lightblue")

let svg = vizboard.append("g").style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create SVG dimensions
let width = vizboardWidth - dimensions.margin.left - dimensions.margin.right;
let height = vizboardHeight - dimensions.margin.top - dimensions.margin.bottom;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 02. Data ///////////////////////////////////////////////////////////////////////////////////////////////////////
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
    };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Promise.all([d3.csv(worldcup_history_file, worldcup_history_converter)]).then(function ([history]) {
    // save data in dataset variable
    worldcup_history_data = history;

    // console.log(worldcup_history_data);
    // call the draw function
    dataviz();
}); //end of then method

function dataviz() {
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 03. Nested Data ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // teams data
    worldcup_countries = d3.flatRollup(
        worldcup_history_data,
        (v) => v.length,
        (d) => d.team
    );

    // countries
    worldcup_countries_domain = worldcup_countries.map((d, i) => d[0]);

    // check
    // console.log(worldcup_countries);
    // console.log(worldcup_countries_domain);

    // years Data
    worldcup_years = d3.flatRollup(
        worldcup_history_data,
        (v) => v.length,
        (d) => d.year,
        (d) => d.host,
        (d) => d.cup_serial
    );

    // sort years
    worldcup_years = worldcup_years.sort((a, b) => d3.ascending(a[0], b[0]));

    worldcup_years_domain = worldcup_years.map((d, i) => d[0]);

    // check
    // console.log(worldcup_years);
    // console.log(worldcup_years_domain);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 04. Scales /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const wc_years_scale = d3
        .scalePoint()
        .domain(worldcup_years_domain)
        .range([0 + 40, width - 40]);

    const wc_stages_scale = d3
        .scalePoint()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range([0 + 150, height - 200]);

    const wc_labels_scale = d3
        .scalePoint()
        .domain([
            "Group stage",
            "Round of 16",
            "Quarter-finals",
            "4th: Semi-finalist",
            "3rd: Semi-finalist",
            "2nd: Runner-up",
            "1st: Winner",
        ])
        .range([0 + 150, height - 200]);

    const wc_h_scale = d3
        .scaleLinear()
        .domain([1, 8])
        .range([0 + 200, width - 200]);

    const color_scale = d3
        .scaleOrdinal()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range(["#a1a1a1", "#a36880", "#99365d", "#87a16d", "#628045", "#466b9c", "#003470"]);

    const color_scale_txt = d3
        .scaleOrdinal()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range(["white", "white", "white", "white", "white", "white", "white"]);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 05. Header /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var selected_team = "Brazil";

    var main_group = svg.append("g").classed("main-group", true).attr("transform", "translate(0,0)");

    // border
    main_group
        .append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("height", 75)
        .attr("width", width - 20)
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
        .attr("x2", width - 10)
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
        .attr("id", "id-appearences")
        .attr("x", width + 30)
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
        .attr("x", width + 30)
        .attr("y", 65)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "10px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text("Appearences");

    main_group
        .append("rect")
        .attr("x", width - 8)
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
        .attr("x", 0 - 30)
        .attr("y", 35)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text("World Cup");

    main_group
        .append("text")
        .attr("x", 0 - 30)
        .attr("y", 65)
        .style("fill", "black")
        .style("fill-opacity", 1)
        .style("font-size", "10px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text("Host");

    main_group
        .append("line")
        .attr("x1", 0 - 30)
        .attr("y1", 40)
        .attr("x2", 0 - 30)
        .attr("y2", 55)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    main_group
        .append("circle")
        .attr("r", 2)
        .attr("cx", -30)
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
            .style("font-size", "9px")
            .style("font-weight", "500")
            .style("text-align", "center")
            .style("text-anchor", "middle")
            .text((d) => d.host);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 06. Body /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const central_group = svg.append("g").classed("central-group", true).attr("transform", `translate(0,70)`);

    // border
    central_group
        .append("rect")
        .attr("x", -70)
        .attr("y", 60)
        .attr("height", 480)
        .attr("width", width + 140)
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
        .data([
            "Group stage",
            "Round of 16",
            "Quarter-finals",
            "4th: Semi-finalist",
            "3rd: Semi-finalist",
            "2nd: Runner-up",
            "1st: Winner",
        ])
        .join("text")
        .attr("class", "stage-label")
        .attr("x", 70)
        .attr("y", (d) => wc_labels_scale(d) + 17)
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .text((d) => d);

    // v line
    central_group
        .append("line")
        .attr("x1", 180)
        .attr("y1", 150)
        .attr("x2", 180)
        .attr("y2", 430)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    // labels
    central_group
        .append("text")
        .attr("x", 70)
        .attr("y", 120)
        .style("font-size", "16px")
        .style("font-weight", "500")
        .style("text-align", "center")
        // .style("fill", "grey")
        .text("Achievement in every World Cup");

    // footer
    central_group
        .append("text")
        .attr("x", 70)
        .attr("y", 480)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(1) 1934–1938: knockout round of 16, 1974–1982: first group stage.");

    central_group
        .append("text")
        .attr("x", 70)
        .attr("y", 495)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(2) 1974–1982: second group stage.");

    central_group
        .append("text")
        .attr("x", 140)
        .attr("y", 166)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(1)");

    central_group
        .append("text")
        .attr("x", 137)
        .attr("y", 207)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(2)");

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 00. flag ///////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const flag = central_group.append("g").each(function (d, i) {
        d3.select(this)
            .append("circle")
            .attr("cx", width / 2)
            .attr("cy", 70)
            .attr("r", 40)
            .style("fill", "white")
            .style("stroke", "#4d1c3e")
            .style("opacity", 1);

        d3.select(this)
            .append("image")
            .attr("id", "id-flag-a")
            .attr("x", width / 2 - 35)
            .attr("y", 70 - 35)
            .attr("width", "70px")
            .attr("height", "70px")
            .attr("href", `flags/Brazil.png`)
            .style("opacity", 1);
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
    d3.select("#id-appearences").text(worldcup_history_data.filter((d) => d.team_txt == "Brazil").length);

    // bars
    d3.selectAll(".team-bars").style("opacity", 0);
    d3.selectAll(".bars-Brazil").style("opacity", 1);

    // labels
    d3.selectAll(".team-labels").style("opacity", 0);
    d3.selectAll(`.labels-Brazil`).style("opacity", 1);

    // update function
    function team_stats_show(team_x) {
        //timeline
        d3.selectAll(".timeline").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.cup-${team_x}`).transition().duration(50).style("opacity", 1);
        d3.select("#id-appearences").text(worldcup_history_data.filter((d) => d.team_txt == team_x).length);

        //bars
        d3.selectAll(".team-bars").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.bars-${team_x}`).transition().duration(50).style("opacity", 1);

        // labels
        d3.selectAll(".team-labels").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.labels-${team_x}`).transition().duration(50).style("opacity", 1);

        // flag
        d3.select("#id-flag-a").attr("href", `flags/${team_x}.png`);
    }

    /* When the user clicks on the button,
        toggle between hiding and showing the dropdown content */
    var a_team = document.getElementById("team-a");
    var atext, avalue;

    // console.log(a_team);
    //////////////////////////////////////////////////
    var x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");
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
