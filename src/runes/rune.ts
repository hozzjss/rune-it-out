export class Rune {
  private n: bigint;
  static RESERVED = BigInt("6402364363415443603228541259936211926");
  constructor(n: bigint) {
    this.n = n;
  }

  get value(): bigint {
    return this.n;
  }

  static fromStr(s: string): Rune {
    let x = 0n;
    for (let i = 0; i < s.length; i++) {
      if (i > 0) {
        x += 1n;
      }
      try {
        x = BigInt(x * 26n);
      } catch (e) {
        throw new Error("name out of range");
      }
      const cCode = s.charCodeAt(i);
      if ("A".charCodeAt(0) <= cCode && cCode <= "Z".charCodeAt(0)) {
        try {
          x += BigInt(cCode - "A".charCodeAt(0));
        } catch (e) {
          throw new Error("name out of range");
        }
      } else {
        throw new Error(`invalid character ${s[i]}`);
      }
    }
    return new Rune(x);
  }

  toString(): string {
    let n = this.n;
    if (n === BigInt(Number.MAX_SAFE_INTEGER)) {
      return "BCGDENLQRQWDSLRUGSNLBTMFIJAV";
    }

    n += BigInt(1);
    let symbol = "";
    while (n > BigInt(0)) {
      const index = Number((n - BigInt(1)) % BigInt(26));
      symbol += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(index);
      n = (n - BigInt(1)) / BigInt(26);
    }

    return symbol.split("").reverse().join("");
  }
}
