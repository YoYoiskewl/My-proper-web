// Three.js Scene Setup
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    1, // 1:1 aspect ratio for square container
    0.1,
    1000
);
camera.position.z = 10;

// Renderer
const container = document.getElementById('three-container');
const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
});
renderer.setSize(600, 600);
renderer.setClearColor(0x000000, 0); // Transparent background
container.appendChild(renderer.domElement);

// Lighting - Enhanced for better appeal
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xb46432, 0.8, 100);
pointLight1.position.set(-5, 3, 3);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x7c3503, 0.6, 100);
pointLight2.position.set(5, -3, 3);
scene.add(pointLight2);

// Create Materials with enhanced brown/copper tones and glow
const materials = [
    new THREE.MeshPhongMaterial({ 
        color: 0x7c3503, 
        shininess: 120,
        specular: 0x996633,
        emissive: 0x331100,
        emissiveIntensity: 0.2
    }),
    new THREE.MeshPhongMaterial({ 
        color: 0xb46432,
        shininess: 100,
        specular: 0xcc8855,
        emissive: 0x442211,
        emissiveIntensity: 0.15
    }),
    new THREE.MeshPhongMaterial({ 
        color: 0xd2691e,
        shininess: 110,
        specular: 0xffaa77,
        emissive: 0x553322,
        emissiveIntensity: 0.2
    }),
    new THREE.MeshPhongMaterial({ 
        color: 0xcd853f,
        shininess: 90,
        specular: 0xeebb99,
        emissive: 0x664433,
        emissiveIntensity: 0.15
    })
];

// Create geometric shapes
const shapes = [];

// 3D Bar Chart - Central element with animated heights
const barGroup = new THREE.Group();
const barHeights = [2.0, 3.2, 2.5, 3.8, 2.8];
const barWidth = 0.5;
const barSpacing = 0.7;

for (let i = 0; i < barHeights.length; i++) {
    const barGeometry = new THREE.BoxGeometry(barWidth, barHeights[i], barWidth);
    const bar = new THREE.Mesh(barGeometry, materials[i % materials.length]);
    bar.position.set(
        (i - 2) * barSpacing,
        barHeights[i] / 2 - 1.5,
        0
    );
    bar.userData = { originalHeight: barHeights[i], index: i };
    barGroup.add(bar);
}

barGroup.position.set(0, 0, 0);
scene.add(barGroup);
shapes.push({ mesh: barGroup, speedX: 0, speedY: 0.004, isBarChart: true });

// Animated Pie Chart segments (using torus segments)
const pieGroup = new THREE.Group();
const segments = 5;
for (let i = 0; i < segments; i++) {
    const angle = (Math.PI * 2) / segments;
    const startAngle = i * angle;
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.3, 16, 32, angle * 0.9);
    const segment = new THREE.Mesh(torusGeometry, materials[i % materials.length]);
    segment.rotation.z = startAngle;
    pieGroup.add(segment);
}
pieGroup.position.set(-3.5, 2, 0);
pieGroup.rotation.x = Math.PI / 2;
scene.add(pieGroup);
shapes.push({ mesh: pieGroup, speedX: 0.003, speedY: 0.005, isPieChart: true });

// Glowing Data Points (spheres orbiting with trails)
const dataPoints = [];
for (let i = 0; i < 8; i++) {
    const sphereGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const sphere = new THREE.Mesh(sphereGeometry, materials[i % materials.length]);
    
    const angle = (i / 8) * Math.PI * 2;
    const radius = 5;
    sphere.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.5) * 2.5,
        Math.sin(angle) * radius
    );
    
    scene.add(sphere);
    dataPoints.push(sphere);
    shapes.push({ 
        mesh: sphere, 
        speedX: 0.015, 
        speedY: 0.015,
        orbitSpeed: 0.004,
        orbitAngle: angle,
        orbitRadius: radius,
        verticalSpeed: 0.002 + Math.random() * 0.002,
        verticalOffset: i
    });
}

// 3D Line Graph with glowing connections
const lineGroup = new THREE.Group();
const points = [
    { x: -2, y: -1.2, z: 0 },
    { x: -1, y: 0.8, z: 0 },
    { x: 0, y: -0.3, z: 0 },
    { x: 1, y: 1.2, z: 0 },
    { x: 2, y: 0.5, z: 0 }
];

for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const cylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, distance, 8);
    const cylinder = new THREE.Mesh(cylinderGeometry, materials[1]);
    
    cylinder.position.set(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2,
        0
    );
    
    const angle = Math.atan2(dy, dx);
    cylinder.rotation.z = angle - Math.PI / 2;
    
    lineGroup.add(cylinder);
    
    // Add glowing point markers
    const pointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const point = new THREE.Mesh(pointGeometry, materials[2]);
    point.position.set(start.x, start.y, 0);
    lineGroup.add(point);
}

