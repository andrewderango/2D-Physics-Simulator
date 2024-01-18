import java.lang.Math;
import java.lang.System;

class Body {
    double x;
    double y;
    double mass;
    double velocity_x;
    double velocity_y;
    double acceleration_x;
    double acceleration_y;
}

class Main {
    public static double calculateDistance(double x1, double y1, double x2, double y2) {
        double dx = x2 - x1;
        double dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static double[] calculateForce(Body obj, Body[] other_objects, int num_objects) {
        double G = 6.67430e-11;  // gravitational constant
        double total_force_x = 0;
        double total_force_y = 0;

        for (int i = 0; i < num_objects; i++) {
            if (obj != other_objects[i]) {
                double dx = other_objects[i].x - obj.x;
                double dy = other_objects[i].y - obj.y;
                double distance = calculateDistance(obj.x, obj.y, other_objects[i].x, other_objects[i].y);
                double force = (G * obj.mass * other_objects[i].mass) / (distance * distance); // Newton's law of universal gravitation
                double force_x = force * dx / distance;
                double force_y = force * dy / distance;
                total_force_x += force_x;
                total_force_y += force_y;
            }
        }

        return new double[]{total_force_x, total_force_y};
    }

    public static void simulateGravity(Body[] objects, int num_objects) {
        double time_step = 0.01; // seconds per time step
        double simulation_time = 5; // seconds to simulate

        // Arrays to store the coordinates
        double[][] obj_coords = new double[num_objects][2];

        for (int i = 0; i < num_objects; i++) {
            // Print the body's coordinates
            System.out.println("Time: " + 0.0 + " seconds");
            System.out.println("Body " + (i + 1) + ": (" + objects[i].x + ", " + objects[i].y + ")\n");

            // Store the initial coordinates
            obj_coords[i][0] = objects[i].x;
            obj_coords[i][1] = objects[i].y;
        }

        for (int timestep = 1; timestep <= simulation_time * (1 / time_step); timestep++) {
            for (int i = 0; i < num_objects; i++) {
                double[] total_force = calculateForce(objects[i], objects, num_objects);
                objects[i].acceleration_x = total_force[0] / objects[i].mass;
                objects[i].acceleration_y = total_force[1] / objects[i].mass;

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
                    System.out.println("Time: " + timestep * time_step + " seconds");
                }
                System.out.println("Body " + (i + 1) + ": (" + objects[i].x + ", " + objects[i].y + ")");
                if (i == num_objects - 1) {
                    System.out.println();
                }
            }
        }
    }

    public static void main(String[] args) {
        // Start the timer
        long startTime = System.currentTimeMillis();

        // Example with 3 objects
        Body obj1 = new Body();
        obj1.x = 0;
        obj1.y = -5;
        obj1.mass = 1000;
        obj1.velocity_x = 3;
        obj1.velocity_y = 0;
        obj1.acceleration_x = 0;
        obj1.acceleration_y = 0;

        Body obj2 = new Body();
        obj2.x = 0;
        obj2.y = 0;
        obj2.mass = 1e12;
        obj2.velocity_x = 0;
        obj2.velocity_y = 0;
        obj2.acceleration_x = 0;
        obj2.acceleration_y = 0;

        Body obj3 = new Body();
        obj3.x = 0;
        obj3.y = 2;
        obj3.mass = 1000;
        obj3.velocity_x = -5.6;
        obj3.velocity_y = 0;
        obj3.acceleration_x = 0;
        obj3.acceleration_y = 0;

        Body[] objects = {obj1, obj2, obj3};
        int num_objects = objects.length;

        simulateGravity(objects, num_objects);

        // Stop the timer and calculate the elapsed time
        long endTime = System.currentTimeMillis();
        long elapsedTime = endTime - startTime;

        System.out.println("Elapsed time: " + elapsedTime + " milliseconds");
    }
}