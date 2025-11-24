import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const data = this.asDataString();
        return new (this.constructor as any)(data, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        const x = this.getNoComponents();
        const components: string[] = [];
        for (let i = 0; i < x; i++) {
            components.push(this.getComponent(i));
        }
        return components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        const x = this.getNoComponents();
        for (let i = 0; i < x; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        const str = this.asDataString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
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
        const x = other.getNoComponents();
        for (let i = 0; i < x; i++) {
            this.append(other.getComponent(i));
        }
    }
    
}