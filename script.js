class Body {
    constructor(name, x, y, mass, velocity_x = 0, velocity_y = 0) {
        this.name = name; // Name of the object
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.velocity_x = velocity_x; // Initial velocity in x
        this.velocity_y = velocity_y; // Initial velocity in y
        this.acceleration_x = 0;
        this.acceleration_y = 0;
    }
}

function calculate_force(obj, other_objects) {
    const G = 6.67430e-11; // gravitational constant
    let total_force_x = 0;
    let total_force_y = 0;

    for (const other_obj of other_objects) {
        if (obj !== other_obj) {
            const dx = other_obj.x - obj.x;
            const dy = other_obj.y - obj.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            const force = (G * obj.mass * other_obj.mass) / distance ** 2; // Newton's law of universal gravitation
            const force_x = (force * dx) / distance;
            const force_y = (force * dy) / distance;
            total_force_x += force_x;
            total_force_y += force_y;
        }
    }

    return [total_force_x, total_force_y];
}

function simulate_gravity(objects) {
    const time_step = 0.001; // seconds per time step
    const simulation_time = 100; // seconds to simulate

    // Lists to store the coordinates
    const obj_coords = new Array(objects.length).fill(0).map(() => []);

    for (let timestep = 1; timestep <= simulation_time * (1 / time_step); timestep++) {
        for (const obj of objects) {
            const [force_x, force_y] = calculate_force(obj, objects);
            obj.acceleration_x = force_x / obj.mass;
            obj.acceleration_y = force_y / obj.mass;

            // Update the body's position
            obj.x += obj.velocity_x * time_step;
            obj.y += obj.velocity_y * time_step;

            // Update the body's velocity
            obj.velocity_x += obj.acceleration_x * time_step;
            obj.velocity_y += obj.acceleration_y * time_step;

            // Store the coordinates
            obj_coords[objects.indexOf(obj)].push([obj.x, obj.y]);
        }
    }

    return obj_coords;
}

function downloadCSV(objects, objectCoordinates, initialStates) {
    // Create CSV content
    let csvContent = "time,name,mass,x,y,vx,vy,ax,ay\n";

    objects.forEach((obj, index) => {
        csvContent += `${0},${obj.name},${obj.mass},${initialStates[index].x},${initialStates[index].y},${initialStates[index].vx},${initialStates[index].vy},0,0\n`;

        objectCoordinates[index].forEach((coord, time) => {
            csvContent += `${time+1},${obj.name},${obj.mass},${coord[0]},${coord[1]},${obj.velocity_x},${obj.velocity_y},${obj.acceleration_x},${obj.acceleration_y}\n`;
        });
    });

    // Create a blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element
    const link = document.createElement("a");

    // Set the link's href to the blob
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    // Set the download attribute to the desired file name
    link.setAttribute("download", "simulation_data.csv");

    // Append the link to the body
    document.body.appendChild(link);

    // Simulate a click on the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
}

document.getElementById("downloadCSVButton").addEventListener("click", function() {
    downloadCSV(objects, objectCoordinates, initialStates);
});

let intervalId = null;

const obj1 = new Body("Sun", 0, 0, 1e12, 0, 0); // Body 1 with coordinates (0, 0), mass 1e12
const obj2 = new Body("Ceres", 0, -5, 1000, 3, 0); // Body 2 with coordinates (0, -5), mass 1000, and initial velocity (3, 0)
const obj3 = new Body("Vesta", 0, 2, 1000, -5.6, 0); // Body 3 with coordinates (0, 2), mass 1000, and initial velocity (-5.6, 0)
const obj4 = new Body("Apophis", 4, 0, 25, 0, 4);
const objects = [obj1, obj2, obj3, obj4];

// const obj1 = new Body("Sun", 0, 0, 1e12, 0, 0); // Body 1 with coordinates (0, 0), mass 1e12
// const obj2 = new Body("Ceres", 0, -5, 1000, 3, 0); // Body 2 with coordinates (0, -5), mass 1000, and initial velocity (3, 0)
// const obj3 = new Body("Vesta", 0, 2, 1000, -5.6, 0); // Body 3 with coordinates (0, 2), mass 1000, and initial velocity (-5.6, 0)
// const obj4 = new Body("Apophis", 4, 0, 25, 0, 4);
// const obj5 = new Body("Eros", 0, -4, 1, -4, 0);
// const obj6 = new Body("Pallas", 3, 3, 2500, 3, -3);
// const obj7 = new Body("Europa", -3, -3, 750, 3, -3);
// const obj8 = new Body("Io", -3.54, 3.54, 900, 2, 2);
// const objects = [obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8];

const initialStates = objects.map(obj => ({ x: obj.x, y: obj.y, vx: obj.velocity_x, vy: obj.velocity_y }));

// Normalize the mass values, apply a logarithmic transformation, and add a constant
const obj_mass_scaled = objects.map(obj => Math.log(obj.mass / Math.min(...objects.map(obj => obj.mass))) * 1 + 3);

const objectCoordinates = simulate_gravity(objects);

// Scale the x and y coordinates to fit the SVG
var xScale = d3.scaleLinear().domain([d3.min(objectCoordinates.flat(), d => d[0]), d3.max(objectCoordinates.flat(), d => d[0])]).range([0, 775]); // Buffer so that labels don't leave boundary
var yScale = d3.scaleLinear().domain([d3.min(objectCoordinates.flat(), d => d[1]), d3.max(objectCoordinates.flat(), d => d[1])]).range([575, 0]);

