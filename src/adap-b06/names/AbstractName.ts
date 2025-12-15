import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

/**
 * Abstrakte Basisklasse für Name als Value Object.
 * - Immutable: keine Methode mutiert this.
 * - Equality Contract: Vergleich über Wert (Delimiter + Komponenten), unabhängig von Repräsentation.
 */
export abstract class AbstractName implements Name {

    protected readonly delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
        this.assertClassInvariants();
    }

    /**
     * Value Objects können bei Immutability gefahrlos kopiert werden.
     */
    public clone(): Name {
        const ctor: any = this.constructor;
        return new ctor(this.asDataString(), this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertClassInvariants();

        const n = this.getNoComponents();
        const comps: string[] = [];
        for (let i = 0; i < n; i++) {
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

    public isEqual(other: Object): boolean {
        if (!this.isName(other)) {
            return false;
        }
        const o: Name = other;

        if (this.getDelimiterCharacter() !== o.getDelimiterCharacter()) return false;
        if (this.getNoComponents() !== o.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== o.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
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

    // ---------- Abstrakte Komponenten-API ----------
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;

    // Immutable Operationen (liefern neues Name-Objekt)
    abstract setComponent(i: number, c: string): Name;
    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;
    abstract concat(other: Name): Name;

    // ---------- DbC-Helfer ----------
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

    protected assertIsValidIndexAsPrecondition(i: number, message?: string): void {
        const n = this.getNoComponents();
        if (i < 0 || i >= n) {
            throw new IllegalArgumentException(message ?? `Ungültiger Index ${i}, gültig ist 0..${n - 1}`);
        }
    }

    protected assertIsValidIndexForInsertAsPrecondition(i: number, message?: string): void {
        const n = this.getNoComponents();
        if (i < 0 || i > n) {
            throw new IllegalArgumentException(message ?? `Ungültiger Insert-Index ${i}, gültig ist 0..${n}`);
        }
    }

    protected assertIsProperlyMaskedAsPrecondition(component: string, message?: string): void {
        if (!this.isProperlyMasked(component)) {
            throw new IllegalArgumentException(message ?? "Komponente ist nicht korrekt maskiert");
        }
    }

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
        return !escaped;
    }

    private isName(o: any): o is Name {
        return o !== null
            && o !== undefined
            && typeof o.getNoComponents === "function"
            && typeof o.getComponent === "function"
            && typeof o.getDelimiterCharacter === "function";
    }
}
