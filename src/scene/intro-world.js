import * as THREE from '../../vendor/three.module.js';
import {
  roundedBox,
  fabricTexture,
  buildAtmosphere,
  buildHoodie,
  curvedSleeve,
  buildHand,
  buildHair,
} from './art-direction.js';

const NAVY = 0x101b40;
const ease = (t) => t * t * (3 - 2 * t);
const CTA = { x: -0.393, y: 0.235 };

/** Uma cena 3D em tempo real: alguém estudando, um notebook e um voo de câmera contínuo. */
export class IntroWorld {
  constructor(container) {
    this.container = container;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.visible = true;
    this.flight = null;
    this.frame = 0;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070d20, 0.036);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.setClearColor(0x070d20, 0);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    container.append(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.04, 70);
    this.target = new THREE.Vector3(0, 1.65, 0);
    this.pointer = { x: 0, y: 0 };
    this.buildLighting();
    this.buildRoom();
    buildAtmosphere(this);
    this.buildLaptop();
    this.buildPerson();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    container.addEventListener('pointermove', (event) => {
      const rect = container.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      this.pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(this.frame);
      else if (this.visible) this.animate(performance.now());
    });
    this.resize();
    this.animate(performance.now());
  }

  material(color, roughness = 0.6, metalness = 0) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  }

  mesh(geometry, material, position, parent = this.scene) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  ellipsoid(position, scale, material, parent = this.scene) {
    const mesh = this.mesh(new THREE.SphereGeometry(1, 32, 24), material, position, parent);
    mesh.scale.set(...scale);
    return mesh;
  }

  box(position, dimensions, material, parent = this.scene) {
    return this.mesh(roundedBox(...dimensions), material, position, parent);
  }

  limb(from, to, radius, material, parent) {
    const a = new THREE.Vector3(...from),
      b = new THREE.Vector3(...to);
    const direction = b.clone().sub(a);
    const capsule = this.mesh(
      new THREE.CapsuleGeometry(radius, Math.max(0.01, direction.length() - radius * 2), 8, 16),
      material,
      [0, 0, 0],
      parent,
    );
    capsule.position.copy(a.add(b).multiplyScalar(0.5));
    capsule.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return capsule;
  }

  /** Volume aditivo e transparente: o facho da luminária fica visível no ar com poeira. */
  lightCone(position, radius, height, color, opacity) {
    const cone = this.mesh(
      new THREE.ConeGeometry(radius, height, 28, 1, true),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      position,
    );
    cone.castShadow = cone.receiveShadow = false;
    return cone;
  }

  buildLighting() {
    this.scene.add(new THREE.HemisphereLight(0xd6e5ff, 0x172644, 1.5));
    const key = new THREE.DirectionalLight(0xdce7ff, 2.5);
    key.position.set(3, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -5;
    key.shadow.normalBias = 0.025;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x8facff, 2.6);
    rim.position.set(-4, 4, -3);
    this.scene.add(rim);
    const warm = new THREE.PointLight(0xffd0a4, 11, 6.5);
    warm.position.set(-1.5, 2.5, -0.5);
    this.scene.add(warm);
    this.screenLight = new THREE.PointLight(0xb9ddff, 3.2, 3.2);
    this.screenLight.position.set(0.15, 2, -0.45);
    this.scene.add(this.screenLight);
    const city = new THREE.PointLight(0x6f9cd8, 2.2, 6);
    city.position.set(2.6, 2.6, -2.2);
    this.scene.add(city);
  }

  buildRoom() {
    const desk = this.material(0x9ca8b8, 0.48, 0.15);
    const metal = this.material(0x506281, 0.33, 0.6);
    this.box([0, 1.45, -0.35], [3.7, 0.12, 1.7], desk);
    this.box([0, 1.512, -0.35], [3.62, 0.008, 1.62], this.material(0xb6bfca, 0.72));
    for (const x of [-1.55, 1.55]) {
      this.box([x, 0.71, -0.35], [0.07, 1.4, 0.9], metal);
      this.box([x, 0.055, -0.35], [0.36, 0.07, 1.05], metal);
    }
    this.box([0.1, 1.525, -0.3], [2.2, 0.018, 1.15], this.material(0x162645, 0.95));

    // Luminária: uma luz quente que contrasta com o azul da tela.
    const lamp = this.material(0x8fa1bb, 0.35, 0.7);
    this.mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), lamp, [-1.45, 1.55, -0.82]);
    this.limb([-1.45, 1.58, -0.82], [-1.45, 2.38, -0.82], 0.025, lamp);
    this.limb([-1.45, 2.38, -0.82], [-1.05, 2.65, -0.75], 0.025, lamp);
    const shade = this.mesh(
      new THREE.ConeGeometry(0.2, 0.2, 32, 1, true),
      this.material(0x9aadc8, 0.4, 0.3),
      [-1.03, 2.58, -0.75],
    );
    shade.rotation.z = -0.2;
    this.mesh(
      new THREE.CircleGeometry(0.16, 32),
      new THREE.MeshBasicMaterial({ color: 0xffeed4, side: THREE.DoubleSide }),
      [-1.03, 2.49, -0.75],
    ).rotation.x = Math.PI / 2;
    const bulb = this.mesh(
      new THREE.SphereGeometry(0.075, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xffdcae, transparent: true, opacity: 0.55 }),
      [-1.03, 2.47, -0.75],
    );
    bulb.castShadow = bulb.receiveShadow = false;
    const beam = this.lightCone([-1.06, 2.02, -0.77], 0.6, 1.08, 0xffd9ae, 0.075);
    beam.rotation.z = -0.16;

    // Caneca, caderno e caneta: uma bancada com escala humana.
    const ceramic = this.material(0xd8e2ef, 0.3);
    this.mesh(new THREE.CylinderGeometry(0.105, 0.09, 0.22, 32), ceramic, [1.12, 1.64, -0.48]);
    this.mesh(
      new THREE.CylinderGeometry(0.087, 0.087, 0.006, 32),
      this.material(0x30211f),
      [1.12, 1.754, -0.48],
    );
    this.mesh(new THREE.TorusGeometry(0.075, 0.018, 10, 24), ceramic, [1.24, 1.65, -0.48]);
    const notebook = this.box([-1.16, 1.543, 0.08], [0.47, 0.03, 0.61], this.material(0x96acc8));
    notebook.rotation.y = -0.2;
    this.limb([-1.34, 1.568, -0.06], [-1.2, 1.568, 0.3], 0.012, metal);

    // Plataforma baixa e anéis concêntricos ancoram a cena no espaço.
    this.mesh(
      new THREE.CylinderGeometry(2.15, 2.15, 0.055, 80),
      this.material(0x0c1425, 0.88),
      [0, -0.045, 0.1],
    );
    for (const radius of [2.3, 2.5, 2.72]) {
      const ring = this.mesh(
        new THREE.TorusGeometry(radius, 0.005, 4, 100),
        this.material(0x38537c, 0.8),
        [0, -0.02, 0.1],
      );
      ring.rotation.x = Math.PI / 2;
      ring.castShadow = false;
    }
  }

  makeScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5f7fc';
    ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = '#e5eaf4';
    ctx.fillRect(0, 0, 1024, 40);
    ['#cfacb3', '#d7c59e', '#9abbb2'].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(24 + i * 17, 20, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#7c8baa';
    ctx.font = '14px sans-serif';
    ctx.fillText('seja.seal.cin.ufpe.br · demonstração', 385, 25);
    ctx.fillStyle = '#101b40';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('SEAL', 60, 115);
    ctx.fillStyle = '#8796b3';
    ctx.font = '12px sans-serif';
    ctx.fillText('LIGA ACADÊMICA DE ENGENHARIA DE SOFTWARE', 525, 107);
    ctx.strokeStyle = '#dde3ef';
    ctx.beginPath();
    ctx.moveTo(50, 145);
    ctx.lineTo(974, 145);
    ctx.stroke();
    ctx.fillStyle = '#8499c4';
    ctx.font = '14px sans-serif';
    ctx.fillText('PESSOAS. IDEIAS. POSSIBILIDADES.', 62, 219);
    ctx.fillStyle = '#14264d';
    ctx.font = 'bold 65px sans-serif';
    ctx.fillText('Seu próximo', 57, 303);
    ctx.fillText('passo é', 57, 375);
    ctx.fillStyle = '#748fc9';
    ctx.fillText('na SEAL.', 57 + ctx.measureText('passo é ').width, 375);
    ctx.fillStyle = '#7d8da9';
    ctx.font = '22px sans-serif';
    ctx.fillText('Aprenda, crie e cresça junto com a liga.', 62, 426);
    ctx.fillStyle = '#152853';
    ctx.beginPath();
    ctx.roundRect(60, 466, 280, 65, 12);
    ctx.fill();
    ctx.fillStyle = '#f5f7ff';
    ctx.font = '22px sans-serif';
    ctx.fillText('Quero fazer parte   ↗', 80, 506);
    ctx.fillStyle = '#dee7f7';
    ctx.beginPath();
    ctx.roundRect(695, 200, 260, 330, 25);
    ctx.fill();
    for (let i = 2; i >= 0; i--) {
      ctx.save();
      ctx.translate(825, 345 + i * 32);
      ctx.scale(1, 0.6);
      ctx.rotate(-Math.PI / 6);
      ctx.fillStyle = ['#e9f0ff', '#acc0e5', '#89a4d4'][i];
      ctx.strokeStyle = '#7e9ccc';
      ctx.beginPath();
      ctx.roundRect(-75, -75, 150, 150, 15);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#8b9cbb';
    ctx.font = '14px sans-serif';
    ctx.fillText('CONECTANDO PESSOAS E TECNOLOGIA', 62, 595);
    ctx.fillText('CIn · UFPE', 850, 595);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    return texture;
  }

  /** Um ponteiro desenhado no canvas: o clique da história acontece diante da câmera. */
  makeCursor() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(10, 4);
    ctx.lineTo(10, 50);
    ctx.lineTo(22, 39);
    ctx.lineTo(30, 56);
    ctx.lineTo(38, 52);
    ctx.lineTo(30, 36);
    ctx.lineTo(45, 34);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1b2b52';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const cursor = new THREE.Mesh(
      new THREE.PlaneGeometry(0.055, 0.055),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false }),
    );
    cursor.renderOrder = 3;
    return cursor;
  }

  buildLaptop() {
    const alloy = this.material(0x8d9fba, 0.27, 0.75);
    const dark = this.material(0x14223b, 0.6, 0.15);
    this.box([0, 1.565, -0.42], [1.38, 0.045, 0.85], alloy);
    const hinge = this.mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 1.28, 20),
      dark,
      [0, 1.6, -0.805],
    );
    hinge.rotation.z = Math.PI / 2;
    this.screenPivot = new THREE.Group();
    this.screenPivot.position.set(0, 1.6, -0.805);
    this.screenPivot.rotation.x = -0.12;
    this.scene.add(this.screenPivot);
    this.box([0, 0.455, -0.012], [1.38, 0.91, 0.038], dark, this.screenPivot);
    this.box([0, 0.455, -0.036], [1.39, 0.91, 0.012], alloy, this.screenPivot);
    this.screen = this.mesh(
      new THREE.PlaneGeometry(1.29, 0.806),
      new THREE.MeshBasicMaterial({ map: this.makeScreenTexture(), toneMapped: false }),
      [0, 0.46, 0.01],
      this.screenPivot,
    );
    this.screen.castShadow = this.screen.receiveShadow = false;

    // Destaque pulsante sobre o botão e o ponteiro que caminha até ele.
    this.ctaGlow = this.mesh(
      new THREE.PlaneGeometry(0.4, 0.13),
      new THREE.MeshBasicMaterial({
        color: 0x9fc6ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      [CTA.x, 0.46 + CTA.y, 0.013],
      this.screenPivot,
    );
    this.ctaGlow.castShadow = this.ctaGlow.receiveShadow = false;
    this.cursor = this.makeCursor();
    this.cursor.position.set(0.3, 0.75, 0.016);
    this.screenPivot.add(this.cursor);
    this.clickRing = this.mesh(
      new THREE.TorusGeometry(0.05, 0.004, 6, 28),
      new THREE.MeshBasicMaterial({
        color: 0xdfe9ff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      [CTA.x, 0.46 + CTA.y, 0.015],
      this.screenPivot,
    );
    this.clickRing.castShadow = this.clickRing.receiveShadow = false;

    this.mesh(
      new THREE.SphereGeometry(0.008, 8, 8),
      this.material(0x26344c),
      [0, 0.885, 0.013],
      this.screenPivot,
    );
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 13; col++)
        this.box([-0.575 + col * 0.096, 1.594, -0.69 + row * 0.09], [0.079, 0.012, 0.07], dark);
    this.box([0, 1.592, -0.12], [0.43, 0.006, 0.18], this.material(0x7e91ad, 0.45, 0.7));
  }

  buildPerson() {
    const hoodie = this.material(NAVY, 0.94);
    hoodie.bumpMap = fabricTexture();
    hoodie.bumpScale = 0.006;
    const seams = this.material(0x283f6d, 0.88);
    const skin = this.material(0xb78265, 0.8);
    const hair = this.material(0x2a262e, 0.62, 0.06);
    const trousers = this.material(0x33435b, 0.96);
    const shoe = this.material(0xd9e1ec, 0.65);
    const chair = this.material(0x243650, 0.7, 0.15);

    this.person = new THREE.Group();
    this.person.position.set(0, 1.18, 0.83);
    this.scene.add(this.person);
    this.torso = new THREE.Group();
    this.person.add(this.torso);
    buildHoodie(this, hoodie, this.torso);

    this.head = new THREE.Group();
    this.head.position.set(0, 1.12, -0.01);
    this.torso.add(this.head);
    this.mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.22, 24), skin, [0, 0.035, 0], this.head);
    this.ellipsoid([0, 0.27, -0.02], [0.205, 0.275, 0.213], skin, this.head);
    buildHair(this, hair, this.head);
    for (const side of [-1, 1])
      this.ellipsoid([side * 0.202, 0.25, -0.012], [0.044, 0.071, 0.042], skin, this.head);

    // O capuz tem volume real em torno do pescoço e cai pelas costas.
    this.ellipsoid([0, 0.995, 0.12], [0.245, 0.135, 0.135], seams, this.torso);
    const collar = this.mesh(
      new THREE.TorusGeometry(0.17, 0.052, 12, 32),
      hoodie,
      [0, 1.035, -0.01],
      this.torso,
    );
    collar.rotation.x = Math.PI / 2;

    const logo = new THREE.TextureLoader().load(
      new URL('../../logo-seal.png', import.meta.url).href,
    );
    logo.colorSpace = THREE.SRGBColorSpace;
    this.mesh(
      new THREE.PlaneGeometry(0.37, 0.37),
      new THREE.MeshStandardMaterial({
        map: logo,
        roughness: 1,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
      [0, 0.65, 0.267],
      this.torso,
    );

    this.arms = [];
    this.hands = [];
    this.fingers = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      this.torso.add(arm);
      curvedSleeve(this, side, hoodie, arm);
      this.limb([side * 0.31, 0.4, -0.88], [side * 0.28, 0.4, -0.99], 0.108, seams, arm);
      const { hand, fingers } = buildHand(this, side, { skin }, arm);
      this.arms.push(arm);
      this.hands.push(hand);
      fingers.forEach((finger, i) =>
        this.fingers.push({
          node: finger,
          base: finger.position.y,
          phase: i * 1.7 + (side + 1) * 2.3,
        }),
      );

      this.limb(
        [side * 0.2, 0.03, -0.04],
        [side * 0.27, -0.06, -0.62],
        0.17,
        trousers,
        this.person,
      );
      this.limb(
        [side * 0.27, -0.06, -0.62],
        [side * 0.27, -0.94, -0.54],
        0.127,
        trousers,
        this.person,
      );
      this.ellipsoid([side * 0.27, -1.03, -0.65], [0.14, 0.105, 0.27], shoe, this.person);
      this.box(
        [side * 0.27, -1.106, -0.67],
        [0.255, 0.028, 0.41],
        this.material(0x9eafc8),
        this.person,
      );
    }

    this.ellipsoid([0, 1.055, 0.86], [0.48, 0.1, 0.43], chair);
    const back = this.box([0, 1.35, 1.14], [0.76, 0.52, 0.07], chair);
    back.rotation.x = -0.12;
    this.mesh(
      new THREE.CylinderGeometry(0.04, 0.045, 0.72, 20),
      this.material(0x71839e, 0.3, 0.7),
      [0, 0.6, 0.87],
    );
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = Math.sin(angle) * 0.48,
        z = 0.87 + Math.cos(angle) * 0.48;
      this.limb([0, 0.22, 0.87], [x, 0.1, z], 0.035, chair);
      this.mesh(new THREE.SphereGeometry(0.06, 12, 12), chair, [x, 0.065, z]);
    }
  }

  /**
   * O enquadramento considera o painel: a cena é composta dentro do retângulo que
   * sobra acima dele, e a distância da câmera vem da largura que precisa caber.
   */
  resize() {
    const width = this.container.clientWidth,
      height = this.container.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height);
    const stage = this.container.parentElement;
    const reserved = stage
      ? parseFloat(getComputedStyle(stage).getPropertyValue('--panel-h')) || 0
      : 0;
    const total = height + Math.min(reserved, height * 0.55);
    this.camera.fov = width < 700 ? 44 : 35;
    this.camera.aspect = width / total;
    this.camera.setViewOffset(width, total, 0, total - height, width, height);
    this.camera.updateProjectionMatrix();
    const narrow = width < 700;
    const framed = narrow ? 4.1 : 5.8;
    this.rest = new THREE.Vector3(0, narrow ? 2.05 : 1.86, 0);
    const reach = THREE.MathUtils.clamp(
      framed / 2 / (Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.aspect),
      5,
      13,
    );
    this.home = new THREE.Vector3(0.483, 0.264, 0.834).multiplyScalar(reach).add(this.rest);
    if (!this.flight) {
      this.camera.position.copy(this.home);
      this.target.copy(this.rest);
    }
  }

  enter(onComplete) {
    if (this.flight) return;
    this.flight = {
      start: performance.now(),
      from: this.camera.position.clone(),
      target: this.target.clone(),
      onComplete,
    };
    this.container.classList.add('flying');
  }

  reset() {
    this.flight = null;
    this.visible = true;
    this.container.classList.remove('departed', 'flying');
    this.resize();
    cancelAnimationFrame(this.frame);
    this.animate(performance.now());
  }

  /** Digitação: dedos independentes, com pausas, e um pequeno balanço do punho. */
  animateTyping(t) {
    const bursts = Math.max(0, Math.sin(t * 0.32) * 0.5 + 0.62);
    this.fingers.forEach(({ node, base, phase }) => {
      const strike = Math.sin(t * 7.4 + phase);
      node.position.y = base - Math.max(0, strike) ** 7 * 0.017 * bursts;
    });
    this.hands.forEach((hand, i) => {
      hand.rotation.x = Math.sin(t * 2.6 + i * 2.1) * 0.035 * bursts;
      hand.position.y = 0.415 + Math.sin(t * 1.3 + i) * 0.004;
    });
  }

  /** O ponteiro caminha até o botão e clica: é o gesto que abre toda a experiência. */
  animateCursor(t) {
    const cycle = (t % 6) / 6;
    const approach = ease(Math.min(1, cycle / 0.62));
    this.cursor.position.x = 0.3 + (CTA.x + 0.06 - 0.3) * approach;
    this.cursor.position.y = 0.75 + (0.46 + CTA.y - 0.02 - 0.75) * approach;
    const pressing = cycle > 0.64 && cycle < 0.78;
    this.cursor.scale.setScalar(pressing ? 0.86 : 1);
    this.ctaGlow.material.opacity = 0.06 + (pressing ? 0.24 : 0) + Math.sin(t * 2) * 0.03;
    const ring = Math.max(0, (cycle - 0.64) / 0.22);
    this.clickRing.material.opacity = ring > 0 && ring < 1 ? (1 - ring) * 0.7 : 0;
    this.clickRing.scale.setScalar(0.4 + ring * 1.9);
    this.screenLight.intensity = 3.2 + (pressing ? 1.4 : 0);
  }

  animate(now) {
    if (!this.visible) return;
    const t = now / 1000;
    if (!this.reduced) {
      if (this.dust) {
        this.dust.rotation.y = Math.sin(t * 0.08) * 0.05;
        this.dust.position.y = Math.sin(t * 0.14) * 0.05;
      }
      this.torso.rotation.z = Math.sin(t * 0.65) * 0.014;
      this.torso.rotation.x = -0.045 + Math.sin(t * 0.85) * 0.012;
      this.torso.position.y = Math.sin(t * 1.45) * 0.008;
      this.head.rotation.y = Math.sin(t * 0.43) * 0.035 + Math.sin(t * 0.11) * 0.06;
      this.head.rotation.x = -0.06 + Math.sin(t * 0.7) * 0.025;
      this.arms.forEach((arm, i) => {
        arm.rotation.x = Math.sin(t * 3.2 + i * 1.8) * 0.006;
      });
      this.animateTyping(t);
      this.animateCursor(t);
    }
    if (this.flight) {
      const duration = this.reduced ? 120 : 2450;
      const progress = Math.min(1, (now - this.flight.start) / duration);
      const p = ease(progress);
      // O arco passa pelo ombro e assenta exatamente em frente à tela.
      const end = new THREE.Vector3(0, 2.1, -0.03);
      this.camera.position.lerpVectors(this.flight.from, end, p);
      this.camera.position.y += Math.sin(progress * Math.PI) * 0.32;
      const screenTarget = new THREE.Vector3(0, 2.04, -0.83);
      this.target.lerpVectors(this.flight.target, screenTarget, p);
      if (progress > 0.86) this.container.classList.add('departed');
      if (progress === 1) {
        const callback = this.flight.onComplete;
        this.flight = null;
        this.visible = false;
        callback();
        return;
      }
    } else if (!this.reduced) {
      const swayX = Math.sin(t * 0.13) * 0.14;
      const swayY = Math.sin(t * 0.19) * 0.07;
      this.camera.position.x +=
        (this.home.x + swayX + this.pointer.x * 0.13 - this.camera.position.x) * 0.025;
      this.camera.position.y +=
        (this.home.y + swayY - this.pointer.y * 0.06 - this.camera.position.y) * 0.025;
    }
    this.camera.lookAt(this.target);
    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame((time) => this.animate(time));
  }
}
