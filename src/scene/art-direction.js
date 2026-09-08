import * as THREE from '../../vendor/three.module.js';

/** Silhuetas chanfradas capturam a luz sem depender de malhas ou texturas externas. */
export function roundedBox(width, height, depth) {
  const radius = Math.min(width, height, depth) * 0.18;
  const geometry = new THREE.BoxGeometry(width, height, depth, 4, 4, 4);
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const half = new THREE.Vector3(width / 2 - radius, height / 2 - radius, depth / 2 - radius);
  const point = new THREE.Vector3(),
    core = new THREE.Vector3(),
    outward = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    core.set(
      THREE.MathUtils.clamp(point.x, -half.x, half.x),
      THREE.MathUtils.clamp(point.y, -half.y, half.y),
      THREE.MathUtils.clamp(point.z, -half.z, half.z),
    );
    outward.subVectors(point, core).normalize();
    point.copy(core).addScaledVector(outward, radius);
    position.setXYZ(i, point.x, point.y, point.z);
    normal.setXYZ(i, outward.x, outward.y, outward.z);
  }
  return geometry;
}

/** Trama fina de moletom: dá relevo ao tecido sem custo de textura externa. */
export function fabricTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d');
  context.fillStyle = '#888';
  context.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 64; i += 2) {
    context.fillStyle = i % 4 ? '#949494' : '#7c7c7c';
    context.fillRect(i, 0, 1, 64);
    context.fillRect(0, i, 64, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

/** Janela noturna: prédios em silhueta e janelas acesas em duas temperaturas de cor. */
function cityTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#0a142f');
  sky.addColorStop(0.6, '#12224a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 320);
  const glow = ctx.createRadialGradient(256, 300, 10, 256, 300, 300);
  glow.addColorStop(0, '#2b4d86');
  glow.addColorStop(1, '#08122c00');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 512, 320);
  let x = -10;
  while (x < 522) {
    const width = 28 + Math.random() * 46;
    const height = 70 + Math.random() * 170;
    ctx.fillStyle = '#060d21';
    ctx.fillRect(x, 320 - height, width, height);
    for (let wy = 320 - height + 10; wy < 312; wy += 13) {
      for (let wx = x + 6; wx < x + width - 8; wx += 11) {
        if (Math.random() > 0.62) {
          ctx.fillStyle = Math.random() > 0.35 ? '#ffd9a366' : '#9fc8ff55';
          ctx.fillRect(wx, wy, 5, 7);
        }
      }
    }
    x += width + 5 + Math.random() * 12;
  }
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = '#cfe0ff' + (Math.random() > 0.5 ? '55' : '33');
    ctx.fillRect(Math.random() * 512, Math.random() * 130, 1.4, 1.4);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Cartaz da liga na parede: identidade visível sem depender de leitura. */
function posterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#101b40';
  ctx.fillRect(0, 0, 256, 340);
  ctx.strokeStyle = '#3d5a92';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 232, 316);
  ctx.fillStyle = '#e6edff';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('SEAL', 34, 96);
  ctx.fillStyle = '#8fa8d8';
  ctx.font = '13px sans-serif';
  ctx.fillText('ENGENHARIA', 34, 126);
  ctx.fillText('DE SOFTWARE', 34, 146);
  ctx.strokeStyle = '#6f8fd0';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 4; i++) {
    ctx.strokeRect(38 + i * 6, 190 + i * 24, 150, 20);
  }
  ctx.fillStyle = '#7d94c4';
  ctx.font = '11px sans-serif';
  ctx.fillText('CIn · UFPE', 34, 310);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Sala, não vazio: parede, janela, cartaz, estante, planta, livros e poeira em suspensão. */
