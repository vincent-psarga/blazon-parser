import { Tincture } from './Tinctures';

export type Field =
  | {
      tincture: Tincture;
    }
  | Division;

export enum DivisionType {
  fess = 'DivisionType.fess',
  pale = 'DivisionType.pale',
  bend = 'DivisionType.bend',
  bendSinister = 'DivisionType.bendSinister',
}

export type Division = {
  type: DivisionType;
  firstTincture: Tincture;
  secondTincture: Tincture;
};

export function isDivision(field: Field): field is Division {
  return 'type' in field;
}
