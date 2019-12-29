# Op
Splitted operations for a better performance


Sometimes calculations need a lot of time and therefore the frame rate decreases rapidly and the manual rotations jerk.

You have to get away from the conventional loop programming and portion the calculations to make more cpu time available for the other processes.

It takes a while to create 2500 spheres...

This demo runs with two inner for loops to calculate the gravitation from each sphere. The result: 1-2 FPS

https://www.babylonjs-playground.com/##WT2WKV

That demo runs with my Op class which slices the for loops. This time we have a FPS from 3-13!

https://www.babylonjs-playground.com/#G1TITX
