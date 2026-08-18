const fs = require('fs');
let content = fs.readFileSync('public/futureverse/index.html', 'utf8');

// 1. CSS
content = content.replace(
    `.planet-label {
            position: absolute; color: white; font-family: 'Space Grotesk', sans-serif;
            font-size: 14px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;`,
    `.planet-label {
            position: absolute; color: white; font-family: 'Space Grotesk', sans-serif;
            left: 0; top: 0;
            font-size: 14px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;`
);

// 2. Events
const eventsOld = `window.addEventListener('resize', onWindowResize);
            window.addEventListener('pointermove', onMouseMove);
            
            let pointerDownPos = { x: 0, y: 0 };
            window.addEventListener('pointerdown', (e) => {
                pointerDownPos.x = e.clientX;
                pointerDownPos.y = e.clientY;
            });
            
            window.addEventListener('pointerup', (e) => {
                const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
                if (dist < 25) {
                    onClick(e);
                }
            });`;

const eventsNew = `window.addEventListener('resize', onWindowResize);
            window.addEventListener('pointermove', onMouseMove);
            
            let pointerDownPos = { x: 0, y: 0 };
            let isTouching = false;
            
            window.addEventListener('pointerdown', (e) => {
                pointerDownPos.x = e.clientX;
                pointerDownPos.y = e.clientY;
            });
            
            window.addEventListener('pointerup', (e) => {
                if (isTouching) return;
                const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
                if (dist < 25) {
                    onClick(e);
                }
            });

            // Native touch support
            window.addEventListener('touchstart', (e) => {
                isTouching = true;
                pointerDownPos.x = e.touches[0].clientX;
                pointerDownPos.y = e.touches[0].clientY;
            }, {passive: true});

            window.addEventListener('touchend', (e) => {
                const touch = e.changedTouches[0];
                const dist = Math.hypot(touch.clientX - pointerDownPos.x, touch.clientY - pointerDownPos.y);
                if (dist < 40) { // More forgiving on mobile
                    onClick({ clientX: touch.clientX, clientY: touch.clientY });
                }
                setTimeout(() => isTouching = false, 100);
            });`;

content = content.replace(eventsOld, eventsNew);

// 3. onMouseMove
const moveOld = `function onMouseMove(event) {
            if (isNavigating || activePlanet) return;
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets, true);

            planets.forEach(p => {
                gsap.to(p.material, { emissiveIntensity: 0.6, duration: 0.3 });
                document.body.style.cursor = 'default';
            });
            
            labelContainers.forEach(l => l.element.style.opacity = '0');

            if (intersects.length > 0) {
                let planet = intersects[0].object;
                while(planet && planet.userData.type !== 'planet') {
                    planet = planet.parent;
                }
                if(planet) {
                    document.body.style.cursor = 'pointer';
                    gsap.to(planet.material, { emissiveIntensity: 1.5, duration: 0.2 });
                    const labelObj = labelContainers.find(l => l.mesh === planet);
                    if(labelObj) labelObj.element.style.opacity = '1';
                }
            }
        }`;

const moveNew = `let hoveredPlanet = null;

        function onMouseMove(event) {
            if (isNavigating || activePlanet) return;
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets, true);

            let currentHover = null;
            if (intersects.length > 0) {
                currentHover = intersects[0].object;
                while(currentHover && currentHover.userData.type !== 'planet') {
                    currentHover = currentHover.parent;
                }
            }

            if (currentHover !== hoveredPlanet) {
                // Reset old hovered planet
                if (hoveredPlanet) {
                    gsap.to(hoveredPlanet.material, { emissiveIntensity: 0.6, duration: 0.3 });
                    const labelObj = labelContainers.find(l => l.mesh === hoveredPlanet);
                    if(labelObj) labelObj.element.style.opacity = '0';
                }
                
                hoveredPlanet = currentHover;
                
                // Highlight new hovered planet
                if (hoveredPlanet) {
                    document.body.style.cursor = 'pointer';
                    gsap.to(hoveredPlanet.material, { emissiveIntensity: 1.5, duration: 0.2 });
                    const labelObj = labelContainers.find(l => l.mesh === hoveredPlanet);
                    if(labelObj) labelObj.element.style.opacity = '1';
                } else {
                    document.body.style.cursor = 'default';
                }
            }
        }`;

content = content.replace(moveOld, moveNew);

// 4. animate
const animateOld = `if (tempVector.z < 1) {
                        const x = (tempVector.x * .5 + .5) * window.innerWidth;
                        const y = (tempVector.y * -.5 + .5) * window.innerHeight;
                        l.element.style.left = \`\${x}px\`;
                        l.element.style.top = \`\${y - 45}px\`;
                    } else {
                        l.element.style.left = '-1000px';
                    }`;

const animateNew = `if (tempVector.z < 1) {
                        const x = (tempVector.x * .5 + .5) * window.innerWidth;
                        const y = (tempVector.y * -.5 + .5) * window.innerHeight;
                        l.element.style.transform = \`translate(-50%, -50%) translate3d(\${x}px, \${y - 45}px, 0)\`;
                    } else {
                        l.element.style.transform = 'translate(-50%, -50%) translate3d(-2000px, 0, 0)';
                    }`;

content = content.replace(animateOld, animateNew);

fs.writeFileSync('public/futureverse/index.html', content);
console.log('Optimizations applied!');
