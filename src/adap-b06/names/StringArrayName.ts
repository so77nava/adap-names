import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringArrayName extends AbstractName {

    protected readonly components: string[] = [];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        if (source === null || source === undefined) {
            throw new IllegalArgumentException("StringArrayName(): Quell-Array ist null oder undefined");
        }

        const copy = source.slice();

        for (let i = 0; i < copy.length; i++) {
            this.assertIsProperlyMaskedAsPrecondition(
                copy[i],
                `StringArrayName(): Komponente an Index ${i} ist nicht korrekt maskiert`
            );
        }

        this.components = copy;
        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringArrayName(this.components.slice(), this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndexAsPrecondition(i, "getComponent(): ungültiger Index");
        return this.components[i];
    }

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndexAsPrecondition(i, "setComponent(): ungültiger Index");
        this.assertIsProperlyMaskedAsPrecondition(c, "setComponent(): Komponente nicht korrekt maskiert");

        const oldNo = this.getNoComponents();

        const next = this.components.slice();
        next[i] = c;

        const result = new StringArrayName(next, this.delimiter);

        if (result.getNoComponents() !== oldNo) {
            throw new MethodFailedException("setComponent(): Anzahl der Komponenten muss unverändert bleiben");
        }
        return result;
    }

    public insert(i: number, c: string): Name {
        this.assertIsValidIndexForInsertAsPrecondition(i, "insert(): ungültiger Index");
        this.assertIsProperlyMaskedAsPrecondition(c, "insert(): Komponente nicht korrekt maskiert");

        const oldNo = this.getNoComponents();

        const next = this.components.slice();
        next.splice(i, 0, c);

        const result = new StringArrayName(next, this.delimiter);

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

        const next = this.components.slice();
        next.splice(i, 1);

        const result = new StringArrayName(next, this.delimiter);

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

        const next = this.components.slice();
        for (let i = 0; i < other.getNoComponents(); i++) {
            next.push(other.getComponent(i));
        }
        return new StringArrayName(next, this.delimiter);
    }
}