export function buildAtmosphere(world) {
  const { scene } = world;
  const architectural = world.material(0x314766, 0.48, 0.3);
  const wall = world.material(0x16233f, 0.95);

  // Parede de fundo e piso distante fecham o ambiente.
  const back = world.mesh(new THREE.PlaneGeometry(14, 8), wall, [0, 2.6, -2.7]);
  back.castShadow = false;
  back.receiveShadow = true;
  for (const x of [-4.6, 4.6]) {
    const side = world.mesh(new THREE.PlaneGeometry(6, 8), wall, [x, 2.6, 0.3]);
    side.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
    side.castShadow = false;
  }

  // Janela: a cidade acesa dá profundidade e explica a luz fria da cena.
  const frame = world.material(0x2a3b5c, 0.5, 0.4);
  const windowGroup = new THREE.Group();
  windowGroup.position.set(2.75, 2.5, -2.63);
  scene.add(windowGroup);
  const city = world.mesh(
    new THREE.PlaneGeometry(2.4, 1.5),
    new THREE.MeshBasicMaterial({ map: cityTexture(), toneMapped: false }),
    [0, 0, 0],
    windowGroup,
  );
  city.castShadow = city.receiveShadow = false;
  for (const [x, y, w, h] of [
    [0, 0.78, 2.56, 0.08],
    [0, -0.78, 2.56, 0.08],
    [-1.24, 0, 0.08, 1.64],
    [1.24, 0, 0.08, 1.64],
    [0, 0, 0.05, 1.5],
  ]) {
    world.box([x, y, 0.03], [w, h, 0.07], frame, windowGroup);
  }

  // Cartaz e prateleira do outro lado equilibram a composição.
  const poster = world.mesh(
    new THREE.PlaneGeometry(0.78, 1.04),
    new THREE.MeshStandardMaterial({ map: posterTexture(), roughness: 0.9 }),
    [-2.5, 2.62, -2.66],
  );
  poster.castShadow = false;
  const shelf = world.material(0x33445f, 0.8);
  world.box([-2.5, 1.86, -2.5], [1.5, 0.05, 0.3], shelf);
  const spines = [0x8ea6cf, 0x2f4f78, 0xc0c7d2, 0x6f86ad, 0x3c5a86];
  spines.forEach((color, i) => {
    const book = world.box(
      [-3.06 + i * 0.11, 2.01, -2.5],
      [0.075, 0.26, 0.22],
      world.material(color, 0.85),
    );
    book.rotation.z = i === 4 ? 0.22 : 0;
  });

  // O arco continua emoldurando a estação de trabalho.
  const lit = new THREE.MeshStandardMaterial({
    color: 0x9aaecd,
    emissive: 0x7396d2,
    emissiveIntensity: 0.55,
    roughness: 0.35,
    metalness: 0.4,
  });
  const arch = world.mesh(
    new THREE.TorusGeometry(2.04, 0.045, 12, 100, Math.PI),
    architectural,
    [0, 1.1, -1.95],
  );
  const glow = world.mesh(
    new THREE.TorusGeometry(1.97, 0.009, 8, 100, Math.PI),
    lit,
    [0, 1.1, -1.94],
  );
  for (const x of [-2.04, 2.04]) world.box([x, 0.55, -1.95], [0.085, 1.1, 0.085], architectural);
  arch.castShadow = glow.castShadow = false;

  // Planta e livros transformam a mesa em mesa de estudante.
  const pot = world.material(0xc2c5be, 0.85);
  world.mesh(new THREE.CylinderGeometry(0.2, 0.14, 0.34, 24), pot, [1.44, 1.69, -0.95]);
  const leafMaterial = world.material(0x638d84, 0.9);
  const stemMaterial = world.material(0x4a7167, 0.9);
  for (let i = 0; i < 9; i++) {
    const angle = i * 2.4;
    const end = [
      1.44 + Math.sin(angle) * 0.23,
      2.03 + (i % 3) * 0.13,
      -0.95 + Math.cos(angle) * 0.18,
    ];
    world.limb([1.44, 1.83, -0.95], end, 0.01, stemMaterial);
    const leaf = world.ellipsoid(end, [0.088, 0.2, 0.018], leafMaterial);
    leaf.rotation.set(0.25, angle, 0.35 * Math.sin(angle));
  }
  [0x9aa9c3, 0x294765, 0xc8cbc8].forEach((color, i) => {
    const book = world.box(
      [-1.25, 1.55 + i * 0.047, -0.59],
      [0.38, 0.042, 0.48],
      world.material(color, 0.8),
    );
    book.rotation.y = 0.08 + i * 0.08;
  });

  // Poeira em um único draw call: revela a profundidade sem pesar.
  const count = 110,
    positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.sin(i * 12.17) * 3.6;
    positions[i * 3 + 1] = 0.4 + (Math.sin(i * 7.61) * 0.5 + 0.5) * 4;
    positions[i * 3 + 2] = Math.cos(i * 5.74) * 2.9 - 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  world.dust = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xc2d5f0,
      size: 0.016,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    }),
  );
  scene.add(world.dust);
}

/** Volumes contínuos de tecido evitam o aspecto de bonecos de esferas soltas. */
export function buildHoodie(world, material, parent) {
  const profile = [
    [0.29, 0.09],
    [0.35, 0.11],
    [0.37, 0.19],
    [0.365, 0.35],
    [0.4, 0.65],
    [0.428, 0.82],
    [0.4, 0.94],
    [0.3, 1.02],
    [0.145, 1.065],
  ];
  const curve = new THREE.SplineCurve(profile.map(([x, y]) => new THREE.Vector2(x, y)));
  const torso = world.mesh(
    new THREE.LatheGeometry(curve.getPoints(44), 48),
    material,
    [0, 0, 0],
    parent,
  );
  torso.scale.z = 0.68;
  // Ombros: um jugo achatado tira o aspecto de garrafa e sustenta as mangas.
  const yoke = world.ellipsoid([0, 0.9, 0], [0.44, 0.16, 0.3], material, parent);
  yoke.scale.z = 0.68;
  return torso;
}

