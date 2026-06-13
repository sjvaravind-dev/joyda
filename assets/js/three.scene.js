/* ============================================================
   JoyDa — Hero 3D background
   Pastel solar family + floating math/physics solids.
   Designed to sit behind hero text & chips at low intensity.
   ============================================================ */

import * as THREE from 'three';

const canvas = document.getElementById('heroCanvas');
if (!canvas) console.warn('[hero3d] canvas #heroCanvas not found');

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ------------------------------------------------------------
// Renderer
// ------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

// ------------------------------------------------------------
// Scene & camera
// ------------------------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
camera.position.set(0, 0.6, 22);

// ------------------------------------------------------------
// Lighting (bright, cream-tinted to match light theme)
// ------------------------------------------------------------
scene.add(new THREE.AmbientLight(0xfff0e0, 0.9));

const sunLight = new THREE.PointLight(0xffd9b0, 1.6, 80, 1.6);
sunLight.position.set(-7, 3, 2);
scene.add(sunLight);

const dirA = new THREE.DirectionalLight(0xffc6db, 0.75);
dirA.position.set(8, 6, 6);
scene.add(dirA);

const dirB = new THREE.DirectionalLight(0xc8b8ff, 0.55);
dirB.position.set(-6, -4, 4);
scene.add(dirB);

// ------------------------------------------------------------
// Soft "dust" particles (a few pastel motes)
// ------------------------------------------------------------
function createDust(count = 220, radius = 26) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
        new THREE.Color(0xffb6c5),
        new THREE.Color(0xc9b8ff),
        new THREE.Color(0xffd6a0),
        new THREE.Color(0xbbe0ff),
    ];
    for (let i = 0; i < count; i++) {
        const r = radius * (0.4 + Math.random() * 0.6);
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        positions[i*3+0] = r * Math.sin(p) * Math.cos(t);
        positions[i*3+1] = r * Math.cos(p) * 0.55;
        positions[i*3+2] = r * Math.sin(p) * Math.sin(t) - 4;

        const c = palette[(Math.random() * palette.length) | 0];
        colors[i*3+0] = c.r;
        colors[i*3+1] = c.g;
        colors[i*3+2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
        size: 0.08,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
}
const dust = createDust();
scene.add(dust);

// ------------------------------------------------------------
// SUN — small, off-center, soft halo
// ------------------------------------------------------------
function createSun() {
    const group = new THREE.Group();

    const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 36, 36),
        new THREE.MeshStandardMaterial({
            color: 0xffd49a,
            emissive: 0xff9c66,
            emissiveIntensity: 1.1,
            roughness: 0.45,
        })
    );
    group.add(core);

    // Halo sprite
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const ctx = cv.getContext('2d');
    const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0.0, 'rgba(255,210,150,0.85)');
    grd.addColorStop(0.35, 'rgba(255,170,120,0.35)');
    grd.addColorStop(1.0, 'rgba(255,170,120,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.85,
    }));
    halo.scale.set(3.2, 3.2, 1);
    group.add(halo);

    // Position upper-left so it doesn't conflict with hero text
    group.position.set(-9, 4.2, -3);
    return { group, core };
}
const sun = createSun();
scene.add(sun.group);

// ------------------------------------------------------------
// Planet builder (pastel banded textures)
// ------------------------------------------------------------
function createPlanetTexture({ baseColor, bandColor, bandIntensity = 0.22, noise = 0.05 }) {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 256;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, cv.width, cv.height);

    for (let y = 0; y < cv.height; y += 2) {
        const t = (Math.sin(y * 0.06) + Math.sin(y * 0.13)) * 0.5;
        const a = bandIntensity * (0.5 + 0.5 * t);
        ctx.fillStyle = `rgba(${bandColor},${a.toFixed(3)})`;
        ctx.fillRect(0, y, cv.width, 2);
    }

    const img = ctx.getImageData(0, 0, cv.width, cv.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * noise * 255;
        d[i+0] = Math.max(0, Math.min(255, d[i+0] + n));
        d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
        d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
}

