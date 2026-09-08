const EASE = 'cubic-bezier(.16, 1, .3, 1)';
const REST = 'translate3d(0,0,0) rotateY(-5deg) rotateX(3deg) scale(1)';

/** Interruptible transitions between the physical stack and the readable foreground. */
export class LayerTransitions {
  constructor(preview) {
    this.preview = preview;
    this.animations = new Set();
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  play(element, frames, options) {
    const animation = element.animate(frames, options);
    this.animations.add(animation);
    animation.finished.catch(() => {}).finally(() => this.animations.delete(animation));
    return animation;
  }

  cancel() {
    this.animations.forEach((animation) => animation.cancel());
    this.animations.clear();
    this.preview.querySelectorAll('.departing').forEach((element) => element.remove());
  }

  show(card, source, direction = 1) {
    this.cancel();
    const previous = this.preview.firstElementChild;
    if (this.reduced) {
      this.preview.replaceChildren(card);
      return;
    }
    if (previous) {
      previous.classList.add('departing');
      const outgoing = this.play(
        previous,
        [
          { transform: REST, opacity: 1, filter: 'blur(0px)' },
          {
            transform:
              'translate3d(' +
              -direction * 28 +
              'px,-32px,-180px) rotateX(35deg) rotateZ(-16deg) scale(.72)',
            opacity: 0,
            filter: 'blur(3px)',
          },
        ],
        { duration: 440, easing: EASE, fill: 'forwards' },
      );
      outgoing.finished.then(() => previous.remove()).catch(() => {});
    }
    this.preview.append(card);
    const target = this.preview.getBoundingClientRect();
    const origin = source.getBoundingClientRect();
    const scale = target.width / 400 || 1;
    const dy = Math.max(
      -120,
      Math.min(120, (origin.top + origin.height / 2 - target.top - target.height / 2) / scale),
    );
    this.play(
      card,
      [
        {
          transform:
            'translate3d(' +
            direction * 20 +
            'px,' +
            dy +
            'px,-180px) rotateX(48deg) rotateZ(-23deg) scale(.62)',
          opacity: 0,
          filter: 'blur(2px)',
          offset: 0,
        },
        { opacity: 1, filter: 'blur(0px)', offset: 0.35 },
        { transform: REST, opacity: 1, filter: 'blur(0px)', offset: 1 },
      ],
      { duration: 900, delay: previous ? 100 : 0, easing: EASE, fill: 'backwards' },
    );
    const pieces = card.querySelectorAll('.diagram-piece,.site-copy,.site-art');
    pieces.forEach((piece, index) => {
      this.play(
        piece,
        [
          { opacity: 0, translate: '0 12px', scale: '.97' },
          { opacity: 1, translate: '0 0', scale: '1' },
        ],
        { duration: 650, delay: 340 + index * 65, easing: EASE, fill: 'backwards' },
      );
    });
  }

  clear() {
    this.cancel();
    this.preview.replaceChildren();
  }
}
