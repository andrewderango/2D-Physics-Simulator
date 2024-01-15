import math
import numpy as np
import matplotlib.pyplot as plt

class Body:
    def __init__(self, x, y, mass, velocity_x=0, velocity_y=0):
        self.x = x
        self.y = y
        self.mass = mass
        self.velocity_x = velocity_x # Initial velocity in x
        self.velocity_y = velocity_y # Initial velocity in y
        self.acceleration_x = 0
        self.acceleration_y = 0

def calculate_force(obj1, obj2):
    G = 6.67430e-11  # gravitational constant
    dx = obj2.x - obj1.x
    dy = obj2.y - obj1.y
    distance = math.sqrt(dx**2 + dy**2)
    force = (G * obj1.mass * obj2.mass) / distance**2 # Newton's law of universal gravitation
    force_x = force * dx / distance
    force_y = force * dy / distance
    return force_x, force_y

def simulate_gravity(obj1, obj2):
    time_step = 0.01 # seconds per time step
    simulation_time = 10 # seconds to simulate

    # Lists to store the coordinates
    obj1_x_coords = []
    obj1_y_coords = []
    obj2_x_coords = []
    obj2_y_coords = []

    # Print the bodies' coordinates
    print(f"Time: {0:.3f} seconds")
    print(f"Body 1: ({obj1.x}, {obj1.y})")
    print(f"Body 2: ({obj2.x}, {obj2.y})")
    print()

    # Store the initial coordinates
    obj1_x_coords.append(obj1.x)
    obj1_y_coords.append(obj1.y)
    obj2_x_coords.append(obj2.x)
    obj2_y_coords.append(obj2.y)

    for timestep in range(1,(simulation_time)*int(1/time_step) + 1):
        force_x1, force_y1 = calculate_force(obj1, obj2)
        force_x2, force_y2 = calculate_force(obj2, obj1)
        obj1.acceleration_x = force_x1 / obj1.mass
        obj1.acceleration_y = force_y1 / obj1.mass
        obj2.acceleration_x = force_x2 / obj2.mass
        obj2.acceleration_y = force_y2 / obj2.mass

        # Update the bodies' position
        obj1.x += obj1.velocity_x * time_step
        obj1.y += obj1.velocity_y * time_step
        obj2.x += obj2.velocity_x * time_step
        obj2.y += obj2.velocity_y * time_step

        # Update the bodies' velocity
        obj1.velocity_x += obj1.acceleration_x * time_step
        obj1.velocity_y += obj1.acceleration_y * time_step
        obj2.velocity_x += obj2.acceleration_x * time_step
        obj2.velocity_y += obj2.acceleration_y * time_step

        # Store the coordinates
        obj1_x_coords.append(obj1.x)
        obj1_y_coords.append(obj1.y)
        obj2_x_coords.append(obj2.x)
        obj2_y_coords.append(obj2.y)

        # Print the bodies' coordinates
        print(f"Time: {timestep * time_step:.3f} seconds")
        print(f"Body 1: ({obj1.x}, {obj1.y})")
        print(f"Body 2: ({obj2.x}, {obj2.y})")
        print()

    # Normalize the mass values, apply a logarithmic transformation, and add a constant
    obj1_mass_scaled = np.log(obj1.mass / min(obj1.mass, obj2.mass))*5 + 10
    obj2_mass_scaled = np.log(obj2.mass / min(obj1.mass, obj2.mass))*5 + 10

    plt.scatter(obj1_x_coords, obj1_y_coords, s=obj1_mass_scaled, label='Body 1')
    plt.scatter(obj2_x_coords, obj2_y_coords, s=obj2_mass_scaled, label='Body 2')
    plt.xlabel('X Coordinate')
    plt.ylabel('Y Coordinate')
    plt.title('2D Physics Simulation')
    plt.legend()
    plt.show()

# Example
obj1 = Body(0, -5, 1000, velocity_x=3, velocity_y=0)  # Body 1 with coordinates (0, -5), mass 1000, and initial velocity (1, 0)
obj2 = Body(0, 0, 1e12, velocity_x=0, velocity_y=0)  # Body 2 with coordinates (0, 0), mass 1e12

simulate_gravity(obj1, obj2)