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

  root.append(title, input, status, retry, list);

  const renderCard = (c: CountryCard): HTMLLIElement => {
    const li = document.createElement('li');
    li.className = 'card';

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

  const render = (state: SearchState): void => {
    retry.hidden = true;
    spinner.hidden = state.kind !== 'loading';
    switch (state.kind) {
      case 'idle':
        statusText.textContent = '';
        list.replaceChildren();
        break;
      case 'loading':
        statusText.textContent = 'Загрузка…';
        list.replaceChildren();
        break;
      case 'results':
        statusText.textContent = '';
        list.replaceChildren(...state.countries.map(renderCard));
        break;
      case 'empty':
        statusText.textContent = 'Ничего не найдено';
        list.replaceChildren();
        break;
      case 'error':
        statusText.textContent = state.message;
        list.replaceChildren();
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
