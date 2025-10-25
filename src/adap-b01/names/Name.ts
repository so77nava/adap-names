export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /*
    --------------Helper and Assertion methods--------------
    */

    //@methodtype assertion-method
    protected assertIsNotNullOrUndefined<T>(value: T, message: string): void {
        if (value === null || value === undefined) {
            throw new Error(message);
        }
    }

    //@methodtype assertion-method
    protected assertValidDelimiter(d: string): void {
        if (typeof d !== 'string' || d.length !== 1) {
            throw new RangeError(`Ungültiger Delimiter "${d}". Erwartet genau ein einzelnes Zeichen.`);
        }
        if (d === ESCAPE_CHARACTER) {
            throw new RangeError(`Der Delimiter darf nicht das Escape-Zeichen "${ESCAPE_CHARACTER}" sein.`);
        }
    }

    //@methodtype assertion-method
    protected assertIndexInRange(i: number, allowEnd: boolean = false): void {
        const max = allowEnd ? this.components.length : this.components.length - 1;
        if (!Number.isInteger(i) || i < 0 || i > max) {
            throw new RangeError(`Index ${i} außerhalb des gültigen Bereichs 0..${max}.`);
        }
    }

    // @methodtype helper-method (conversion)
    private unmaskComponent(masked: string, forDelimiter: string): string {
        let out = '';
        let escaping = false;
        for (let i = 0; i < masked.length; i++) {
            const ch = masked[i];
            if (escaping) {
                if (ch === forDelimiter || ch === ESCAPE_CHARACTER) {
                    out += ch;
                } else {
                    out += ch; 
                }
                escaping = false;
            } else {
                if (ch === ESCAPE_CHARACTER) {
                    escaping = true;
                } else {
                    out += ch;
                }
            }
        }
        if (escaping) {
            out += ESCAPE_CHARACTER;
        }
        return out;
    }

    // @methodtype helper-method (conversion)
    private maskComponent(unmasked: string, forDelimiter: string): string {
        let s = '';
        for (let i = 0; i < unmasked.length; i++) {
            const ch = unmasked[i];
            if (ch === ESCAPE_CHARACTER) {
                s += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
            } else if (ch === forDelimiter) {
                s += ESCAPE_CHARACTER + forDelimiter;
            } else {
                s += ch;
            }
        }
        return s;
    }
    
    // @methodtype helper-method (conversion)
    private remaskFromInstanceTo(delimTarget: string, maskedByInstance: string): string {
        const unmasked = this.unmaskComponent(maskedByInstance, this.delimiter);
        return this.maskComponent(unmasked, delimTarget);
    }


    /** Expects that all Name components are properly masked */

    //@methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        this.assertIsNotNullOrUndefined(other, 'other darf nicht null/undefined sein.');
        const d = delimiter ?? DEFAULT_DELIMITER;
        this.assertValidDelimiter(d);
        // defensive copy
        this.components = [...other];
        this.delimiter = d;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);
        const parts = this.components.map(c => this.unmaskComponent(c, this.delimiter));
        return parts.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        const maskedForDefault = this.components.map(c => this.remaskFromInstanceTo(DEFAULT_DELIMITER, c));
        return maskedForDefault.join(DEFAULT_DELIMITER);
    }

    /** Returns Name component at index i */
    //@methodtype get-method
    public getComponent(i: number): string {
        this.assertIndexInRange(i);
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    //@methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIndexInRange(i);
        this.assertIsNotNullOrUndefined(c, 'Komponente darf nicht null/undefined sein.');
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
    //@methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    //@methodtype command-method
    public insert(i: number, c: string): void {
        this.assertIndexInRange(i, true);
        this.assertIsNotNullOrUndefined(c, 'Komponente darf nicht null/undefined sein.');
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    //@methodtype command-method
    public append(c: string): void {
        this.assertIsNotNullOrUndefined(c, 'Komponente darf nicht null/undefined sein.');
        this.components.push(c);
    }

    /** Removes component at index i */
    //@methodtype command-method
    public remove(i: number): void {
        this.assertIndexInRange(i);
        this.components.splice(i, 1);
    }

}