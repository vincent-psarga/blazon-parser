import { Languages } from '../../src/domain/models/Languages';
import { Source } from '../../src/domain/translations/Word';

/**
 * The works the documentation rests on that the vocabulary does not.
 *
 * Parker and Au blason des armoiries answer for the words themselves, so they
 * are the library's and are built in `src/domain/translations/Sources.ts`. These
 * two answer for decisions rather than for terms — how a blazon is written back,
 * and where the word order comes from — which is a question only these pages
 * ask. The library would ship them to anyone installing it and never use them.
 */

/**
 * Kevin Greaves, the Royal Heraldry Society of Canada's guide.
 *
 * One PDF rather than a page per term, so what is named is the place within it.
 */
export function greaves(at: string): Source {
  return {
    title: `Kevin Greaves, A Guide to Blazonry, Royal Heraldry Society of Canada, 2014, ${at}`,
    url: 'https://www.heraldry.ca/resources/BLAZONRY_GUIDE_2014.pdf',
    language: Languages.en,
  };
}

/**
 * Wikipedia, for what is a fact about a language rather than about heraldry.
 *
 * Cited once, for where blazon's word order comes from. A claim about heraldry
 * itself is owed a herald.
 */
export function wikipedia(article: string): Source {
  return {
    title: `Wikipedia, ${article}`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(article.replace(/ /g, '_'))}`,
    language: Languages.en,
  };
}
