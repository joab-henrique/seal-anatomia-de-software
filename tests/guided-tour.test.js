import test from 'node:test';
import assert from 'node:assert/strict';
import { GuidedTour } from '../src/animation/guided-tour.js';
import { guide, practices } from '../src/data/guide.js';
import { layers } from '../src/data/layers.js';

const tour = (onStep, onComplete = () => {}) => new GuidedTour(guide, { onStep, onComplete });

test('espera pelo próximo clique e só conclui após a última etapa', async () => {
  const seen = [];
  let completed = 0;
  const walkthrough = tour(
    (step) => seen.push(step),
    () => completed++,
  );
  walkthrough.start();
  assert.equal(seen.length, 1);
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(seen.length, 1, 'o tempo não avança a explicação');
  for (let i = 1; i < guide.length; i++) walkthrough.next();
  assert.equal(completed, 0);
  walkthrough.next();
  assert.equal(completed, 1);
  walkthrough.next();
  assert.equal(completed, 1, 'conclusão não se repete');
});

test('sair interrompe a sequência e recomeçar volta ao primeiro passo', () => {
  const seen = [];
  const walkthrough = tour((_, index) => seen.push(index));
  walkthrough.start();
  walkthrough.next();
  walkthrough.stop();
  walkthrough.next();
  assert.deepEqual(seen, [0, 1]);
  walkthrough.start();
  assert.deepEqual(seen, [0, 1, 0]);
});

test('a trilha pula direto para qualquer passo, menos para o próprio', () => {
  const seen = [];
  const walkthrough = tour((_, index) => seen.push(index));
  walkthrough.start();
  walkthrough.goTo(5);
  walkthrough.goTo(5);
  walkthrough.goTo(99);
  walkthrough.goTo(-1);
  walkthrough.goTo(2);
  assert.deepEqual(seen, [0, 5, 2]);
});

test('a narrativa percorre as oito camadas, da interface à infraestrutura', () => {
  assert.equal(guide.length, layers.length);
  assert.deepEqual(
    guide.map((step) => step.layer),
    layers.map((_, index) => index),
  );
});

test('cada passo cabe em uma frase curta', () => {
  for (const step of guide) {
    assert.ok(step.text.length <= 110, `passo muito longo: ${layers[step.layer].term}`);
    assert.ok(step.action.length <= 22, `botão muito longo: ${step.action}`);
  }
  for (const layer of layers) {
    assert.ok(layer.term.length > 0, 'cada camada tem o termo técnico correto');
    assert.ok(layer.definition.length <= 110, `camada muito longa: ${layer.term}`);
  }
});

test('o fecho apresenta as práticas da engenharia de software, além da arquitetura', () => {
  assert.ok(practices.length > layers.length, 'a disciplina é maior que as oito camadas vistas');
  assert.ok(practices.some((practice) => /requisito/i.test(practice.term)));
  assert.ok(practices.some((practice) => /gest[ãa]o/i.test(practice.term)));
  assert.ok(practices.every((practice) => practice.term && practice.text.length <= 60));
});
