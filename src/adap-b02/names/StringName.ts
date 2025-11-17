import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.noComponents = this.parseComponentsMasked().length;
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === this.delimiter) {
            return this.name;
        }
        const parseComponentsUnescaped: string[] = this.parseComponentsUnescaped();

        if (parseComponentsUnescaped.length === 0) {
            return "";
        }

        const remasked = parseComponentsUnescaped.map(c => this.maskComponentForDelimiter(c, delimiter));
        return remasked.join(delimiter);
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const components = this.parseComponentsMasked();
        if (x < 0 || x >= components.length) {
            throw new RangeError("index out of bounds in getComponent: ${x}");
        }
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        const components = this.parseComponentsMasked();
        if (n < 0 || n >= components.length) {
            throw new RangeError("index out of bounds in setComponent: ${n}");
        }

        components[n] = c;
        this.setComponentsArrayMasked(components);
    }

    public insert(n: number, c: string): void {
        const components = this.parseComponentsMasked();
        if (n < 0 || n > components.length) {
            throw new RangeError("index out of bounds in insert: ${n}");
        }

        components.splice(n, 0, c);
        this.setComponentsArrayMasked(components);
    }

    public append(c: string): void {
        this.insert(this.noComponents, c);
    }

    public remove(n: number): void {
        const components = this.parseComponentsMasked();
        if (n < 0 || n >= components.length) {
            throw new RangeError("index out of bounds in remove: ${n}");
        }

        components.splice(n, 1);
        this.setComponentsArrayMasked(components);
    }

    public concat(other: Name): void {
        const components = this.parseComponentsMasked();
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            components.push(other.getComponent(i));
        }
        this.setComponentsArrayMasked(components);
    }

    // ---------------------------------------------------------------------
    // Hilfsfunktionen
    // ---------------------------------------------------------------------

    /**
        Parst die interne String-Repräsentation in maskierte Komponenten.
        ESCAPE_CHARACTER + nächstes Zeichen werden als Teil der Komponente
        übernommen (Maskierung bleibt erhalten).
     */
    protected parseComponentsMasked(): string[] {
        if (this.name.length === 0) {
            return [];
        }

        const result: string[] = [];
        let current: string = "";

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];

            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) {
                    current += ESCAPE_CHARACTER + this.name[i + 1];
                    i++;
                } else {
                    current += ESCAPE_CHARACTER;
                }
            } else if (ch === this.delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }

        result.push(current);
        return result;
    }

    /**
        Parst die interne String-Repräsentation in ENT-masketierte Komponenten.
        ESCAPE_CHARACTER maskiert das folgende Zeichen; das Escape-Zeichen selbst
        wird dabei entfernt.
     */
    protected parseComponentsUnescaped(): string[] {
        if (this.name.length === 0) {
            return [];
        }

        const result: string[] = [];
        let current: string = "";

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];

            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) {
                    current += this.name[i + 1];
                    i++;
                } else {
                    current += ESCAPE_CHARACTER;
                }
            } else if (ch === this.delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }

        result.push(current);
        return result;
    }

    /*
        Erzeugt aus einer unmaskierten Komponente eine maskierte Repräsentation
        für einen bestimmten Delimiter.
        ESCAPE_CHARACTER und der Delimiter selbst werden mit ESCAPE_CHARACTER
        vorangestellt.
     */
    protected maskComponentForDelimiter(component: string, delimiter: string): string {
        let result = "";
        for (let i = 0; i < component.length; i++) {
            const ch = component[i];
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                result += ESCAPE_CHARACTER;
            }
            result += ch;
        }
        return result;
    }

    /*
       Setzt die interne Repräsentation aus einem Array maskierter Komponenten.
     */
    protected setComponentsArrayMasked(components: string[]): void {
        if (components.length === 0) {
            this.name = "";
            this.noComponents = 0;
        } else {
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
        }
    }

}