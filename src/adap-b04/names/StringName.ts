import { ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.splitMasked(this.name).length;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        const comps = this.splitMasked(this.name);
        return comps.join(delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.getNoComponents();
    }

    public getComponent(i: number): string {
        const comps = this.splitMasked(this.name);
        if (i < 0 || i >= comps.length) {
            throw new RangeError(`Index ${i} außerhalb des gültigen Bereichs.`);
        }
        return comps[i];
    }

    public setComponent(i: number, c: string) {
        const comps = this.splitMasked(this.name);
        if (i < 0 || i >= comps.length) {
            throw new RangeError(`Index ${i} außerhalb des gültigen Bereichs.`);
        }
        comps[i] = c;
        this.rebuildString(comps);
    }

    public insert(i: number, c: string) {
        const comps = this.splitMasked(this.name);
        if (i < 0 || i > comps.length) {
            throw new RangeError(`Index ${i} außerhalb des gültigen Bereichs.`);
        }
        comps.splice(i, 0, c);
        this.rebuildString(comps);
    }

    public append(c: string) {
        const comps = this.splitMasked(this.name);
        comps.push(c);
        this.rebuildString(comps);
    }

    public remove(i: number) {
        const comps = this.splitMasked(this.name);
        if (i < 0 || i >= comps.length) {
            throw new RangeError(`Index ${i} außerhalb des gültigen Bereichs.`);
        }
        comps.splice(i, 1);
        this.rebuildString(comps);
    }

    public concat(other: Name): void {
        const comps = this.splitMasked(this.name);
        for (let i = 0; i < other.getNoComponents(); i++) {
            comps.push(other.getComponent(i));
        }
        this.rebuildString(comps);
    }

    //Hilfsfunktion zum Zerlegen eines maskierten Strings in Komponenten

    protected splitMasked(s: string): string[] {
        const result: string[] = [];
        let current = "";
        let escape = false;

        for (let i = 0; i < s.length; i++) {
            const ch = s[i];

            if (escape) {
                current += ch;
                escape = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                escape = true;
                continue;
            }

            if (ch === this.delimiter) {
                result.push(current);
                current = "";
                continue;
            }

            current += ch;
        }
        result.push(current);
        return result;
    }

    //Hilfsfunktion zum Zusammensetzen eines Strings aus Komponenten

    protected rebuildString(comps: string[]): void {
        this.name = comps.join(this.delimiter);
        this.noComponents = comps.length;
    }

}