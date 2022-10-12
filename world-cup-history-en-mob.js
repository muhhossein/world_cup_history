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
        top: 0,
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
const vizboardWidth = 450;
const vizboardHeight = 800;

const vizboard = d3
    .select("#vizboard-desktop")
    .append("svg")
    .classed("svg-vizboard", true)
    .attr("viewBox", `0 0 ${vizboardWidth} ${vizboardHeight}`)
    .attr("preserveAspectRatio", "xMinYMin meet");
// .style("border", "1px dashed red");

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
        matches: +point.pld,
        goals: +point.gf,
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
        .range([0 + 10, width - 20]);

    const wc_stages_scale = d3
        .scalePoint()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range([0 + 150, height - 250]);

    const wc_labels_scale = d3
        .scalePoint()
        .domain(["First round", "Second round", "Quarter-finals", "Fourth-place", "Third-place", "Runner-up", "Winner"])
        .range([0 + 170, height - 230]);

    const wc_h_scale = d3
        .scaleLinear()
        .domain([1, 8])
        .range([0, width + 90]);

    const color_scale = d3
        .scaleOrdinal()
        .domain(["R1", "R2", "QF", "4th", "3rd", "2nd", "1st"])
        .range(["#B3EEFF", "#7CDAFF", "#47C6FF", "#32A2EF", "url(#gradient-3)", "url(#gradient-2)", "url(#gradient-1)"]);
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
    var svgDefs = svg.append("defs");
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
    const central_group = svg.append("g").classed("central-group", true).attr("transform", `translate(0,0)`);

    // border
    central_group
        .append("rect")
        .attr("x", -130)
        .attr("y", 60)
        .attr("height", 530)
        .attr("width", width + 260)
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
        .attr("width", 34)
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
        .attr("x", (d) => wc_h_scale(d.count) + 17.5)
        .attr("y", (d) => wc_stages_scale(d.stage) + 18)
        .style("fill", (d) => color_scale_txt(d.stage))
        .style("fill-opacity", 1)
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .text((d) => d.year);

    // labels
    const stage_labels = central_group
        .selectAll("text.stage-label")
        .data(["First round", "Second round", "Quarter-finals", "Fourth-place", "Third-place", "Runner-up", "Winner"])
        .join("text")
        .attr("class", "stage-label")
        .attr("x", -120)
        .attr("y", (d) => wc_labels_scale(d))
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .text((d) => d);

    // v line
    central_group
        .append("line")
        .attr("x1", -14)
        .attr("y1", 150)
        .attr("x2", -14)
        .attr("y2", 510)
        .style("stroke", "grey")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3);

    // footer
    central_group
        .append("text")
        .attr("x", -120)
        .attr("y", 550)
        .style("font-size", "8px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(1) 1930, 1950–1970 and 1986–2018: group stage | 1934–1938: knockout round of 16");

    central_group
        .append("text")
        .attr("x", -120)
        .attr("y", 563)
        .style("font-size", "8px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("1974–1982: first group stage.");

    central_group
        .append("text")
        .attr("x", -120)
        .attr("y", 580)
        .style("font-size", "8px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(2) 1974–1982: second group stage | 1986–2022: knockout round of 16.");

    central_group
        .append("text")
        .attr("x", -60)
        .attr("y", 168)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(1)");

    central_group
        .append("text")
        .attr("x", -44)
        .attr("y", 223)
        .style("font-size", "9px")
        .style("font-weight", "400")
        .style("text-align", "center")
        .style("fill", "grey")
        .text("(2)");

    // matches
    central_group
        .append("text")
        .attr("x", width / 2 - 100)
        .attr("y", 75)
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .text("Matches");

    central_group
        .append("text")
        .attr("id", "id-matches")
        .attr("x", width / 2 - 100)
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
        .attr("x", width / 2 + 100)
        .attr("y", 75)
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("text-align", "center")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .text("Goals");

    central_group
        .append("text")
        .attr("id", "id-goals")
        .attr("x", width / 2 + 100)
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
            .attr("x", width / 2 - 52.5)
            .attr("y", 19)
            .attr("width", 105)
            .attr("height", 62)
            .style("fill", "white")
            .style("stroke", "#4d1c3e")
            .style("opacity", 1);

        d3.select(this)
            .append("image")
            .attr("id", "id-flag-a")
            .attr("x", width / 2 - 50)
            .attr("y", 50 - 35)
            .attr("width", "100px")
            .attr("height", "70px")
            .attr("href", `flags/Brazil.jpg`)
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
        d3.select("#id-appearances").text(worldcup_history_data.filter((d) => d.team_txt == team_x).length);

        //bars
        d3.selectAll(".team-bars").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.bars-${team_x}`).transition().duration(50).style("opacity", 1);

        // labels
        d3.selectAll(".team-labels").transition().duration(200).style("opacity", 0);
        d3.selectAll(`.labels-${team_x}`).transition().duration(50).style("opacity", 1);

        // flag
        d3.select("#id-flag-a").attr("href", `flags/${team_x}.jpg`);

        // matches and goals
        if (team_x != "Qatar") {
            d3.select(`#id-matches`).text(worldcup_history_data.filter((d) => d.team_txt == team_x)[0].matches);
            d3.select(`#id-goals`).text(worldcup_history_data.filter((d) => d.team_txt == team_x)[0].goals);
        } else {
            d3.select(`#id-matches`).text("0");
            d3.select(`#id-goals`).text("0");
        }
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