export function curvedSleeve(world, side, material, parent) {
  const points = [
    [side * 0.32, 0.88, 0.01],
    [side * 0.46, 0.73, -0.01],
    [side * 0.5, 0.44, -0.17],
    [side * 0.45, 0.35, -0.43],
    [side * 0.32, 0.39, -0.86],
    [side * 0.28, 0.4, -0.99],
  ];
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return world.mesh(
    new THREE.TubeGeometry(curve, 30, 0.12, 16, false),
    material,
    [0, 0, 0],
    parent,
  );
}

/** Mão com dedos independentes: é o que faz a digitação parecer digitação. */
export function buildHand(world, side, { skin }, parent) {
  const hand = new THREE.Group();
  hand.position.set(side * 0.27, 0.415, -1.06);
  parent.add(hand);
  const palm = world.ellipsoid([0, 0, 0], [0.088, 0.042, 0.115], skin, hand);
  palm.castShadow = true;
  const fingers = [];
  for (let i = 0; i < 4; i++) {
    const finger = new THREE.Group();
    finger.position.set(-0.054 + i * 0.036, -0.008, -0.06);
    hand.add(finger);
    world.limb([0, 0, 0], [0, -0.012, -0.088], 0.0155, skin, finger);
    fingers.push(finger);
  }
  const thumb = world.limb(
    [side * 0.07, -0.006, -0.02],
    [side * 0.1, -0.014, -0.07],
    0.018,
    skin,
    hand,
  );
  thumb.castShadow = true;
  return { hand, fingers };
}

/**
 * Cabelo cacheado com silhueta própria: um casquete contínuo por baixo e duas camadas
 * de cachos com tamanho, profundidade e tom variados. A nuca ganha volume extra porque
 * é exatamente o que a câmera de abertura enquadra.
 */
export function buildHair(world, material, parent) {
  const center = new THREE.Vector3(0, 0.288, -0.022);
  const radii = new THREE.Vector3(0.214, 0.284, 0.222);
  const group = new THREE.Group();
  parent.add(group);

  // Casquete: massa contínua que impede a pele de aparecer entre os cachos.
  const cap = world.mesh(
    new THREE.SphereGeometry(1, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.74),
    material,
    [center.x, center.y - 0.014, center.z],
    group,
  );
  cap.scale.set(radii.x * 0.985, radii.y * 1.03, radii.z * 0.985);

  const layers = [
    { count: 132, lift: 1.035, size: [0.036, 0.052], reach: -0.62 },
    { count: 88, lift: 1.12, size: [0.026, 0.042], reach: -0.42 },
  ];
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  for (const { count, lift, size, reach } of layers) {
    const curls = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), material, count);
    let placed = 0;
    for (let k = 0; placed < count && k < count * 5; k++) {
      const phi = k * 2.39996;
      const y = 1 - (k / (count * 1.4)) * (1 - reach);
      if (y < reach) break;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const dir = new THREE.Vector3(Math.cos(phi) * ring, y, Math.sin(phi) * ring);
      // O rosto fica livre; a franja só desce até a altura das têmporas.
      if (dir.z < -0.3 && y < 0.46) continue;
      const jitter = 1 + Math.sin(k * 4.7) * 0.045;
      dummy.position.set(
        center.x + dir.x * radii.x * lift * jitter,
        center.y + dir.y * radii.y * lift * jitter,
        center.z + dir.z * radii.z * lift * jitter,
      );
      const scale = size[0] + (Math.sin(k * 2.3) * 0.5 + 0.5) * (size[1] - size[0]);
      dummy.scale.set(scale, scale * (0.86 + Math.sin(k * 1.7) * 0.16), scale);
      dummy.rotation.set(k * 0.7, k * 1.1, 0);
      dummy.updateMatrix();
      curls.setMatrixAt(placed, dummy.matrix);
      const shade = 0.84 + (Math.sin(k * 3.1) * 0.5 + 0.5) * 0.42;
      curls.setColorAt(placed, tint.setRGB(shade, shade * 0.98, shade * 1.04));
      placed++;
    }
    curls.count = placed;
    curls.castShadow = true;
    curls.receiveShadow = true;
    group.add(curls);
  }

  // Nuca: alguns cachos mais longos caem sobre a gola e quebram a linha da esfera.
  for (let i = 0; i < 9; i++) {
    const x = (i / 8 - 0.5) * 0.3;
    const drop = 0.05 + Math.abs(Math.sin(i * 1.9)) * 0.05;
    const strand = world.mesh(
      new THREE.CapsuleGeometry(0.026, drop, 6, 10),
      material,
      [center.x + x, center.y - 0.2 - drop * 0.4, center.z + 0.14 - Math.abs(x) * 0.35],
      group,
    );
    strand.rotation.set(0.28, 0, x * 1.6);
  }
  return group;
}
