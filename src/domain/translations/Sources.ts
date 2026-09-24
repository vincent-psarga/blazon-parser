import { Languages } from '../models/Languages';
import { Source } from './Word';

/**
 * The works this vocabulary rests on, each entry addressed by name.
 *
 * A source is written as a function rather than written out a hundred times
 * because the address is derivable from the entry: Parker files his glossary by
 * first letter and anchors every term within the page, and Au blason des
 * armoiries gives each term a page under the letter it begins with. So the entry
 * is named once, in the spelling the work itself uses, and the address follows
 * from it. A word whose entry is spelled otherwise than the word — English files
 * the bar gemel under Gemel and the green roundel under Pomeis — names the
 * entry, never the word.
 *
 * Which tongue the source is written in is the source's own business and not the
 * word's. A French term is answered for by a French work, and the reader is told
 * so before they follow the link.
 */

/**
 * James Parker, the standard English glossary, entry by entry.
 *
 * Published whole at heraldsnet.org with an anchor on every term, so a reader
 * follows the link to the entry itself rather than to the page it sits on.
 */
export function parker(entry: string): Source {
  return {
    title: `James Parker, A Glossary of Terms Used in Heraldry, under ${entry}`,
    url: `https://www.heraldsnet.org/saitou/parker/Jpgloss${entry[0].toLowerCase()}.htm#${encodeURIComponent(entry)}`,
    language: Languages.en,
  };
}

/**
 * Au blason des armoiries, the French dictionary, term by term.
 *
 * The page is the entry with its accents dropped, which is how the site files
 * most of its words, so most entries name themselves and nothing else. Where it
 * files a word otherwise the page is named: a participle keeps the feminine
 * ending the site's own filing uses — bandee for bandé — and a word meaning two
 * things is two pages, the fur hermine under one address and the field strewn
 * with its tails under another. So a page written out here is a word the site
 * does something particular with, which is worth seeing.
 */
export function blasonArmoiries(entry: string, page = unaccented(entry)): Source {
  return {
    title: `Au blason des armoiries, ${entry}`,
    url: `https://blason-armoiries.org/heraldique/${page[0]}/${page}.htm`,
    language: Languages.fr,
  };
}

/** The word as the site addresses it: lower case, and the accents dropped. */
function unaccented(entry: string): string {
  return entry
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/** La langue du blason, which answers the questions a dictionary entry does not. */
export function laLangueDuBlason(entry: string, path: string): Source {
  return {
    title: `La langue du blason, ${entry}`,
    url: `http://lalanguedublason.blogspot.com/${path}`,
    language: Languages.fr,
  };
}
