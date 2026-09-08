/** Traços contínuos, um mesmo peso de linha: os ícones leem bem em qualquer tamanho. */
const shapes = {
  touch:
    '<rect x="8" y="3" width="20" height="30" rx="4"/><path d="M17 27V15a2 2 0 0 1 4 0v7l2-1 4 4v5l-3 5h-8l-5-7a2 2 0 0 1 3-2l3 3"/>',
  message: '<rect x="4" y="8" width="28" height="22" rx="4"/><path d="m5 10 13 10 13-10"/>',
  arrow: '<path d="M5 18h25M23 11l7 7-7 7"/>',
  door: '<path d="M8 32V5h20v27M4 32h28M16 8v24M22 19h1"/>',
  system:
    '<rect x="5" y="5" width="26" height="26" rx="5"/><rect x="12" y="12" width="12" height="12" rx="2"/><path d="M13 1v4M23 1v4M13 31v4M23 31v4M1 13h4M1 23h4M31 13h4M31 23h4"/>',
  check: '<path d="m8 18 7 7 14-15"/>',
  person: '<circle cx="18" cy="11" r="6"/><path d="M7 31v-3a11 11 0 0 1 22 0v3"/>',
  return: '<path d="M10 11h12a9 9 0 0 1 0 18h-5M10 11l7-7M10 11l7 7"/>',
  record: '<rect x="7" y="3" width="22" height="30" rx="4"/><path d="M12 11h12M12 17h12M12 23h7"/>',
  database:
    '<ellipse cx="18" cy="8" rx="12" ry="5"/><path d="M6 8v20c0 7 24 7 24 0V8M6 18c0 7 24 7 24 0"/>',
  screen: '<rect x="3" y="5" width="30" height="22" rx="3"/><path d="M18 27v6M10 33h16"/>',
  server:
    '<rect x="7" y="3" width="22" height="30" rx="4"/><path d="M7 13h22M7 23h22M12 8h1M12 18h1M12 28h1M20 8h4M20 18h4M20 28h4"/>',
  network:
    '<circle cx="18" cy="8" r="5"/><circle cx="7" cy="28" r="5"/><circle cx="29" cy="28" r="5"/><path d="M18 13v7M7 23v-3h22v3"/>',
  code: '<path d="m12 11-9 7 9 7M24 11l9 7-9 7M21 6l-6 24"/>',
  branch:
    '<circle cx="10" cy="7" r="4"/><circle cx="10" cy="29" r="4"/><circle cx="27" cy="14" r="4"/><path d="M10 11v14M10 18h9a4 4 0 0 0 4-4v-1"/>',
  pipeline:
    '<rect x="2" y="12" width="11" height="12" rx="3"/><rect x="23" y="12" width="11" height="12" rx="3"/><path d="M13 18h10M18 13v-6M15 10l3-3 3 3"/>',
  pulse: '<path d="M2 18h7l4-11 7 22 4-11h8"/>',
  gear: '<circle cx="18" cy="18" r="6"/><path d="M18 2v5M18 29v5M34 18h-5M7 18H2M29 7l-3 4M10 25l-4 4M29 29l-3-4M10 11 6 7"/>',
  lock: '<rect x="6" y="15" width="24" height="18" rx="4"/><path d="M12 15V10a6 6 0 0 1 12 0v5"/>',
  clock: '<circle cx="18" cy="18" r="14"/><path d="M18 9v9l6 4"/>',
};

export function icon(name) {
  return (
    '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    shapes[name] +
    '</svg>'
  );
}
