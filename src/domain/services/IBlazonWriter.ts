import {Blazon} from "../models/Blazon";

export interface IBlazonWriter {
    write(blazon: Blazon): string
}
