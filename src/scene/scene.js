import { layers } from '../data/layers.js';
import { internals, plateHeader } from './content.js';
import { LayerTransitions } from '../animation/layer-transitions.js';

const GAP = 76;
const MIDPOINT = (layers.length - 1) / 2;

/** Objetos 3D, gesto de rotação, enquadramento responsivo e o pulso da requisição. */
export class SoftwareScene {
  constructor(root, { onLayer, onBackground, onFit }) {
    this.root = root;
    this.stage = root.querySelector('#stage');
    this.model = root.querySelector('#model');
    this.anchor = root.querySelector('#model-anchor');
    this.preview = root.querySelector('#focus-preview');
    this.onFit = onFit;
    this.panel = root.querySelector('#panel');
    this.transitions = new LayerTransitions(this.preview);
    this.rotation = { x: 0, y: 0 };
    this.opened = false;
    this.interactive = true;
    this.selected = -1;
    this.drag = null;
    this.suppressClick = false;

    this.plates = layers.map((layer, index) => {
      const plate = document.createElement('button');
      plate.type = 'button';
      plate.className = 'plate' + (index === 0 ? ' ui-plate' : '');
      plate.style.setProperty('--i', index);
      plate.style.setProperty('--color', layer.color);
      plate.setAttribute('aria-label', index + 1 + '. ' + layer.term + ' — ' + layer.plain);
      const decoration = index
        ? plateHeader(index) + '<i class="corner"></i><i class="corner"></i>'
        : '';
      plate.innerHTML =
        '<div class="plate-top">' +
        decoration +
        internals[index] +
        '</div><span class="plate-badge"><b>' +
        String(index + 1).padStart(2, '0') +
        '</b>' +
        layer.term +
        '</span>';
      plate.title = index + 1 + '. ' + layer.term;
      plate.addEventListener('click', () => {
        if (!this.suppressClick) onLayer(index);
      });
      root.querySelector('#plates').append(plate);
      return plate;
    });

    this.stage.addEventListener('pointerdown', (event) => {
      if (!this.interactive) return;
      this.drag = { x: event.clientX, y: event.clientY, rx: this.rotation.x, ry: this.rotation.y };
      this.suppressClick = false;
    });
    this.stage.addEventListener('pointermove', (event) => {
      if (!this.drag) return;
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      if (Math.hypot(dx, dy) < 8) return;
      this.suppressClick = true;
      this.rotation.x = Math.max(-14, Math.min(14, this.drag.rx - dy / 12));
      this.rotation.y = Math.max(-28, Math.min(28, this.drag.ry + dx / 8));
      this.rotate();
    });
    window.addEventListener('pointerup', () => {
      this.drag = null;
      setTimeout(() => {
        this.suppressClick = false;
      }, 0);
    });
    this.stage.addEventListener('pointercancel', () => {
      this.drag = null;
      this.suppressClick = false;
    });
    this.stage.addEventListener('click', (event) => {
      if (!event.target.closest('button') && !this.suppressClick) onBackground();
    });

    this.resizeObserver = new ResizeObserver(() => this.fit());
    this.resizeObserver.observe(root);
    this.resizeObserver.observe(this.panel);
    this.fit();
  }

  setOpen(opened) {
    this.opened = opened;
    this.root.classList.toggle('opened', opened);
    this.model.style.setProperty('--spread', opened ? 1 : 0);
    this.plates.forEach((plate, index) => {
      plate.tabIndex = opened || index === 0 ? 0 : -1;
      plate.style.pointerEvents = !opened && index > 0 ? 'none' : '';
    });
    this.select(-1);
    this.rotate();
    requestAnimationFrame(() => this.fit());
  }

  setInteractive(value) {
    this.interactive = value;
    this.plates.forEach((plate, index) => {
      const reachable = value && (this.opened || index === 0);
      plate.tabIndex = reachable ? 0 : -1;
      plate.style.pointerEvents = reachable ? '' : 'none';
    });
  }

  select(index) {
    const previous = this.selected;
    this.selected = index;
    this.root.style.setProperty('--accent', index >= 0 ? layers[index].color : '#8fb0ff');
    this.root.classList.toggle('focused', index >= 0);
    this.plates.forEach((plate, i) => {
      plate.classList.toggle('chosen', i === index);
      plate.setAttribute('aria-pressed', String(i === index));
    });
    if (index < 0) {
      this.transitions.clear();
      requestAnimationFrame(() => this.fit());
      return;
    }
    const card = document.createElement('div');
    card.className = 'detail-object' + (index === 0 ? ' detail-site' : '');
    card.style.setProperty('--color', layers[index].color);
    const content = this.plates[index].querySelector('.plate-top').cloneNode(true);
    content.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
    card.append(content);
    this.transitions.show(card, this.plates[index], index >= previous ? 1 : -1);
    requestAnimationFrame(() => this.fit());
  }

  /** O pulso desce até a camada em foco; a infraestrutura fica na base da pilha. */
  moveSignal(index) {
    this.root.querySelector('#signal').style.transform =
      'translateZ(' + ((MIDPOINT - Math.min(index, 6)) * GAP + 22) + 'px)';
  }

  rotate() {
    this.model.style.setProperty('--rx', this.rotation.x + 'deg');
    this.model.style.setProperty('--ry', this.rotation.y + 'deg');
    if (this.opened) this.model.style.removeProperty('transform');
    else
      this.model.style.transform =
        'rotateX(' +
        (7 + this.rotation.x) +
        'deg) rotateY(' +
        (-12 + this.rotation.y) +
        'deg) rotateZ(-3deg)';
  }

  /**
   * O painel reserva o rodapé. Quando há espaço, a pilha inteira fica à esquerda e a
   * camada aberta à direita: dá para ver onde se está e ler o conteúdo ao mesmo tempo.
   */
  fit() {
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;
    if (!width || !height) return;
    const bounds = this.root.getBoundingClientRect();
    const panel = this.panel.getBoundingClientRect();
    const panelHeight = Math.max(0, height - (panel.top - bounds.top) + 10);
    this.root.style.setProperty('--panel-w', '0px');
    this.root.style.setProperty('--panel-h', panelHeight + 'px');

    const top = 82;
    const bottom = height - panelHeight - 10;
    const left = 18;
    const right = width - 18;
    const areaWidth = Math.max(200, right - left);
    const areaHeight = Math.max(170, bottom - top);
    const centerY = (top + bottom) / 2;

    const focused = this.selected >= 0;
    const split = focused && areaWidth >= 880 && areaHeight >= 300;
    this.root.classList.toggle('split', split);

    const stackX = split ? left + areaWidth * 0.29 : left + areaWidth / 2;
    const stackWidth = split ? areaWidth * 0.46 : areaWidth;
    const scale = this.opened
      ? Math.min(stackWidth / 545, areaHeight / 555, 1.35)
      : Math.min(stackWidth / 660, areaHeight / 500, 1.3);
    this.anchor.style.setProperty('--scale', scale);
    this.anchor.style.left = stackX + 'px';
    this.anchor.style.top = centerY + 'px';

    const detailX = split ? left + areaWidth * 0.69 : left + areaWidth / 2;
    const detailWidth = split ? areaWidth * 0.56 : areaWidth;
    const detailScale = Math.min(detailWidth / 430, areaHeight / 320, 1.6);
    this.preview.style.setProperty('--detail-scale', detailScale);
    this.preview.style.left = detailX + 'px';
    this.preview.style.top = centerY + 'px';
    this.onFit?.();
  }

  resetRotation() {
    this.rotation = { x: 0, y: 0 };
    this.rotate();
  }
}