function createPlanet({ radius, color, bandColor, bandIntensity = 0.2, noise = 0.04, position, ring }) {
    const group = new THREE.Group();

    const tex = createPlanetTexture({ baseColor: color, bandColor, bandIntensity, noise });
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 36, 36),
        new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.85,
            metalness: 0.04,
        })
    );
    group.add(mesh);

    if (ring) {
        const r = new THREE.Mesh(
            new THREE.RingGeometry(ring.inner, ring.outer, 96),
            new THREE.MeshBasicMaterial({
                color: ring.color || 0xe5d0aa,
                transparent: true,
                opacity: ring.opacity ?? 0.6,
                side: THREE.DoubleSide,
            })
        );
        r.rotation.x = Math.PI / 2.4;
        group.add(r);
    }

    group.position.set(position.x, position.y, position.z);
    return { group, mesh };
}

// Pastel solar family arranged AROUND the hero (off the centered text)
const planets = [
    createPlanet({
        radius: 0.95, color: '#FFD7B8', bandColor: '255,200,160', bandIntensity: 0.28,
        position: { x: -8.5, y: -3.2, z: -2 },
        ring: { inner: 1.25, outer: 2.05, color: 0xf2d8b2, opacity: 0.45 },
    }),
    createPlanet({
        radius: 0.62, color: '#C9B8FF', bandColor: '210,200,255', bandIntensity: 0.22,
        position: { x: 9.5, y: 3.8, z: -2.5 },
    }),
    createPlanet({
        radius: 0.5, color: '#BBE0FF', bandColor: '230,240,255', bandIntensity: 0.2,
        position: { x: 10, y: -3.0, z: -1.5 },
    }),
    createPlanet({
        radius: 0.42, color: '#FFC2D5', bandColor: '255,200,220', bandIntensity: 0.22,
        position: { x: -10.5, y: 0.6, z: -4 },
    }),
];
planets.forEach(p => scene.add(p.group));

// ------------------------------------------------------------
// Math / physics solids — drifting around the hero
// ------------------------------------------------------------
function makeSolid(geo, color, opts = {}) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.25,
        emissive: new THREE.Color(color).multiplyScalar(0.05),
        emissiveIntensity: 0.4,
        flatShading: !!opts.flat,
        transparent: true,
        opacity: opts.opacity ?? 0.92,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, opts.edgeAngle ?? 20),
        new THREE.LineBasicMaterial({
            color: opts.wireColor ?? 0xffffff,
            transparent: true,
            opacity: opts.wireOpacity ?? 0.45,
        })
    );
    group.add(wire);

    return { group, mesh, wire };
}

