class Body {
    constructor(x, y, mass, velocity_x = 0, velocity_y = 0) {
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
    const time_step = 0.01; // seconds per time step
    const simulation_time = 5; // seconds to simulate

    // Lists to store the coordinates
    const obj_coords = new Array(objects.length).fill([]);

    for (const obj of objects) {
        // Print the body's coordinates
        console.log('Time: ${0.toFixed(3)} seconds');
        console.log('Body ${objects.indexOf(obj) + 1}: (${obj.x}, ${obj.y})');
        console.log();

        // Store the initial coordinates
        obj_coords[objects.indexOf(obj)].push([obj.x, obj.y]);
    }

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

            // Print the body's coordinates
            if (obj === objects[0]) {
                console.log('Time: ${(timestep * time_step).toFixed(3)} seconds');
            }
            console.log('Body ${objects.indexOf(obj) + 1}: (${obj.x}, ${obj.y})');
            if (obj === objects[objects.length - 1]) {
                console.log();
            }
        }
    }

    return obj_coords;
}

// Example with 3 objects
class Body {
    constructor(x, y, mass, velocity_x = 0, velocity_y = 0) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.velocity_x = velocity_x; // Initial velocity in x
        this.velocity_y = velocity_y; // Initial velocity in y
        this.acceleration_x = 0;
        this.acceleration_y = 0;
    }
}

const obj1 = new Body(0, -5, 1000, 3, 0); // Body 1 with coordinates (0, -5), mass 1000, and initial velocity (3, 0)
const obj2 = new Body(0, 0, 1e12, 0, 0); // Body 2 with coordinates (0, 0), mass 1e12
const obj3 = new Body(0, 2, 1000, -5.6, 0); // Body 3 with coordinates (0, 2), mass 1000, and initial velocity (-5.6, 0)

const objects = [obj1, obj2, obj3];

const objectCoordinates = simulate_gravity(objects);
