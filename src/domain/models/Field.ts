import {Tincture} from "./Tinctures";

export type Field = {
    tincture: Tincture;
} | Division

export enum DivisionType {
    fess = 'fess',
    pale = 'pale',
    bend = 'bend',
    bendSinister = 'bendSinister',

}

export type Division = {
    type: DivisionType,
    firstTincture: Tincture,
    secondTincture: Tincture,
}
