import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        if (source === null || source === undefined) {
            throw new IllegalArgumentException("Quell-String ist null oder undefined");
        }

        this.name = source;
        if (source === ""){
            this.noComponents = 0;
        } else {
            const comps = this.splitMasked(source);
            this.noComponents = comps.length;
        }

        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
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
        this.assertIsValidIndexAsPrecondition(i, "Index für getComponent ist ungültig");

        const comps = this.splitMasked(this.name);
        return comps[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndexAsPrecondition(i, "Index für setComponent ist ungültig");
        this.assertIsProperlyMaskedAsPrecondition(c, "Neue Komponente für setComponent ist nicht korrekt maskiert");

        const oldNoComponents = this.getNoComponents();
        this.assertClassInvariants();

        const comps = this.splitMasked(this.name);
        comps[i] = c;
        this.rebuildString(comps);

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNoComponents) {
            throw new MethodFailedException("Anzahl der Komponenten hat sich nach setComponent verändert");
        }
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndexForInsertAsPrecondition(i, "insert(): ungültiger Index");
        this.assertIsProperlyMaskedAsPrecondition(c, "insert(): Komponente nicht korrekt maskiert");

        const oldNo = this.getNoComponents();
        this.assertClassInvariants();

        const comps = this.splitMasked(this.name);
        comps.splice(i, 0, c);
        this.rebuildString(comps);

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNo + 1) {
            throw new MethodFailedException("insert(): Anzahl der Komponenten muss sich um 1 erhöhen");
        }
    }

    public append(c: string) {
        this.assertIsProperlyMaskedAsPrecondition(c, "append(): Komponente nicht korrekt maskiert");

        const oldNo = this.getNoComponents();
        this.assertClassInvariants();

        const comps = this.splitMasked(this.name);
        comps.push(c);
        this.rebuildString(comps);

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNo + 1) {
            throw new MethodFailedException("append(): Anzahl der Komponenten muss sich um 1 erhöhen");
        }
    }

    public remove(i: number) {
        this.assertIsValidIndexAsPrecondition(i, "remove(): ungültiger Index");

        const oldNo = this.getNoComponents();
        this.assertClassInvariants();

        const comps = this.splitMasked(this.name);
        comps.splice(i, 1);
        this.rebuildString(comps);

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNo - 1) {
            throw new MethodFailedException("remove(): Anzahl der Komponenten muss sich um 1 verringern");
        }
    }

    public concat(other: Name): void {
        super.concat(other);
    }

    // Hilfsmethoden

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

    // Baut den internen String aus den Komponenten neu auf
    protected rebuildString(comps: string[]): void {
        if (comps.length === 0) {
            this.name = "";
            this.noComponents = 0;
        } else {
            this.name = comps.join(this.delimiter);
            this.noComponents = comps.length;
        }
    }

}