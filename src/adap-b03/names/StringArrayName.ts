import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        this.components = source.slice();
    }

    public clone(): Name {
        return new StringArrayName(this.components.slice(), this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} out of bounds.`);
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const x = other.getNoComponents();
        for (let i = 0; i < x; i++) {
            this.append(other.getComponent(i));
        }
    }
}