const solids = [
    {
        ...makeSolid(new THREE.ConeGeometry(0.42, 0.95, 24), 0x7c5cff, { flat: true, wireColor: 0xffffff, wireOpacity: 0.55, opacity: 0.9 }),
        anchor: new THREE.Vector3(-7.2, 2.0, 1.5),
        spin: { x: 0.18, y: 0.55, z: 0.08 },
        floatPhase: 0.0,
    },
    {
        ...makeSolid(new THREE.TetrahedronGeometry(0.55), 0xff7a4d, { flat: true, wireColor: 0xffffff, wireOpacity: 0.55, opacity: 0.9 }),
        anchor: new THREE.Vector3(7.6, 1.4, 1.0),
        spin: { x: 0.36, y: 0.28, z: 0.0 },
        floatPhase: 1.2,
    },
    {
        ...makeSolid(new THREE.IcosahedronGeometry(0.6, 0), 0xffd64d, { flat: true, wireColor: 0xffffff, wireOpacity: 0.5, opacity: 0.92 }),
        anchor: new THREE.Vector3(-6.5, -2.6, 1.8),
        spin: { x: 0.28, y: 0.45, z: 0.18 },
        floatPhase: 2.1,
    },
    {
        ...makeSolid(new THREE.TorusGeometry(0.5, 0.16, 18, 64), 0x6effc1, { wireColor: 0xffffff, wireOpacity: 0.4, opacity: 0.9 }),
        anchor: new THREE.Vector3(7.0, -2.6, 2.0),
        spin: { x: 0.45, y: 0.65, z: 0.0 },
        floatPhase: 0.7,
    },
    {
        ...makeSolid(new THREE.OctahedronGeometry(0.5, 0), 0xff9bd2, { flat: true, wireColor: 0xffffff, wireOpacity: 0.5, opacity: 0.9 }),
        anchor: new THREE.Vector3(0, 5.5, -2),
        spin: { x: 0.18, y: 0.36, z: 0.28 },
        floatPhase: 3.4,
    },
    {
        ...makeSolid(new THREE.DodecahedronGeometry(0.5, 0), 0x8fb5ff, { flat: true, wireColor: 0xffffff, wireOpacity: 0.45, opacity: 0.9 }),
        anchor: new THREE.Vector3(0, -5.6, -1.5),
        spin: { x: 0.28, y: 0.28, z: 0.34 },
        floatPhase: 4.6,
    },
    {
        ...makeSolid(new THREE.BoxGeometry(0.85, 0.85, 0.85), 0xc9b8ff, { wireColor: 0xffffff, wireOpacity: 0.5, opacity: 0.85 }),
        anchor: new THREE.Vector3(-3.6, 4.6, -1.5),
        spin: { x: 0.28, y: 0.28, z: 0.18 },
        floatPhase: 5.5,
    },
    {
        ...makeSolid(new THREE.TorusKnotGeometry(0.38, 0.12, 96, 16), 0xffb6c5, { wireColor: 0xffffff, wireOpacity: 0.4, opacity: 0.9 }),
        anchor: new THREE.Vector3(3.6, -4.4, -1.0),
        spin: { x: 0.55, y: 0.36, z: 0.0 },
        floatPhase: 6.3,
    },
];
solids.forEach(s => {
    s.group.position.copy(s.anchor);
    scene.add(s.group);
});

// ------------------------------------------------------------
// Mouse parallax
// ------------------------------------------------------------
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
});

// ------------------------------------------------------------
// Resize
// ------------------------------------------------------------
function resize() {
    const hero = canvas.parentElement;
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
}
resize();
window.addEventListener('resize', resize);

// ------------------------------------------------------------
// Animate
// ------------------------------------------------------------
const clock = new THREE.Clock();

function tick() {
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // Camera drifts subtly with cursor
    const targetX = mouse.x * 1.0;
    const targetY = -mouse.y * 0.6 + 0.6;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // Sun gentle wobble + spin
    sun.core.rotation.y += dt * 0.2;
    sun.group.position.y = 4.2 + Math.sin(t * 0.4) * 0.18;

    // Planets — slow self spin + slight float
    planets.forEach((p, i) => {
        p.mesh.rotation.y += dt * 0.25;
        p.group.position.y += Math.sin(t * 0.5 + i) * 0.0035;
        p.group.position.x += Math.cos(t * 0.3 + i) * 0.002;
    });

    // Solids — floating + spinning
    const f = prefersReduced ? 0.3 : 1;
    solids.forEach(s => {
        s.group.position.x = s.anchor.x + Math.sin(t * 0.55 + s.floatPhase) * 0.4 * f;
        s.group.position.y = s.anchor.y + Math.cos(t * 0.45 + s.floatPhase) * 0.5 * f;
        s.group.position.z = s.anchor.z + Math.sin(t * 0.35 + s.floatPhase * 1.3) * 0.35 * f;
        s.group.rotation.x += dt * s.spin.x * f;
        s.group.rotation.y += dt * s.spin.y * f;
        s.group.rotation.z += dt * s.spin.z * f;
    });

    // Dust drifts
    dust.rotation.y += dt * 0.012;
    dust.rotation.x += dt * 0.004;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();

// Pause when tab hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) clock.stop();
    else clock.start();
});
