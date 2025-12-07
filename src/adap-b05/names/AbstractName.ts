import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
        this.assertClassInvariants();
    }

    public clone(): Name {
        const cstor: any = this.constructor;
        try {
            return new cstor(this.asDataString(), this.delimiter);
        } catch (e) {
            throw new MethodFailedException("Klonen fehlgeschlagen");
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        const n = this.getNoComponents();
        const comps: string[] = [];
        for (let i = 0; i < n; i++) {
            comps.push(this.getComponent(i));
        }
        const result = comps.join(delimiter);

        this.assertClassInvariants();
        return result
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

        const n = this.getNoComponents();
        if (n !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < n; i++) {
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
            const char = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + s.charCodeAt(i);
            hash |= 0; 
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
        if (other === null || other === undefined) {
            throw new IllegalArgumentException("other Name darf nicht null sein");
        }

        const oldNoComponents = other.getNoComponents();
        this.assertClassInvariants();

        this.doConcat(other);

        this.assertClassInvariants();

        const condition = this.getNoComponents() >= oldNoComponents;
        if (!condition) {
            throw new MethodFailedException("concat konnte nicht durchgeführt werden");
        }
    }

    //Geschützte Implementierungsmethode für concat
    protected doConcat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    //Hilfsmethoden

    // Klasseninvarianten prüfen
    protected assertClassInvariants(): void {
        const ok =
            this.delimiter !== null &&
            this.delimiter !== undefined &&
            this.delimiter.length === 1 &&
            this.delimiter !== ESCAPE_CHARACTER;

        if (!ok) {
            throw new InvalidStateException("Klasseninvariant verletzt: ungültiger Delimiter");
        }
    }

    // Precondition-Helfer für get/set/remove:
    // Gültig, wenn: 0 <= i < getNoComponents()
    protected assertIsValidIndexAsPrecondition(i: number, message?: string): void {
        const n = this.getNoComponents();
        if (i < 0 || i >= n) {
            throw new IllegalArgumentException(message ?? `Ungültiger Index ${i}, gültig ist 0..${n - 1}`);
        }
    }

    // Precondition-Helfer für insert:
    // Gültig, wenn: 0 <= i <= getNoComponents()
    protected assertIsValidIndexForInsertAsPrecondition(i: number, message?: string): void {
        const n = this.getNoComponents();
        if (i < 0 || i > n) {
            throw new IllegalArgumentException(message ?? `Ungültiger Insert-Index ${i}, gültig ist 0..${n}`);
        }
    }

    // Precondition-Helfer für set/insert/append:
    // Gültig, wenn Komponente korrekt maskiert ist
    protected assertIsProperlyMaskedAsPrecondition(component: string, message?: string): void {
        if (!this.isProperlyMasked(component)) {
            throw new IllegalArgumentException(message ?? "Komponente ist nicht korrekt maskiert");
        }
    }

    // Prüft, ob eine Komponente korrekt maskiert ist
    protected isProperlyMasked(component: string): boolean {
        let escaped = false;

        for (let i = 0; i < component.length; i++) {
            const ch = component[i];

            if (escaped) {
                escaped = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                escaped = true;
                continue;
            }

            if (ch === this.delimiter) {
                return false;
            }
        }

        if (escaped) {
            return false;
        }

        return true;
    }

}