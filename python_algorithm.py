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

def calculate_force(obj, other_objects):
    G = 6.67430e-11  # gravitational constant
    total_force_x = 0
    total_force_y = 0

    for other_obj in other_objects:
        if obj != other_obj:
            dx = other_obj.x - obj.x
            dy = other_obj.y - obj.y
            distance = math.sqrt(dx**2 + dy**2)
            force = (G * obj.mass * other_obj.mass) / distance**2 # Newton's law of universal gravitation
            force_x = force * dx / distance
            force_y = force * dy / distance
            total_force_x += force_x
            total_force_y += force_y

    return total_force_x, total_force_y

def simulate_gravity(objects):
    time_step = 0.01 # seconds per time step
    simulation_time = 5 # seconds to simulate

    # Lists to store the coordinates, speeds, and accelerations
    obj_coords = [[] for _ in range(len(objects))]
    obj_speeds = [[] for _ in range(len(objects))]
    obj_accelerations = [[] for _ in range(len(objects))]

    for obj in objects:
        # Print the body's coordinates
        print(f"Time: {0:.3f} seconds")
        print(f"Body {objects.index(obj) + 1}: ({obj.x}, {obj.y})")
        print()

        # Store the initial coordinates, speeds, and accelerations
        obj_coords[objects.index(obj)].append((obj.x, obj.y))
        obj_speeds[objects.index(obj)].append(math.sqrt(obj.velocity_x**2 + obj.velocity_y**2))
        obj_accelerations[objects.index(obj)].append(math.sqrt(obj.acceleration_x**2 + obj.acceleration_y**2))

    for timestep in range(1, (simulation_time)*int(1/time_step) + 1):
        for obj in objects:
            force_x, force_y = calculate_force(obj, objects)
            obj.acceleration_x = force_x / obj.mass
            obj.acceleration_y = force_y / obj.mass

            # Update the body's position
            obj.x += obj.velocity_x * time_step
            obj.y += obj.velocity_y * time_step

            # Update the body's velocity
            obj.velocity_x += obj.acceleration_x * time_step
            obj.velocity_y += obj.acceleration_y * time_step

            # Store the coordinates, speeds, and accelerations
            obj_coords[objects.index(obj)].append((obj.x, obj.y))
            obj_speeds[objects.index(obj)].append(math.sqrt(obj.velocity_x**2 + obj.velocity_y**2))
            obj_accelerations[objects.index(obj)].append(math.sqrt(obj.acceleration_x**2 + obj.acceleration_y**2))

            # Print the body's coordinates
            if obj == objects[0]:
                print(f"Time: {timestep * time_step:.3f} seconds")
            print(f"Body {objects.index(obj) + 1}: ({obj.x}, {obj.y})")
            if obj == objects[-1]:
                print()

    # Normalize the mass values, apply a logarithmic transformation, and add a constant
    obj_mass_scaled = [np.log(obj.mass / min(obj.mass for obj in objects)) * 5 + 10 for obj in objects]
    for i in range(len(objects)):
        x_coords, y_coords = zip(*obj_coords[i])
        plt.scatter(x_coords, y_coords, s=obj_mass_scaled[i], label=f'Body {i+1}')

    plt.xlabel('X Coordinate')
    plt.ylabel('Y Coordinate')
    plt.title('2D Physics Simulation')
    plt.legend()
    plt.show()

    time = [i * time_step for i in range(int(simulation_time / time_step) + 1)]
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(10, 7))
    for i in range(len(objects)):
        ax1.plot(time, obj_speeds[i], label=f'Body {i+1}')
        ax2.plot(time[1:], obj_accelerations[i][1:], label=f'Body {i+1}')  # Omit the first datapoint of acceleration because it's always 0

    ax1.set_ylabel('Speed')
    ax2.set_ylabel('Acceleration')
    ax2.set_xlabel('Time')
    ax1.set_title('Speed and Acceleration of Objects vs Time')
    ax1.legend()
    ax2.legend()
    plt.show()

# Example with 3 objects
obj1 = Body(0, -5, 1000, velocity_x=3, velocity_y=0)  # Body 1 with coordinates (0, -5), mass 1000, and initial velocity (3, 0)
obj2 = Body(0, 0, 1e12, velocity_x=0, velocity_y=0)  # Body 2 with coordinates (0, 0), mass 1e12
obj3 = Body(0, 2, 1000, velocity_x=-5.6, velocity_y=0)  # Body 3 with coordinates (0, 2), mass 1000, and initial velocity (-5.6, 0)

objects = [obj1, obj2, obj3]

simulate_gravity(objects)