// Add last point
const lastPointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const lastPoint = new THREE.Mesh(lastPointGeometry, materials[2]);
lastPoint.position.set(points[points.length - 1].x, points[points.length - 1].y, 0);
lineGroup.add(lastPoint);

lineGroup.position.set(3.5, -1.5, -1);
scene.add(lineGroup);
shapes.push({ mesh: lineGroup, speedX: 0.006, speedY: 0.004 });

// Rotating Database Cylinder Stack
const dbGroup = new THREE.Group();
for (let i = 0; i < 3; i++) {
    const dbGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.25, 32);
    const db = new THREE.Mesh(dbGeometry, materials[3]);
    db.position.y = i * 0.35;
    dbGroup.add(db);
}
dbGroup.position.set(-3.5, -2.5, 0);
scene.add(dbGroup);
shapes.push({ mesh: dbGroup, speedX: 0.003, speedY: 0.008, isDatabase: true });

// Add some floating cubes for extra visual interest
for (let i = 0; i < 3; i++) {
    const size = 0.4 + Math.random() * 0.3;
    const cubeGeometry = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Mesh(cubeGeometry, materials[i % materials.length]);
    
    const angle = (i / 3) * Math.PI * 2;
    cube.position.set(
        Math.cos(angle) * 3,
        Math.sin(angle) * 2,
        Math.sin(angle + Math.PI) * 2
    );
    
    scene.add(cube);
    shapes.push({ 
        mesh: cube, 
        speedX: 0.02 + Math.random() * 0.01, 
        speedY: 0.015 + Math.random() * 0.01,
        floatSpeed: 0.003 + Math.random() * 0.002,
        floatOffset: i * 2
    });
}

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Smooth mouse follow
    targetRotationY = mouseX * 0.4;
    targetRotationX = mouseY * 0.4;
    
    // Rotate all shapes
    shapes.forEach((shapeObj, index) => {
        const { mesh, speedX, speedY, orbitSpeed, orbitAngle, orbitRadius, isBarChart, isPieChart, isDatabase, floatSpeed, floatOffset, verticalSpeed, verticalOffset } = shapeObj;
        
        // Individual rotation
        if (!isBarChart) {
            mesh.rotation.x += speedX;
            mesh.rotation.y += speedY;
        } else {
            // Bar chart only rotates slowly on Y axis
            mesh.rotation.y += speedY;
            
            // Animate bar heights
            mesh.children.forEach((bar, barIndex) => {
                const originalHeight = bar.userData.originalHeight;
                const wave = Math.sin(time * 2 + barIndex * 0.5) * 0.3;
                bar.scale.y = 1 + wave * 0.15;
            });
        }
        
        // Pie chart segments pulsing
        if (isPieChart) {
            const pulse = Math.sin(time * 3) * 0.05;
            mesh.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
        }
        
        // Database pulsing
        if (isDatabase) {
            const pulse = Math.sin(time * 2) * 0.05;
            mesh.scale.set(1 + pulse, 1, 1 + pulse);
        }
        
        // Orbit animation for data points
        if (orbitSpeed && orbitAngle !== undefined) {
            shapeObj.orbitAngle += orbitSpeed;
            mesh.position.x = Math.cos(shapeObj.orbitAngle) * orbitRadius;
            mesh.position.z = Math.sin(shapeObj.orbitAngle) * orbitRadius;
            
            // Vertical wave motion
            if (verticalSpeed) {
                mesh.position.y = Math.sin(time * verticalSpeed * 10 + verticalOffset) * 2.5;
            }
        }
        
        // Floating animation for cubes
        if (floatSpeed) {
            mesh.position.y += Math.sin(time * floatSpeed * 10 + floatOffset) * 0.003;
        }
        
        // General floating for other objects
        if (!isBarChart && !orbitSpeed && !floatSpeed) {
            mesh.position.y += Math.sin(time + index) * 0.002;
        }
    });
    
    // Animate point lights
    pointLight1.position.x = Math.sin(time * 0.5) * 5;
    pointLight1.position.z = Math.cos(time * 0.5) * 5;
    
    pointLight2.position.x = Math.cos(time * 0.7) * 5;
    pointLight2.position.z = Math.sin(time * 0.7) * 5;
    
    // Scene rotation based on mouse
    scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
    scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const newSize = Math.min(window.innerWidth * 0.5, 600);
    renderer.setSize(newSize, newSize);
});