#include <iostream>
#include <cmath>
#include <chrono>

struct Body {
    double x;
    double y;
    double mass;
    double velocity_x;
    double velocity_y;
    double acceleration_x;
    double acceleration_y;
};

double calculate_distance(double x1, double y1, double x2, double y2) {
    double dx = x2 - x1;
    double dy = y2 - y1;
    return std::sqrt(dx * dx + dy * dy);
}

void calculate_force(Body* obj, Body* other_objects, int num_objects, double* total_force_x, double* total_force_y) {
    double G = 6.67430e-11;  // gravitational constant

    for (int i = 0; i < num_objects; i++) {
        if (obj != &other_objects[i]) {
            double dx = other_objects[i].x - obj->x;
            double dy = other_objects[i].y - obj->y;
            double distance = calculate_distance(obj->x, obj->y, other_objects[i].x, other_objects[i].y);
            double force = (G * obj->mass * other_objects[i].mass) / (distance * distance); // Newton's law of universal gravitation
            double force_x = force * dx / distance;
            double force_y = force * dy / distance;
            *total_force_x += force_x;
            *total_force_y += force_y;
        }
    }
}

void simulate_gravity(Body* objects, int num_objects) {
    double time_step = 0.01; // seconds per time step
    double simulation_time = 5; // seconds to simulate

    // Arrays to store the coordinates
    double obj_coords[num_objects][2];

    for (int i = 0; i < num_objects; i++) {
        // Print the body's coordinates
        std::cout << "Time: " << 0.0 << " seconds" << std::endl;
        std::cout << "Body " << i + 1 << ": (" << objects[i].x << ", " << objects[i].y << ")" << std::endl << std::endl;

        // Store the initial coordinates
        obj_coords[i][0] = objects[i].x;
        obj_coords[i][1] = objects[i].y;
    }

    for (int timestep = 1; timestep <= simulation_time * (1 / time_step); timestep++) {
        for (int i = 0; i < num_objects; i++) {
            double total_force_x = 0;
            double total_force_y = 0;
            calculate_force(&objects[i], objects, num_objects, &total_force_x, &total_force_y);
            objects[i].acceleration_x = total_force_x / objects[i].mass;
            objects[i].acceleration_y = total_force_y / objects[i].mass;

            // Update the body's position
            objects[i].x += objects[i].velocity_x * time_step;
            objects[i].y += objects[i].velocity_y * time_step;

            // Update the body's velocity
            objects[i].velocity_x += objects[i].acceleration_x * time_step;
            objects[i].velocity_y += objects[i].acceleration_y * time_step;

            // Store the coordinates
            obj_coords[i][0] = objects[i].x;
            obj_coords[i][1] = objects[i].y;

            // Print the body's coordinates
            if (i == 0) {
                std::cout << "Time: " << timestep * time_step << " seconds" << std::endl;
            }
            std::cout << "Body " << i + 1 << ": (" << objects[i].x << ", " << objects[i].y << ")" << std::endl;
            if (i == num_objects - 1) {
                std::cout << std::endl;
            }
        }
    }
}

int main() {
    // Start the timer
    auto start = std::chrono::high_resolution_clock::now();

    // Example with 3 objects
    Body obj1 = {0, -5, 1000, 3, 0, 0, 0};  // Body 1 with coordinates (0, -5), mass 1000, and initial velocity (3, 0)
    Body obj2 = {0, 0, 1e12, 0, 0, 0, 0};  // Body 2 with coordinates (0, 0), mass 1e12
    Body obj3 = {0, 2, 1000, -5.6, 0, 0, 0};  // Body 3 with coordinates (0, 2), mass 1000, and initial velocity (-5.6, 0)

    Body objects[] = {obj1, obj2, obj3};
    int num_objects = sizeof(objects) / sizeof(objects[0]);

    simulate_gravity(objects, num_objects);

    // End the timer and calculate the duration
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
    std::cout << "Execution time: " << duration.count() << " microseconds" << std::endl;

    return 0;
}
