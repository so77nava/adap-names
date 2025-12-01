import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const constor: any = this.constructor;
        try {
            return new constor(this.asDataString(), this.delimiter);
        } catch (e) {
            throw new Error("Clone nicht unterstützt: Unterklasse hat inkompatiblen Konstruktor. Bitte clone() überschreiben.");
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        const x = this.getNoComponents();
        const comps: string[] = [];
        for (let i = 0; i < x; i++) {
            comps.push(this.getComponent(i));
        }
        return comps.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }

        const x = this.getNoComponents();
        if (x !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < x; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) - hash) + s.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            this.append(other.getComponent(i));
        }
    }

}