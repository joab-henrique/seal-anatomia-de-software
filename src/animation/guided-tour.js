/** A navegação pertence ao visitante: nenhum temporizador avança a explicação. */
export class GuidedTour {
  constructor(steps, { onStep, onComplete }) {
    this.steps = steps;
    this.onStep = onStep;
    this.onComplete = onComplete;
    this.index = -1;
    this.active = false;
  }

  start() {
    this.active = true;
    this.index = 0;
    this.emit();
  }

  next() {
    if (!this.active) return;
    if (this.index === this.steps.length - 1) {
      this.active = false;
      this.onComplete();
      return;
    }
    this.index++;
    this.emit();
  }

  previous() {
    if (!this.active || this.index <= 0) return;
    this.index--;
    this.emit();
  }

  /** A trilha de passos permite pular direto para qualquer parada já explicada. */
  goTo(index) {
    if (!this.active || index < 0 || index >= this.steps.length || index === this.index) return;
    this.index = index;
    this.emit();
  }

  emit() {
    this.onStep(this.steps[this.index], this.index, this.steps.length);
  }

  stop() {
    this.active = false;
    this.index = -1;
  }
}
