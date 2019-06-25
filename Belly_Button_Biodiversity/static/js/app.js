console.log("app.js loaded");

function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    
    d3.json("/metadata/" + sample).then((sampleMetadata) => {
      
      Object.entries(sampleMetadata).forEach(function([key, value]) {
        sample_metadata
          .append("p")
          .text(`${key} : ${value}`)
      }); 
    }); 

    // BONUS: Build the Gauge Chart
    buildGauge(sample.WFREQ);
}

function buildCharts(sample) {
  console.log(sample);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then((samples) => {

    var otu_ids = samples["otu_ids"];
    var otu_labels = samples["otu_labels"];

    // @TODO: Build a Bubble Chart using the sample data
    var bubble = {
      x: otu_ids,
      y: samples.sample_values,
      mode: `markers`,
      text: otu_labels,
      marker: {
        color: otu_ids,
        size: samples.sample_values
      }
    };

    var bubbleData = [bubble]

    var bubbleLayout = {
      showlegend: false,
      height: 600,
      width: 800,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample"
      },
      title: "Belly Button Biodiversity"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });

  d3.json("/samples/" + sample).then((samples) => {

    var otu_ids = samples["otu_ids"];
    var otu_labels = samples["otu_labels"];

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    otu_ids = otu_ids.slice(0, 10);
    otu_labels = otu_labels.slice(0, 10);

    var pieData = [{
      values: otu_ids,
      labels: otu_ids,
      type: "pie"
    }];

    var pieLayout = {
      height: 550,
      width: 550,
      showlegend: true,
      legend: {
        "orientation": "v",
        "x": 1.02,
        "xanchor": "right",
        "y": 1.0,
        "yanchor": "bottom"
      }
    };
  
    Plotly.newPlot("pie", pieData, pieLayout);
  
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();