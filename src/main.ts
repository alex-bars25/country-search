import { createSearcher } from './searcher';
import { createUi } from './ui';
import { searchCountries } from './http';

const ui = createUi(document.body);
const searcher = createSearcher({
  search: searchCountries,
  onChange: ui.render,
});

ui.onInput((query) => searcher.update(query));
ui.onRetry(() => searcher.retry());
