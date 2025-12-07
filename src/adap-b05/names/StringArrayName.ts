import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        if (source === null || source === undefined) {
            throw new IllegalArgumentException("Quell-Array ist null oder undefined");
        }
        this.components = source.slice();

        for (let i = 0; i < this.components.length; i++) {
            this.assertIsProperlyMaskedAsPrecondition(this.components[i],`StringArrayName(): Komponente an Index ${i} ist nicht korrekt maskiert`);
        }

        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringArrayName(this.components.slice(), this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
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
        this.assertIsValidIndexAsPrecondition(i, "Index für getComponent ist ungültig");
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndexAsPrecondition(i, "Index für setComponent ist ungültig");
        this.assertIsProperlyMaskedAsPrecondition(c, "Neue Komponente für setComponent ist nicht korrekt maskiert");

        const oldNoComponents = this.getNoComponents();
        this.assertClassInvariants();

        this.components[i] = c;

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNoComponents) {
            throw new MethodFailedException("Anzahl der Komponenten hat sich nach setComponent verändert");
        }
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndexForInsertAsPrecondition(i, "Index für insert ist ungültig");
        this.assertIsProperlyMaskedAsPrecondition(c, "Neue Komponente für insert ist nicht korrekt maskiert");

        const oldNoComponents = this.getNoComponents();
        this.assertClassInvariants();

        this.components.splice(i, 0, c);

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNoComponents + 1) {
            throw new MethodFailedException("Anzahl der Komponenten hat sich nach insert nicht korrekt verändert");
        }
    }

    public append(c: string) {
        this.assertIsProperlyMaskedAsPrecondition(c, "Neue Komponente für append ist nicht korrekt maskiert");

        const oldNoComponents = this.getNoComponents();
        this.assertClassInvariants();

        this.components.push(c);

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNoComponents + 1) {
            throw new MethodFailedException("Anzahl der Komponenten hat sich nach append nicht korrekt verändert");
        }
    }

    public remove(i: number) {
        this.assertIsValidIndexAsPrecondition(i, "Index für remove ist ungültig");

        const oldNoComponents = this.getNoComponents();
        this.assertClassInvariants();

        this.components.splice(i, 1);

        this.assertClassInvariants();

        if (this.getNoComponents() !== oldNoComponents - 1) {
            throw new MethodFailedException("Anzahl der Komponenten hat sich nach remove nicht korrekt verändert");
        }
    }

    public concat(other: Name): void {
        super.concat(other);
    }
}