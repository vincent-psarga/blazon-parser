import { Blazon } from "../models/Blazon";

export interface IBlazonParser {
    parse(text: string): Blazon;
}
