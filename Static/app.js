// save URL for sample data 
const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// define global variables for analysis

// use in init, re-assign during initial data load
let rawData = null
let dropDownNames = null
let metaData = null
let testSubject = ''
let samplesData = null

// use in demographic panel and gauge chart
let filterMetaData = null
let selectedMetaData
let wfreq = null

// use in bubble and bar chart
let filteredSamples = null
let otuIDs = null
let otuLabels = null
let otuValues = null
let dataToChart = []
let sortChartData = null
let xAxis = null
let yAxis = null
let text = null

// function to populate Metadata visuals -- Demographic Panel & Gauge
function populateMetadataVisuals() {
    // assign filterMetdata to testSubjectID
    filterMetaData = metaData.filter(person => person.id.toString() === testSubject)[0];
    
    // use d3 to select demographic infocard, assign to variable
    selectedMetaData = d3.select('#sample-metadata');
            
    // clear data in demographic info before display selection
    selectedMetaData.html('');

    // add key-value pairs to visual, use forEach to loop through array, d3 to append
    Object.entries(filterMetaData)
    .forEach(([key, value]) =>
        selectedMetaData
        .append('p')
        .text(`${key}: ${value}`),
        );

    populateGauge(filterMetaData)
;}


// function to create Gauge visual
function populateGauge(filterMetaData) {
    // assign wfreq to .wfreq property -- links the data for gauge with data in demographic panel
    wfreq = filterMetaData.wfreq;
    
    // declare trace for Gauge
    var gaugeChart = [{
        domain: {x: [0,1], y:[0,1]},
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {range: [null,9], tickwidth:0},
            bar: {color: '#ccccc'},
            bgcolor: 'white',
            bordercolor: 'grey',
            steps: [
                { range: [0, 1], color: '#ECEFF1'},
                { range: [1, 2], color: '#CFD8DC'},
                { range: [2, 3], color: '#B0BEC5'},
                { range: [3, 4], color: '#90A4AE'},
                { range: [4, 5], color: '#78909C'},
                { range: [5, 6], color: '#607D8B'},
                { range: [6, 7], color: '#546E7A'},
                { range: [7, 8], color: '#455A64'},
                { range: [8, 9], color: '#37474F'}],
            },

        }];
    
    // declare layout for gauge dial
    var gaugeLayout = {
        autosize: true,
        title: {
            text: "Belly Button Washing Frequency, Scrubs per Week",
            font: {
                family: 'Times New Roman',
                size: 18,
                color: 'dark gray',
                },
            },};
    // render gauge dial to html tag with id 'gauge'
    Plotly.newPlot('gauge', gaugeChart, gaugeLayout)};

function populateCharts() {
    // assign filteredSamples to testSubjectID
    filteredSamples = selectedData.filter(person => person.id === testSubject)[0];
    console.log("SampleValues:",filteredSamples.id);

    // assign otu global variables to filteredSamples.properties
    otuIDs = filteredSamples.otu_ids;
    console.log("otuID:", otuIDs);

    otuLabels = filteredSamples.otu_labels;
    // console.log("otuLabels:", otuLabels);

    otuValues = filteredSamples.sample_values;
    console.log("outValues:", otuValues);

    // create object for each sample id, value and lable, push to array
    // needed to ensure lables and otuID are assigned to proper values when sorted.
    for (var d=0; d<otuIDs.length; d++) {
        dataToChart.push({
            id:otuIDs[d],
            label:otuLabels[d],
            value:otuValues[d]})};
    console.log("testchart:", dataToChart);

    // call sort method on chart data, assign to global variable
    sortChartData = dataToChart.sort((d1, d2) => {
        return d2.otuValues - d1.otuValues;});
        // console.log("sortedData:", sortChartData);

    // declare trace for bubblechart
    var bubble = [{
        x: otuIDs,
        y: otuValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: otuValues,
            color: otuIDs,
            colorscale: 'Portland',
            opacity: 0.8},
        },];
    
    // declare layout for bubblechart    
    var bubbleLayout = {
        title: {
            text: `Test Subject Id No. ${testSubject}: Belly Button Bacterial Samples` ,
            font: {
                family: 'Times New Roman',
                size: 18,
                color: 'dark gray',
                },
        },
        autosize: true,
        responsive: true,
        xaxis: {
            automargin: true,
            title: {
                text: 'OTU ID (Bacteria)',
                font: {
                    family: 'Times New Roman',
                    size: 14,
                    color: 'dark gray',
                    },
            },
        },
        yaxis: { 
            automargin: true,
            title: {
                text: 'Sample Value',
                font: {
                    family: 'Times New Roman',
                    size: 14,
                    color: 'dark gray',
                    },
            },
        },};

    // declare trace for barGraph
    var barGraph = [{
        x: (sortChartData.map(sCD => sCD.value)).slice(0,10).reverse(),
        y: (sortChartData.map(sCD => 'OTU '+ sCD.id)).slice(0,10).reverse(),
        text: (sortChartData.map(sCD => sCD.label)).slice(0,10).reverse(),
        marker: {color:  ['#263238','#37474F','#455A64','#546E7A','#607D8B','#78909C','#90A4AE','#B0BEC5','#CFD8DC','#ECEFF1'],},
        type: "bar",
        orientation: 'h'}];    

    var barLayout = {
        autosize: true,
        xaxis: {
            automargin: true,
            title: {
                text: 'OTU Sample Value',
                font: {
                    family: 'Times New Roman',
                    size: 14,
                    color: 'dark gray',
                    },
            },
        },
        title: {
            text: `Top 10 OTU's for Test Subject ID No. ${testSubject}`,
            font: {
                family: 'Times New Roman',
                size: 18,
                color: 'dark gray',
                },
            }
        ,};

        // generate plot, assign graph to html tag with id = bar
    Plotly.newPlot('bar', barGraph, barLayout);
    Plotly.newPlot('bubble', bubble, bubbleLayout)
};

// function to read data, populate initial graphs
function init() {
    // use d3 to select drop down, assign to variable
    var selector = d3.select("#selDataset") 
    
    // Fetch the JSON data and assign properties to global variables
    d3.json(dataURL).then(function(data) {
        rawData = data
        dropDownNames = data.names;
        metaData = data.metadata;
        testSubject = data.metadata[0].id.toString()
        selectedData = data.samples;

        // append test subject id to dropdown selector
        dropDownNames.forEach((sample) => {
            selector 
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // populate initial visuals
        populateMetadataVisuals()
        populateCharts();    
    });
    
        // define event listener for drop down selection changes. clear dataToChart array between users
        selector.on('change', function() {
            testSubject = selector.property("value")
            dataToChart = []
            populateMetadataVisuals()
            populateCharts();