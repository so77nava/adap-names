import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {

    protected readonly name: string = "";
    protected readonly noComponents: number = 0;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        if (source === null || source === undefined) {
            throw new IllegalArgumentException("StringName(): Quell-String ist null oder undefined");
        }

        this.name = source;

        // Komponenten zählen (maskiert)
        const comps = (source === "") ? [] : this.splitMasked(source);
        this.noComponents = comps.length;

        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndexAsPrecondition(i, "getComponent(): ungültiger Index");
        const comps = this.splitMasked(this.name);
        return comps[i];
    }

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndexAsPrecondition(i, "setComponent(): ungültiger Index");
        this.assertIsProperlyMaskedAsPrecondition(c, "setComponent(): Komponente nicht korrekt maskiert");

        const oldNo = this.getNoComponents();

        const comps = this.splitMasked(this.name);
        comps[i] = c;

        const result = new StringName(this.joinMasked(comps), this.delimiter);

        if (result.getNoComponents() !== oldNo) {
            throw new MethodFailedException("setComponent(): Anzahl der Komponenten muss unverändert bleiben");
        }
        return result;
    }

    public insert(i: number, c: string): Name {
        this.assertIsValidIndexForInsertAsPrecondition(i, "insert(): ungültiger Index");
        this.assertIsProperlyMaskedAsPrecondition(c, "insert(): Komponente nicht korrekt maskiert");

        const oldNo = this.getNoComponents();

        const comps = this.splitMasked(this.name);
        comps.splice(i, 0, c);

        const result = new StringName(this.joinMasked(comps), this.delimiter);

        if (result.getNoComponents() !== oldNo + 1) {
            throw new MethodFailedException("insert(): Anzahl der Komponenten muss sich um 1 erhöhen");
        }
        return result;
    }

    public append(c: string): Name {
        return this.insert(this.getNoComponents(), c);
    }

    public remove(i: number): Name {
        this.assertIsValidIndexAsPrecondition(i, "remove(): ungültiger Index");

        const oldNo = this.getNoComponents();

        const comps = this.splitMasked(this.name);
        comps.splice(i, 1);

        const result = new StringName(this.joinMasked(comps), this.delimiter);

        if (result.getNoComponents() !== oldNo - 1) {
            throw new MethodFailedException("remove(): Anzahl der Komponenten muss sich um 1 verringern");
        }
        return result;
    }

    public concat(other: Name): Name {
        if (other === null || other === undefined) {
            throw new IllegalArgumentException("concat(): other ist null oder undefined");
        }
        if (other.getDelimiterCharacter() !== this.delimiter) {
            throw new IllegalArgumentException("concat(): Delimiter müssen übereinstimmen");
        }

        const comps = this.splitMasked(this.name);
        for (let i = 0; i < other.getNoComponents(); i++) {
            comps.push(other.getComponent(i));
        }
        return new StringName(this.joinMasked(comps), this.delimiter);
    }

    // -------- Hilfsmethoden --------

    protected splitMasked(s: string): string[] {
        if (s === "" && this.noComponents === 0) {
            return [];
        }

        const result: string[] = [];
        let current = "";
        let escaped = false;

        for (let i = 0; i < s.length; i++) {
            const ch = s[i];

            if (escaped) {
                current += ch;
                escaped = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                escaped = true;
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

    protected joinMasked(comps: string[]): string {
        if (comps.length === 0) {
            return "";
        }
        return comps.join(this.delimiter);
    }
}