// Create a group for each object
var groups = d3.select("#canvas").selectAll("g")
    .data(objectCoordinates)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${xScale(d[0][0])}, ${yScale(d[0][1])})`);

// Create a circle for each object
groups.append("circle")
    .attr("r", (d, i) => obj_mass_scaled[i])
    .attr("fill", "black");

// Add labels to the objects
var labels = groups.append("text")
    .attr("x", (d, i) => obj_mass_scaled[i] * 0.8 + 1) // Move the labels to the right based on the size of the circles
    .attr("y", (d, i) => -obj_mass_scaled[i] * 0.8 - 1) // Move the labels up based on the size of the circles
    .attr("text-anchor", "start") // Set the text anchor to start
    .attr("fill", "#f5f5dc")
    .text((d, i) => objects[i].name); // Use the object's name as the label

// Toggle labels
var toggleLabels = true;
document.getElementById("toggleLabelCheckbox").addEventListener("change", function() {
    toggleLabels = !toggleLabels;
    labels.style("display", toggleLabels ? "block" : "none");
});


// Toggle gridlines
var toggleGridlines = true;
document.getElementById("toggleGridlinesCheckbox").addEventListener("change", function() {
    toggleGridlines = !toggleGridlines;
    d3.selectAll(".grid-line").style("display", toggleGridlines ? "none" : "block");
    d3.selectAll(".grid-label").style("display", toggleGridlines ? "none" : "block");
});

var t;
var elapsedPausedTime = 0; // Variable to store the elapsed time when pausing the simulation
var timeCounter = 0; // Variable to store the elapsed time when pausing the simulation
var isPaused = false;
var lastElapsed = 0; // Variable to store the last elapsed time from the d3.interval function

function startSimulation(isResuming) {
    const startButton = document.getElementById("startButton");
    startButton.disabled = true; // Disable the button
    startButton.classList.add("disabled");
    const pauseButton = document.getElementById("pauseButton");
    pauseButton.disabled = false; // Enable the button
    pauseButton.classList.remove("disabled");

    // Start or resume the time counter
    if (!isResuming) {
        timeCounter = 0;
    }
    intervalId = setInterval(() => {
        timeCounter += 0.009;
        document.getElementById('timeCounter').innerText = "Elapsed time: " + timeCounter.toFixed(3);
    }, 9);

    t = d3.interval((elapsed) => {
        // Calculate the correct position based on the elapsed time and the paused time
        const adjustedElapsed = elapsed + elapsedPausedTime;
        lastElapsed = elapsed; // Store the last elapsed time
        console.log(adjustedElapsed);
        groups.attr("transform", (d, i) => `translate(${xScale(d[Math.floor(adjustedElapsed / 1)][0])}, ${yScale(d[Math.floor(adjustedElapsed / 1)][1])})`);
    }, 1);

    if (!isResuming) {
        setTimeout(() => {
            startButton.disabled = false; // Enable the button after the simulation is complete
            startButton.classList.remove("disabled"); // Remove the "disabled" class to revert the appearance
            pauseButton.disabled = true; // Disable the button
            pauseButton.classList.add("disabled"); // Add the "disabled" class to change the appearance
            t.stop(); // Stop the animation
            clearInterval(intervalId); // Stop the time counter
            intervalId = null; // Reset the interval ID
        }, 100000); // Match the simulation time
    }
}

function pauseSimulation() {
    if (isPaused) {
        isPaused = false;
        pauseButton.innerText = "Pause";
        startSimulation(true); // Resume the simulation
    } else {
        isPaused = true;
        pauseButton.innerText = "Resume";
        t.stop();
        clearInterval(intervalId);
        elapsedPausedTime += lastElapsed; // Store the last elapsed time
    }
}

document.addEventListener("DOMContentLoaded", function() {
    pauseButton = document.getElementById("pauseButton");
    pauseButton.addEventListener("click", pauseSimulation);
});

document.getElementById("startButton").addEventListener("click", function() { startSimulation(false); });

// Add vertical and horizontal gridlines
var gridlines = d3.select("#canvas").insert("g", ":first-child").attr("class", "gridlines");

// Vertical gridlines
gridlines.selectAll(".vertical-gridline")
    .data(xScale.ticks())
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", d => xScale(d))
    .attr("y1", 0)
    .attr("x2", d => xScale(d))
    .attr("y2", 600)
    .style("display", toggleGridlines ? "none" : "block");

// Horizontal gridlines
gridlines.selectAll(".horizontal-gridline")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("y1", d => yScale(d))
    .attr("x2", 800)
    .attr("y2", d => yScale(d))
    .style("display", toggleGridlines ? "none" : "block");

// Add labels to the gridlines
gridlines.selectAll(".x-grid-label")
    .data(xScale.ticks())
    .enter()
    .append("text")
    .attr("class", "grid-label")
    .attr("x", d => xScale(d))
    .attr("y", 590)
    .attr("text-anchor", "middle")
    .text(d => d)
    .style("display", toggleGridlines ? "none" : "block")
    .attr("fill", "#f5f5dc"); // Add this line

gridlines.selectAll(".y-grid-label")
    .data(yScale.ticks())
    .enter()
    .append("text")
    .attr("class", "grid-label")
    .attr("x", 10)
    .attr("y", d => yScale(d))
    .attr("text-anchor", "start")
    .text(d => d)
    .style("display", toggleGridlines ? "none" : "block")
    .attr("fill", "#f5f5dc"); // Add this line

// Create a circle for each object
groups.append("circle")
    .attr("r", (d, i) => obj_mass_scaled[i])
    .attr("fill", "#f5f5dc"); // Change the fill color