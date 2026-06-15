import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVelocity } from "motion/react";

interface ThreeCanvasProps {
  scrollYProgress: any;
}

export default function ThreeCanvas({ scrollYProgress }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll velocity reactively using framer motion's useVelocity
  const scrollVelocity = useVelocity(scrollYProgress);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Initialize Scene, Camera, and WebGLRenderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.08);

    const aspect = container.clientWidth / container.clientHeight;
    // Standard perspective camera
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Setup Lighting (Rich technical highlights using cool and warm contrasts)
    const ambientLight = new THREE.AmbientLight(0x0a1018, 1.4);
    scene.add(ambientLight);

    const cyanDirectional = new THREE.DirectionalLight(0x22d3ee, 3.2);
    cyanDirectional.position.set(6, 4, 5);
    scene.add(cyanDirectional);

    const amberDirectional = new THREE.DirectionalLight(0xf59e0b, 1.4);
    amberDirectional.position.set(-6, -4, -4);
    scene.add(amberDirectional);

    const pointLight = new THREE.PointLight(0x06b6d4, 2.0, 15);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // Create unified cosmos container group for smooth scrolling parallax translations
    const cosmosGroup = new THREE.Group();
    scene.add(cosmosGroup);

    // 3. Create the Modular 3D Space Station (The grand central aerospace artifact)
    const stationGroup = new THREE.Group();
    cosmosGroup.add(stationGroup);

    // Main horizontal truss spine (Long structural backbone)
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.2,
    });
    const mainTruss = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 4.4, 8), trussMat);
    mainTruss.rotation.z = Math.PI / 2; // Lie flat horizontally
    stationGroup.add(mainTruss);

    // Structural rings / brace locks along the truss for complex technical rendering
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      const bracket = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.015, 6, 12),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 })
      );
      bracket.position.x = i * 0.5;
      bracket.rotation.y = Math.PI / 2;
      stationGroup.add(bracket);
    }

    // Pressurized Habitation Core (Central Pod Hub)
    const coreGroup = new THREE.Group();
    stationGroup.add(coreGroup);

    const labMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // High-quality anodized silver aluminum plating
      metalness: 0.88,
      roughness: 0.22,
    });

    // Primary Central Lab Capsule
    const centralLab = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.82, 16), labMat);
    coreGroup.add(centralLab);

    // Orthogonal living quarters (Node 1)
    const node1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.72, 12), labMat);
    node1.rotation.x = Math.PI / 2;
    coreGroup.add(node1);

    // Vertical observatory/docking interface cupola module (Node 2)
    const node2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.72, 12), labMat);
    node2.rotation.z = Math.PI / 2;
    node2.position.y = 0.42;
    coreGroup.add(node2);

    // Conical adapters bridging modules
    const pmaGeom = new THREE.ConeGeometry(0.18, 0.25, 12, 1, true);
    const pmaMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.3 });
    
    const pmaFront = new THREE.Mesh(pmaGeom, pmaMat);
    pmaFront.position.set(0, 0, 0.46);
    pmaFront.rotation.x = Math.PI / 2;
    coreGroup.add(pmaFront);

    // High fidelity target docking ring (This is the anchor for the astronaut lifeline)
    const dockRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.022, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x0891b2, metalness: 0.9 })
    );
    dockRing.position.set(0, 0, 0.59);
    dockRing.rotation.x = Math.PI / 2;
    coreGroup.add(dockRing);

    const pmaBack = new THREE.Mesh(pmaGeom, pmaMat);
    pmaBack.position.set(0, 0, -0.46);
    pmaBack.rotation.x = -Math.PI / 2;
    coreGroup.add(pmaBack);

    // Micro interior lighting - Glowing Crew Porthole Windows
    const portholeGeom = new THREE.CircleGeometry(0.025, 8);
    const portholeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide }); // warm cozy crew quarters glow

    const windowOffsets = [
      { x: 0.255, y: 0.18, z: 0, rotY: Math.PI / 2 },
      { x: -0.255, y: -0.18, z: 0, rotY: -Math.PI / 2 },
      { x: 0, y: 0.14, z: 0.38, rotY: 0 },
      { x: 0, y: -0.14, z: -0.38, rotY: Math.PI },
      { x: 0.17, y: 0.14, z: 0.22, rotY: Math.PI / 4 },
      { x: -0.17, y: -0.14, z: -0.22, rotY: -3 * Math.PI / 4 },
    ];

    windowOffsets.forEach((pos) => {
      const windowMesh = new THREE.Mesh(portholeGeom, portholeMat);
      windowMesh.position.set(pos.x, pos.y, pos.z);
      windowMesh.rotation.y = pos.rotY;
      coreGroup.add(windowMesh);
    });

    // Giant Double-Wing Solar Panel Arrays (Left and Right extremities)
    const solarGroup = new THREE.Group();
    stationGroup.add(solarGroup);

    // Extensions trusses connecting arrays to main central core
    const leftExt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), trussMat);
    leftExt.position.set(-2.4, 0, 0);
    leftExt.rotation.z = Math.PI / 2;
    solarGroup.add(leftExt);

    const rightExt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), trussMat);
    rightExt.position.set(2.4, 0, 0);
    rightExt.rotation.z = Math.PI / 2;
    solarGroup.add(rightExt);

    const panelLength = 1.6;
    const panelWidth = 0.46;
    const panelThickness = 0.015;

    const wingGeom = new THREE.BoxGeometry(panelWidth, panelLength, panelThickness);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Slate navy photovoltaic base
      roughness: 0.1,
      metalness: 0.92,
    });

    const wingGridGeom = new THREE.BoxGeometry(panelWidth + 0.01, panelLength + 0.01, panelThickness + 0.005);
    const wingGridMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan mesh cells representing active digital charging fields
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const spawnArrayPair = (posX: number) => {
      for (let side = -1; side <= 1; side += 2) {
        // Pairs above and below the extension axis
        const yPos = side * 0.85;

        const mainMesh = new THREE.Mesh(wingGeom, wingMat);
        mainMesh.position.set(posX, yPos, 0);

        const gridMesh = new THREE.Mesh(wingGridGeom, wingGridMat);
        gridMesh.position.copy(mainMesh.position);

        solarGroup.add(mainMesh, gridMesh);
      }
    };

    // Spawn 4 giant wings on left (-2.8 and -3.3) and 4 on right (2.8 and 3.3)
    spawnArrayPair(-2.8);
    spawnArrayPair(-3.4);
    spawnArrayPair(2.8);
    spawnArrayPair(3.4);

    // Thermal Radiator rectangular panels (Perpendicular white panels radiating heat into cold space)
    const radiatorGeom = new THREE.BoxGeometry(0.3, 0.95, 0.015);
    const radiatorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.25,
      metalness: 0.1,
    });

    const rad1 = new THREE.Mesh(radiatorGeom, radiatorMat);
    rad1.position.set(-1.1, 0, 0.45);
    rad1.rotation.x = Math.PI / 2;
    rad1.rotation.y = Math.PI / 4;
    stationGroup.add(rad1);

    const rad2 = new THREE.Mesh(radiatorGeom, radiatorMat);
    rad2.position.set(1.1, 0, -0.45);
    rad2.rotation.x = Math.PI / 2;
    rad2.rotation.y = Math.PI / 4;
    stationGroup.add(rad2);

    // Communications Gold parabolic dishes & telemetry arrays
    const commSupport = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.32, 6),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 })
    );
    commSupport.position.set(0.65, 0.42, 0);
    commSupport.rotation.z = Math.PI / 4;
    stationGroup.add(commSupport);

    const commDish = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.06, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xdf9d2c, metalness: 0.95, roughness: 0.12 })
    );
    commDish.position.set(0.75, 0.52, 0);
    commDish.rotation.z = Math.PI / 4;
    stationGroup.add(commDish);

    // Structural telemetry masts on the station core
    const coreMast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.55, 4),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    coreMast.position.set(0, 0.52, 0);
    stationGroup.add(coreMast);

    const coreCross = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.22, 4),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    coreCross.position.set(0, 0.72, 0);
    coreCross.rotation.z = Math.PI / 2;
    stationGroup.add(coreCross);

    // Blinking Navigation Strobe Beacons at the structural corners
    const beacons: { mesh: THREE.Mesh; type: "cyan" | "magenta"; frequency: number; phase: number }[] = [];
    const beaconGeom = new THREE.SphereGeometry(0.038, 8, 8);
    const cyanLightMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true });
    const magentaLightMat = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true });

    const beaconLocations = [
      { x: -3.7, y: 1.7, z: 0, type: "cyan" as const, freq: 4.5, phase: 0 },
      { x: -3.7, y: -1.7, z: 0, type: "magenta" as const, freq: 3.8, phase: Math.PI / 2 },
      { x: 3.7, y: 1.7, z: 0, type: "magenta" as const, freq: 4.5, phase: Math.PI },
      { x: 3.7, y: -1.7, z: 0, type: "cyan" as const, freq: 3.8, phase: 3 * Math.PI / 2 },
      { x: 0, y: 0.9, z: 0, type: "cyan" as const, freq: 5.2, phase: 0 },
    ];

    beaconLocations.forEach((loc) => {
      const bMesh = new THREE.Mesh(beaconGeom, loc.type === "cyan" ? cyanLightMat : magentaLightMat);
      bMesh.position.set(loc.x, loc.y, loc.z);
      stationGroup.add(bMesh);
      beacons.push({
        mesh: bMesh,
        type: loc.type,
        frequency: loc.freq,
        phase: loc.phase,
      });
    });

    // 5. Render 3D zero-gravity Astronaut (EVA micro-mesh with high-fidelity detailing)
    const astroGroup = new THREE.Group();
    
    // Space backpack suit core
    const packMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.36, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.6, metalness: 0.2 })
    );
    packMesh.position.set(0, 0, -0.06);
    astroGroup.add(packMesh);

    // Dynamic thrusters at bottom-left and bottom-right of the backpack
    const thrusterGeo = new THREE.ConeGeometry(0.04, 0.09, 8);
    const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    
    const leftThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    leftThruster.position.set(-0.09, -0.18, -0.06);
    leftThruster.rotation.x = Math.PI;
    astroGroup.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    rightThruster.position.set(0.09, -0.18, -0.06);
    rightThruster.rotation.x = Math.PI;
    astroGroup.add(rightThruster);

    // Torso spacesuit frame
    const torsoMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.10, 0.28, 12),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 })
    );
    torsoMesh.position.set(0, 0, 0);
    astroGroup.add(torsoMesh);

    // Chest telemetry node box
    const chestBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.12, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.3 })
    );
    chestBox.position.set(0, 0.03, 0.10);
    astroGroup.add(chestBox);

    // Tiny status lights on chest telemetry
    const blueLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    );
    blueLight.position.set(-0.04, 0.03, 0.125);
    astroGroup.add(blueLight);

    const redLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    redLight.position.set(0.04, 0.03, 0.125);
    astroGroup.add(redLight);

    // Spacesuit Helmet
    const helmetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 })
    );
    helmetMesh.position.set(0, 0.22, 0.01);
    astroGroup.add(helmetMesh);

    // Visor rim / golden visor plate (reflective metal)
    const visorMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.05 })
    );
    visorMesh.scale.set(1.05, 0.85, 1.05);
    visorMesh.rotation.x = Math.PI / 2.3;
    visorMesh.position.set(0, 0.22, 0.07);
    astroGroup.add(visorMesh);

    // Helmet ring
    const helmetRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.02, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 0.5, roughness: 0.4 })
    );
    helmetRing.rotation.x = Math.PI / 2;
    helmetRing.position.set(0, 0.14, 0.01);
    astroGroup.add(helmetRing);

    // Rigid joints and limbs dynamically rigged inside astroGroup local coordinates
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.17, 0.07, 0);
    const leftArmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.035, 0.24, 8),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 })
    );
    leftArmMesh.position.set(0, -0.09, 0);
    leftArmGroup.add(leftArmMesh);
    astroGroup.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.17, 0.07, 0);
    const rightArmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.035, 0.24, 8),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 })
    );
    rightArmMesh.position.set(0, -0.09, 0);
    rightArmGroup.add(rightArmMesh);
    astroGroup.add(rightArmGroup);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.06, -0.14, 0);
    const leftLegMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.038, 0.26, 8),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 })
    );
    leftLegMesh.position.set(0, -0.11, 0);
    leftLegGroup.add(leftLegMesh);
    astroGroup.add(leftLegGroup);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.06, -0.14, 0);
    const rightLegMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.038, 0.26, 8),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 })
    );
    rightLegMesh.position.set(0, -0.11, 0);
    rightLegGroup.add(rightLegMesh);
    astroGroup.add(rightLegGroup);

    astroGroup.position.set(2.8, 1.2, 0.5);
    cosmosGroup.add(astroGroup);

    // Astronaut security lifeline cable (Cyan cybernetic tether line)
    const tetherPoints = [];
    for (let u = 0; u <= 15; u++) {
      tetherPoints.push(new THREE.Vector3(0, 0, 0));
    }
    const tetherGeo = new THREE.BufferGeometry().setFromPoints(tetherPoints);
    const tetherMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.8, 
    });
    const tetherLine = new THREE.Line(tetherGeo, tetherMat);
    cosmosGroup.add(tetherLine);

    // 6. Generate 3D Starfield particles
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 60;
      starPositions[i + 1] = (Math.random() - 0.5) * 60;
      starPositions[i + 2] = (Math.random() - 0.5) * 50 - 15;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Floating gaseous cyan/amber/purple dust clouds to add interstellar atmospheric depth
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const colorCyan = new THREE.Color(0x22d3ee);
    const colorAmber = new THREE.Color(0xf59e0b);
    const colorPurple = new THREE.Color(0xa855f7);

    for (let i = 0; i < dustCount; i++) {
      const idx = i * 3;
      const r = 6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      dustPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[idx + 2] = r * Math.cos(phi) - 10;
      
      const randColor = Math.random();
      let selectedColor = colorCyan;
      if (randColor > 0.66) {
        selectedColor = colorAmber;
      } else if (randColor > 0.33) {
        selectedColor = colorPurple;
      }
      dustColors[idx] = selectedColor.r;
      dustColors[idx + 1] = selectedColor.g;
      dustColors[idx + 2] = selectedColor.b;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const dustfield = new THREE.Points(dustGeo, dustMat);
    scene.add(dustfield);

    // 7. Track Scroll Inertia & Rotation physics variables
    let velocityMultiplier = 1.0;
    let targetRotationX = 0.15;
    let targetRotationY = 0;
    let currentRotationX = 0.15;
    let currentRotationY = 0;

    // Track cursor movement for interactive 3D perspective shifts
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Handle responsive container resize adjustments
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 8. Dynamic Animation Rendering Loop
    let lastTime = performance.now();
    let animFrame: number;

    const tick = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Realtime frame-drift calculation of scroll velocity matching aerospace acceleration
      const rawVelocity = scrollVelocity.get();
      const speedBoost = Math.min(12.0, Math.abs(rawVelocity) * 0.18);
      velocityMultiplier += (1.0 + speedBoost - velocityMultiplier) * 0.04;

      // 1. Calculate time variables
      const timeSecs = now * 0.001;

      // Rotate infinite cosmic backgrounds slowly for amazing space depth
      if (starfield) {
        starfield.rotation.y = timeSecs * 0.006;
        starfield.rotation.x = timeSecs * 0.002;
      }
      if (dustfield) {
        dustfield.rotation.y = -timeSecs * 0.012;
        dustfield.rotation.z = timeSecs * 0.004;
      }

      // Base modular space station majestic spinning
      stationGroup.rotation.y += 0.0045 * velocityMultiplier * (1 + delta);
      stationGroup.rotation.x = 0.15; // Continuous default tilt

      // Mouse-move subtle parallax shifting
      targetRotationX = 0.15 + mouse.y * 0.25;
      targetRotationY = mouse.x * 0.35;
      
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      stationGroup.rotation.x = currentRotationX;
      stationGroup.rotation.z = currentRotationY * 0.2;

      // Smooth scroll parallax transitions for cosmosGroup origin
      const progress = scrollYProgress ? scrollYProgress.get() : 0;
      const targetCosmosX = 1.3 - progress * 2.8;       // Slides across viewport (right to left)
      const targetCosmosY = -0.15 - progress * 0.85;     // Shifts down (reveal lower orbit)
      const targetCosmosZ = -0.4 - progress * 2.6;       // Recedes into deeper background
      
      cosmosGroup.position.x += (targetCosmosX - cosmosGroup.position.x) * 0.04;
      cosmosGroup.position.y += (targetCosmosY - cosmosGroup.position.y) * 0.04;
      cosmosGroup.position.z += (targetCosmosZ - cosmosGroup.position.z) * 0.04;

      // Pulse the navigation lights with real-time strobe frequency
      beacons.forEach((beacon) => {
        const pulse = (Math.sin(timeSecs * beacon.frequency + beacon.phase) + 1) / 2;
        const isOn = pulse > 0.82;
        beacon.mesh.scale.setScalar(isOn ? 1.4 : 0.4);
        (beacon.mesh.material as THREE.MeshBasicMaterial).opacity = isOn ? 1.0 : 0.2;
      });

      // 2. Astronaut Space-walking adjacent to the Space Station
      // Slow weightless float path looping near the Station core (Node PMA aspect)
      const floatAngle = timeSecs * 0.08; // majestic slow drift
      const radiusX = 2.45 + Math.sin(timeSecs * 0.35) * 0.15;
      const radiusZ = 1.85 + Math.cos(timeSecs * 0.28) * 0.12;

      astroGroup.position.set(
        Math.cos(floatAngle) * radiusX,
        Math.sin(timeSecs * 0.55) * 0.28 + 0.3,
        Math.sin(floatAngle) * radiusZ
      );

      // Majestic, continuous slow 3D tumble in zero gravity
      astroGroup.rotation.x = timeSecs * 0.16;
      astroGroup.rotation.y = timeSecs * 0.12;
      astroGroup.rotation.z = Math.sin(timeSecs * 0.22) * 0.25;

      // Elegant weightless limb idle swing
      leftArmGroup.rotation.z = -0.72 + Math.sin(timeSecs * 1.3) * 0.08;
      leftArmGroup.rotation.x = Math.cos(timeSecs * 1.1) * 0.08;

      rightArmGroup.rotation.z = 0.72 + Math.cos(timeSecs * 1.25) * 0.08;
      rightArmGroup.rotation.x = Math.sin(timeSecs * 1.0) * 0.08;

      leftLegGroup.rotation.x = Math.sin(timeSecs * 0.9) * 0.08;
      leftLegGroup.rotation.z = -0.12 + Math.cos(timeSecs * 0.8) * 0.04;

      rightLegGroup.rotation.x = Math.cos(timeSecs * 1.0) * 0.08;
      rightLegGroup.rotation.z = 0.12 + Math.sin(timeSecs * 0.9) * 0.04;

      // 3. Update the flexible cybernetic lifeline cable
      const tetherPosAttr = tetherLine.geometry.attributes.position;
      
      const pStart = new THREE.Vector3();
      dockRing.getWorldPosition(pStart);
      cosmosGroup.worldToLocal(pStart);

      const pEnd = new THREE.Vector3();
      packMesh.getWorldPosition(pEnd);
      cosmosGroup.worldToLocal(pEnd);

      for (let u = 0; u <= 15; u++) {
        const ratio = u / 15;
        const currentPt = new THREE.Vector3().lerpVectors(pStart, pEnd, ratio);
        
        if (ratio > 0 && ratio < 1) {
          // Apply organic wavy trailing cable sag and flex oscillations
          const multiplier = Math.sin(ratio * Math.PI);
          const waveX = Math.sin(ratio * Math.PI * 1.8 + timeSecs * 1.6) * 0.07 * multiplier;
          const waveY = Math.cos(ratio * Math.PI * 1.8 + timeSecs * 1.4) * 0.07 * multiplier;
          const waveZ = Math.sin(ratio * Math.PI * 1.2 + timeSecs * 1.2) * 0.05 * multiplier;
          currentPt.x += waveX;
          currentPt.y += waveY;
          currentPt.z += waveZ;
        }
        tetherPosAttr.setXYZ(u, currentPt.x, currentPt.y, currentPt.z);
      }
      tetherLine.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(tick);
    };
    tick();

    // 9. Clean resources on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animFrame);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      scene.clear();
      renderer.dispose();
    };
  }, [scrollVelocity, scrollYProgress]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]" 
    />
  );
}
