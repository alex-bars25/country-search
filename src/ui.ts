import type { SearchState } from './searcher';
import type { CountryCard } from './types';

export interface Ui {
  onInput(cb: (query: string) => void): void;
  onRetry(cb: () => void): void;
  render(state: SearchState): void;
}

export function createUi(root: HTMLElement): Ui {
  const title = document.createElement('h1');
  title.textContent = 'Поиск стран';

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Например: Spain';

  const status = document.createElement('div');
  status.className = 'status';

  const spinner = document.createElement('span');
  spinner.className = 'spinner';
  spinner.hidden = true;

  const statusText = document.createElement('span');

  status.append(spinner, statusText);

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Повторить';
  retry.hidden = true;

  const list = document.createElement('ul');
  list.className = 'results';

  const detail = document.createElement('section');
  detail.className = 'detail';
  detail.hidden = true;

  root.append(title, input, status, retry, list, detail);

  const renderCard = (c: CountryCard): HTMLLIElement => {
    const li = document.createElement('li');
    li.className = 'card';
    li.tabIndex = 0;
    li.addEventListener('click', () => showDetail(c));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showDetail(c);
      }
    });

    const img = document.createElement('img');
    img.src = c.flag;
    img.alt = `Флаг ${c.name}`;

    const info = document.createElement('div');

    const name = document.createElement('strong');
    name.textContent = c.name;

    const sub = document.createElement('div');
    sub.textContent = `${c.capital} · ${c.region}`;

    const pop = document.createElement('div');
    pop.textContent = `Население: ${c.population.toLocaleString()}`;

    info.append(name, sub, pop);
    li.append(img, info);
    return li;
  };

  const showDetail = (c: CountryCard): void => {
    detail.replaceChildren();

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Закрыть';
    close.addEventListener('click', () => {
      detail.hidden = true;
    });

    const name = document.createElement('h2');
    name.textContent = c.name;

    const dl = document.createElement('dl');

    const row = (label: string, value: string) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      dl.append(dt, dd);
    };

    row('Столица', c.capital);
    row('Регион', c.region);
    row('Население', c.population.toLocaleString());
    row('Площадь', `${c.area.toLocaleString()} км²`);
    row('Языки', c.languages.join(', ') || '—');
    row('Валюты', c.currencies.join(', ') || '—');
    row('Границы', c.borders.join(', ') || '—');

    detail.append(close, name, dl);
    detail.hidden = false;
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const render = (state: SearchState): void => {
    retry.hidden = true;
    spinner.hidden = state.kind !== 'loading';
    switch (state.kind) {
      case 'idle':
        statusText.textContent = '';
        list.replaceChildren();
        detail.hidden = true;
        break;
      case 'loading':
        statusText.textContent = 'Загрузка…';
        list.replaceChildren();
        detail.hidden = true;
        break;
      case 'results':
        statusText.textContent = '';
        list.replaceChildren(...state.countries.map(renderCard));
        detail.hidden = true;
        break;
      case 'empty':
        statusText.textContent = 'Ничего не найдено';
        list.replaceChildren();
        detail.hidden = true;
        break;
      case 'error':
        statusText.textContent = state.message;
        list.replaceChildren();
        detail.hidden = true;
        retry.hidden = !state.canRetry;
        break;
    }
  };

  return {
    onInput(cb) {
      input.addEventListener('input', () => cb(input.value));
    },
    onRetry(cb) {
      retry.addEventListener('click', cb);
    },
    render,
  };
}
