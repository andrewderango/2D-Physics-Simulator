import math
import numpy as np
import matplotlib.pyplot as plt

class Body:
    def __init__(self, name, x, y, z, mass, velocity_x=0, velocity_y=0, velocity_z=0):
        self.name = name
        self.x = x
        self.y = y
        self.z = z
        self.mass = mass
        self.velocity_x = velocity_x # Initial velocity in x
        self.velocity_y = velocity_y # Initial velocity in y
        self.velocity_z = velocity_z # Initial velocity in z
        self.acceleration_x = 0
        self.acceleration_y = 0
        self.acceleration_z = 0

def calculate_force(obj, other_objects):
    G = 6.67430e-11  # gravitational constant
    total_force_x = 0
    total_force_y = 0
    total_force_z = 0

    for other_obj in other_objects:
        if obj != other_obj:
            dx = other_obj.x - obj.x
            dy = other_obj.y - obj.y
            dz = other_obj.z - obj.z
            distance = math.sqrt(dx**2 + dy**2 + dz**2)
            force = (G * obj.mass * other_obj.mass) / distance**2 # Newton's law of universal gravitation
            force_x = force * dx / distance
            force_y = force * dy / distance
            force_z = force * dz / distance
            total_force_x += force_x
            total_force_y += force_y
            total_force_z += force_z

    return total_force_x, total_force_y, total_force_z

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
        print(f"{obj.name}: ({obj.x}, {obj.y}, {obj.z})")
        print()

        # Store the initial coordinates, speeds, and accelerations
        obj_coords[objects.index(obj)].append((obj.x, obj.y, obj.z))
        obj_speeds[objects.index(obj)].append(math.sqrt(obj.velocity_x**2 + obj.velocity_y**2 + obj.velocity_z**2))
        obj_accelerations[objects.index(obj)].append(math.sqrt(obj.acceleration_x**2 + obj.acceleration_y**2 + obj.acceleration_z**2))

    for timestep in range(1, (simulation_time)*int(1/time_step) + 1):
        for obj in objects:
            force_x, force_y, force_z = calculate_force(obj, objects)
            obj.acceleration_x = force_x / obj.mass
            obj.acceleration_y = force_y / obj.mass
            obj.acceleration_z = force_z / obj.mass

            # Update the body's position
            obj.x += obj.velocity_x * time_step
            obj.y += obj.velocity_y * time_step
            obj.z += obj.velocity_z * time_step

            # Update the body's velocity
            obj.velocity_x += obj.acceleration_x * time_step
            obj.velocity_y += obj.acceleration_y * time_step
            obj.velocity_z += obj.acceleration_z * time_step

            # Store the coordinates, speeds, and accelerations
            obj_coords[objects.index(obj)].append((obj.x, obj.y, obj.z))
            obj_speeds[objects.index(obj)].append(math.sqrt(obj.velocity_x**2 + obj.velocity_y**2 + obj.velocity_z**2))
            obj_accelerations[objects.index(obj)].append(math.sqrt(obj.acceleration_x**2 + obj.acceleration_y**2 + obj.acceleration_z**2))

            # Print the body's coordinates
            if obj == objects[0]:
                print(f"Time: {timestep * time_step:.3f} seconds")
            print(f"{obj.name}: ({obj.x}, {obj.y}, {obj.z})")
            if obj == objects[-1]:
                print()

    fig1 = plt.figure(figsize=(10, 7))
    ax1 = fig1.add_subplot(111, projection='3d')

    # Normalize the mass values, apply a logarithmic transformation, and add a constant
    obj_mass_scaled = [np.log(obj.mass / min(obj.mass for obj in objects)) * 5 + 10 for obj in objects]
    for i in range(len(objects)):
        x_coords, y_coords, z_coords = zip(*obj_coords[i])
        ax1.plot(x_coords, y_coords, z_coords, label=f'Body {i+1}')

    # Add dots at the final position of the objects
    for obj in objects:
        ax1.scatter(obj.x, obj.y, obj.z, color='red')

    ax1.set_xlabel('X Coordinate')
    ax1.set_ylabel('Y Coordinate')
    ax1.set_zlabel('Z Coordinate')
    ax1.set_title('Object Trajectories')
    ax1.legend()
    plt.show()

    time = [i * time_step for i in range(int(simulation_time / time_step) + 1)]

    fig2 = plt.figure(figsize=(10, 7))
    ax2 = fig2.add_subplot(211)
    ax3 = fig2.add_subplot(212)

    for i in range(len(objects)):
        ax3.plot(time[1:], obj_accelerations[i][1:], label=objects[i].name)

    ax3.set_xlabel('Time')
    ax3.set_ylabel('Acceleration')
    ax3.set_title('Acceleration of Objects vs Time')
    ax3.legend()

    for i in range(len(objects)):
        ax2.plot(time[1:], obj_speeds[i][1:], label=objects[i].name)

    ax2.set_xlabel('Time')
    ax2.set_ylabel('Speed')
    ax2.set_title('Speed of Objects vs Time')
    ax2.legend()
    plt.show()

if __name__ == '__main__':
    # Example with 3 objects
    obj2 = Body('Sun', 0, 0, 0, 1e12, velocity_x=0, velocity_y=0, velocity_z=0)
    obj1 = Body('Io', 0, -5, 0, 1000, velocity_x=3, velocity_y=0, velocity_z=-0.05)
    obj3 = Body('Apophis', 0, 2, 0, 1000, velocity_x=-5.6, velocity_y=0, velocity_z=0.05)

    objects = [obj1, obj2, obj3]

    simulate_gravity(objects)