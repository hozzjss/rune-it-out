import { Rune } from "./rune";

export class SpacedRune {
  rune: Rune;
  spacers: number;

  constructor(rune: Rune, spacers: number) {
    this.rune = rune;
    this.spacers = spacers;
  }

  toString(): string {
    const rune = this.rune.toString();
    let result = "";

    for (let i = 0; i < rune.length; i++) {
      result += rune[i];
      if (i < rune.length - 1 && ((this.spacers >> i) & 1) !== 0) {
        result += "•";
      }
    }

    return result;
  }
  static fromStr(s: string): SpacedRune {
    let runeStr = "";
    let spacers = 0;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (
        "A".charCodeAt(0) <= c.charCodeAt(0) &&
        c.charCodeAt(0) <= "Z".charCodeAt(0)
      ) {
        runeStr += c;
      } else if (c === "." || c === "•") {
        const flag = 1 << (runeStr.length - 1);
        if ((spacers & flag) !== 0) {
          throw new Error("double spacer");
        }
        spacers |= flag;
      } else {
        throw new Error(`invalid character ${c}`);
      }
    }

    const rune = Rune.fromStr(runeStr);

    if (32 - Math.clz32(spacers) >= runeStr.length) {
      throw new Error("trailing spacer");
    }

    return new SpacedRune(rune, spacers);
  }
}
