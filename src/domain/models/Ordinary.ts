import { Tincture } from './Tinctures';

/**
 * The ordinaries: the plain geometric bands a field is charged with, named after
 * the lines they follow. Eight of them so far, listed as heraldry lists them —
 * the straight bands first, then the diagonals, then the ones that bend or
 * cross. A field bears at most one.
 *
 * Several share a name with a partition, because both are named after the same
 * line: a field may be divided per fess or charged with a fess. What tells them
 * apart is the word in front, which is the language's business rather than the
 * model's.
 */
export enum OrdinaryType {
  chief = 'Ordinary.chief',
  pale = 'Ordinary.pale',
  fess = 'Ordinary.fess',
  bend = 'Ordinary.bend',
  bendSinister = 'Ordinary.bendSinister',
  chevron = 'Ordinary.chevron',
  cross = 'Ordinary.cross',
  saltire = 'Ordinary.saltire',
}

/**
 * One ordinary, in its own tincture. A charge may itself be charged, and may be
 * drawn with a modified line, but neither is in the vocabulary yet: an ordinary
 * here is a plain band of a plain tincture.
 */
export type Ordinary = {
  type: OrdinaryType;
  tincture: Tincture;
};
