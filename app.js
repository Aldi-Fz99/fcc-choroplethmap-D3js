const educationURL= "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyURL= "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData
let educationData

const canvas = d3.select("#canvas")
const tooltip = d3.select("#tooltip")
const drawMap = () => {
    canvas.selectAll("path")
          .data(countyData)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("class", "county")
          .attr("fill", (countyDataItem) => {
            let id = countyDataItem["id"]
            let county = educationData.find(item => item["fips"] === id)
            let percentage = county["bachelorsOrHigher"]
            return (percentage <= 15) ? "tomato" : (percentage <= 30)? "orange" : (percentage <= 45)? "Lightgreen" : "limegreen";
          })
          .attr("data-fips", (countyDataItem) => countyDataItem["id"] )
          .attr("data-education", (countyDataItem) => {
            let id = countyDataItem["id"]
            let county = educationData.find(item => item["fips"] === id)
            let percentage = county["bachelorsOrHigher"]
            return percentage;
          })
       .on("mouseover", (event, countyDataItem) => {
            const id = countyDataItem["id"];
            const county = educationData.find(item => item["fips"] === id);
            if (county) { // Pastikan county ditemukan
                const area = county["area_name"];
                const state = county["state"];
                const bachelor = county["bachelorsOrHigher"];
                tooltip.transition()
                       .style("visibility", "visible");
                tooltip.html(`FIPS: ${id} <br> Area: ${area} <br> State: ${state} <br> Bachelor's or Higher: ${bachelor}`)
                       .style("left", (event.pageX + 5) + "px")
                       .style("top", (event.pageY - 28) + "px")
                       .attr("data-education", bachelor);
            } else {
                tooltip.transition()
                       .style("visibility", "hidden");
            }
        })

        .on("mouseout", () => {
                  tooltip.transition()
                    .style("visibility", "hidden");
              });
}

d3.json(countyURL).then(
  (data, error) => {
    if(error){
      console.log(log)
    }else{
      countyData = topojson.feature(data, data.objects.counties).features
      console.log(countyData)
      
      d3.json(educationURL).then(
          (data, error)=> {
            if(error){
              console.log(log)
            }else{
              educationData = data
              console.log(educationData)
              
              drawMap()
            }
          } 
        )
    }
  }
)

