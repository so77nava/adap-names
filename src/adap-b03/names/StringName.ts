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
        return this.splitMasked(this.name).join(delimiter);
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
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const components = this.splitMasked(this.name);
        if (i < 0 || i >= components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        return components[i];
    }

    public setComponent(i: number, c: string) {
        const components = this.splitMasked(this.name);
        if (i < 0 || i >= components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        components[i] = c;
        this.rebuildString(components);
    }

    public insert(i: number, c: string) {
        const components = this.splitMasked(this.name);
        if (i < 0 || i > components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        components.splice(i, 0, c);
        this.rebuildString(components);
    }

    public append(c: string) {
        const components = this.splitMasked(this.name);
        components.push(c);
        this.rebuildString(components);
    }

    public remove(i: number) {
        const components = this.splitMasked(this.name);
        if (i < 0 || i >= components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        components.splice(i, 1);
        this.rebuildString(components);
    }

    public concat(other: Name): void {
        const ownerComps = this.splitMasked(this.name);
        const x = other.getNoComponents();
        for (let i = 0; i < x; i++) {
            ownerComps.push(other.getComponent(i));
        }
        this.rebuildString(ownerComps);
    }


    // Hilfsfunktionen

    //Splittet einen maskierten String korrekt anhand des delimiters.
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


    //Rekonstruiert den internen maskierten String aus Komponenten.
    protected rebuildString(comps: string[]): void {
        this.name = comps.join(this.delimiter);
        this.noComponents = comps.length;
    }


}