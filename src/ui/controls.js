import { layers } from '../data/layers.js';
import { guide, practices } from '../data/guide.js';
import { icon } from '../scene/icons.js';

/**
 * O painel é o único lugar onde se lê e se clica. O maior elemento da tela é sempre
 * o nome da camada em foco; a trilha de oito botões mostra onde a requisição está.
 */
export class Controls {
  constructor(root, actions) {
    this.root = root;
    this.actions = actions;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');

    this.rail = layers.map((layer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.setProperty('--dot', layer.color);
      button.innerHTML = '<b>' + (index + 1) + '</b><span>' + layer.term + '</span>';
      button.addEventListener('click', () => actions.rail(index));
      this.get('rail').append(button);
      return button;
    });

    this.get('practice-grid').innerHTML = practices
      .map(
        (practice, index) =>
          '<article class="practice" style="--d:' +
          index +
          ';--tone:' +
          layers[index].color +
          '"><span class="practice-icon">' +
          icon(practice.icon) +
          '</span><strong>' +
          practice.term +
          '</strong><p>' +
          practice.text +
          '</p></article>',
      )
      .join('');

    ['toggle', 'advance', 'reset'].forEach((id) =>
      this.get(id).addEventListener('click', actions[id]),
    );
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') actions.reset();
      if (event.key === 'ArrowRight' || event.key === 'Enter') actions.advance();
      if (event.key === 'ArrowLeft') actions.toggle();
    });
  }

  get(id) {
    return this.root.querySelector('#' + id);
  }

  /** Etiqueta de posição, nome da camada em destaque, uma frase e o rastro técnico. */
  caption({ term, title, text, trace }) {
    const termNode = this.get('caption-term');
    termNode.hidden = !term;
    if (term) termNode.textContent = term;
    this.get('caption-title').textContent = title;
    const textNode = this.get('caption-text');
    textNode.hidden = !text;
    if (text) textNode.textContent = text;
    const traceNode = this.get('caption-trace');
    traceNode.hidden = !trace;
    if (trace) traceNode.textContent = trace;
    if (this.reduced.matches) return;
    const caption = this.root.querySelector('.caption');
    caption.getAnimations().forEach((animation) => animation.cancel());
    caption.animate(
      [
        { opacity: 0.1, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' },
    );
  }

  render({ mode, selected, step }) {
    const guided = mode === 'guided';
    const explore = mode === 'explore';
    const complete = mode === 'complete';
    const marker = guided ? step : selected;

    this.get('toggle').hidden = mode === 'intro';
    this.get('toggle-label').textContent = guided
      ? 'Voltar'
      : complete
        ? 'Recomeçar'
        : selected < 0
          ? 'Recomeçar'
          : 'Ver todas';
    this.get('toggle-icon').textContent = guided ? '←' : complete || selected < 0 ? '↺' : '⤢';
    this.get('toggle').setAttribute(
      'aria-label',
      guided ? 'Passo anterior' : complete || selected < 0 ? 'Recomeçar' : 'Ver todas as camadas',
    );
    this.get('toggle').disabled = guided && step === 0;
    this.get('advance-label').textContent = guided
      ? guide[step].action
      : complete
        ? 'Explorar as camadas'
        : explore
          ? selected === layers.length - 1
            ? 'Ver todas'
            : 'Próxima camada'
          : 'Começar';

    this.get('rail').hidden = !(guided || explore);
    this.get('rail').setAttribute(
      'aria-label',
      guided ? 'Ir para um passo da requisição' : 'Escolher uma camada',
    );
    this.rail.forEach((button, index) => {
      button.classList.toggle('active', index === marker);
      button.classList.toggle('done', guided && index < step);
      button.setAttribute('aria-pressed', String(index === marker));
      button.setAttribute('aria-label', index + 1 + '. ' + layers[index].term);
    });

    this.get('practices').hidden = !complete;
  }

  siteLabel(text) {
    this.root.querySelectorAll('.site-cta-label').forEach((node) => {
      node.textContent = text;
      node.closest('.site-cta')?.classList.toggle('done', text.includes('✓'));
    });
  }

  footnote(text) {
    this.get('footnote').textContent = text;
  }
}
