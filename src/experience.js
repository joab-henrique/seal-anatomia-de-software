import { layers } from './data/layers.js';
import { guide, conclusion } from './data/guide.js';
import { SoftwareScene } from './scene/scene.js';
import { Controls } from './ui/controls.js';
import { GuidedTour } from './animation/guided-tour.js';

const INTRO = { title: 'O que existe por trás de um clique?' };

/** Quatro modos explícitos: abertura, narrativa guiada, fecho e exploração livre. */
export class Experience {
  constructor(root) {
    this.root = root;
    this.state = { mode: 'intro', selected: -1, step: 0 };
    this.transitioning = false;

    this.scene = new SoftwareScene(root, {
      onLayer: (index) => {
        if (this.state.mode === 'explore') this.select(index);
        else if (this.state.mode === 'intro') this.begin();
      },
      onBackground: () => {
        if (this.state.mode === 'explore') this.overview();
      },
      onFit: () => this.intro?.resize(),
    });

    this.controls = new Controls(root, {
      toggle: () => this.back(),
      advance: () => this.advance(),
      rail: (index) => this.jump(index),
      reset: () => this.reset(),
    });

    this.tour = new GuidedTour(guide, {
      onStep: (entry, step) => {
        this.state.step = step;
        this.state.selected = entry.layer;
        this.scene.select(entry.layer);
        this.scene.moveSignal(entry.layer);
        this.controls.caption({
          term: 'Passo ' + (step + 1) + ' de ' + guide.length,
          title: layers[entry.layer].term,
          titleDetail: layers[entry.layer].plain,
          text: entry.text,
        });
        this.render();
      },
      onComplete: () => this.complete(),
    });

    this.reset();
    this.initIntro();
  }

  async initIntro() {
    this.controls.get('advance').disabled = true;
    try {
      const { IntroWorld } = await import('./scene/intro-world.js');
      this.intro = new IntroWorld(this.root.querySelector('#intro-world'));
      this.root.classList.add('has-webgl');
    } catch (error) {
      console.warn('Abertura 3D indisponível; usando a cena leve.', error);
      this.root.querySelector('#intro-world').hidden = true;
    } finally {
      this.controls.get('advance').disabled = false;
    }
  }

  begin() {
    if (this.transitioning) return;
    const enter = () => {
      this.transitioning = false;
      this.root.classList.remove('entering');
      this.controls.get('advance').disabled = false;
      this.state.mode = 'guided';
      this.scene.setOpen(true);
      this.scene.setInteractive(false);
      this.tour.start();
    };
    if (!this.intro) {
      enter();
      return;
    }
    this.transitioning = true;
    this.root.classList.add('entering');
    this.controls.get('advance').disabled = true;
    this.intro.enter(enter);
  }

  render() {
    const { mode } = this.state;
    this.root.classList.toggle('guided', mode === 'guided');
    this.root.classList.toggle('explore', mode === 'explore');
    this.root.classList.toggle('success', mode === 'complete');
    this.root.dataset.mode = mode;
    this.controls.render(this.state);
    this.controls.footnote('');
  }

  advance() {
    if (this.transitioning) return;
    switch (this.state.mode) {
      case 'intro':
        this.begin();
        break;
      case 'guided':
        this.tour.next();
        break;
      case 'complete':
        this.explore();
        break;
      case 'explore':
        if (this.state.selected === layers.length - 1) this.overview();
        else this.select(this.state.selected + 1);
        break;
    }
  }

  back() {
    if (this.transitioning) return;
    if (this.state.mode === 'guided') this.tour.previous();
    else if (this.state.mode === 'explore' && this.state.selected >= 0) this.overview();
    else this.reset();
  }

  /** A trilha serve aos dois modos: pular um passo da narrativa ou abrir uma camada. */
  jump(index) {
    if (this.transitioning) return;
    if (this.state.mode === 'guided') this.tour.goTo(index);
    else if (this.state.mode === 'explore') this.select(index);
  }

  explore() {
    this.state.mode = 'explore';
    this.scene.setOpen(true);
    this.scene.setInteractive(true);
    this.overview();
  }

  overview() {
    this.state.mode = 'explore';
    this.state.selected = -1;
    this.scene.select(-1);
    this.controls.caption({
      term: 'As oito camadas',
      title: 'Um sistema, por dentro.',
      text: 'Toque em uma camada. Arraste para girar.',
    });
    this.render();
  }

  select(index) {
    if (this.state.mode !== 'explore' || index < 0 || index >= layers.length) return;
    const layer = layers[index];
    this.state.selected = index;
    this.scene.select(index);
    this.controls.caption({
      term: 'Camada ' + (index + 1) + ' de ' + layers.length,
      title: layer.term,
      titleDetail: layer.plain,
      text: layer.definition,
    });
    this.render();
  }

  complete() {
    this.state.mode = 'complete';
    this.state.selected = -1;
    this.scene.setOpen(false);
    this.scene.select(-1);
    this.controls.siteLabel('Demonstração concluída ✓');
    this.controls.caption(conclusion);
    this.render();
  }

  reset() {
    this.transitioning = false;
    this.root.classList.remove('entering');
    this.controls.get('advance').disabled = false;
    this.tour.stop();
    this.intro?.reset();
    this.state = { mode: 'intro', selected: -1, step: 0 };
    this.scene.resetRotation();
    this.scene.setOpen(false);
    this.scene.setInteractive(true);
    this.controls.siteLabel('Quero receber novidades');
    this.controls.caption(INTRO);
    this.render();
  }
}
