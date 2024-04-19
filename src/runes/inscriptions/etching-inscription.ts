import { Buff } from "@cmdcode/buff";
import { keys } from "@cmdcode/crypto-tools";
import { Address, type Networks, Tap } from "@cmdcode/tapscript";
import { SpacedRune } from "../spaced-rune";
import { reverseEndianHex } from "../util/reverse-hex";

export const buildEtchingInscriptionCommit = async ({
  file,
  runeName,
  secret,
  network,
}: {
  file: Blob;
  secret: Uint8Array;
  runeName: string;
  network: Networks;
}) => {
  const fileData = new Uint8Array(await file.arrayBuffer());

  const marker = Buff.encode("ord");
  const mimetype = Buff.encode(file.type);

  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  const spacedRune = SpacedRune.fromStr(runeName);
  const reversedRune = Buff.hex(
    reverseEndianHex(spacedRune.rune.value.toString(16))
  );
  const script = [
    pubkey,
    "OP_CHECKSIG",
    "OP_0",
    "OP_IF",
    marker,
    Buff.big(13n),
    reversedRune,
    "01",
    mimetype,
    "OP_0",
    fileData,
    "OP_ENDIF",
  ];

  const tapleaf = Tap.encodeScript(script);
  // Generate a tapkey that includes our leaf script. Also, create a merlke proof
  // (cblock) that targets our leaf and proves its inclusion in the tapkey.
  const [tpubkey, cblock] = Tap.getPubKey(pubkey, { target: tapleaf });
  // A taproot address is simply the tweaked public key, encoded in bech32 format.
  const inscribingAddress = Address.p2tr.fromPubKey(tpubkey, network);

  /* NOTE: To continue with this example, send 100_000 sats to the above address.
   * You will also need to make a note of the txid and vout of that transaction,
   * so that you can include that information below in the redeem tx.
   */

  // console.log("Your txhex:", Tx.encode(txdata).hex)
  // console.dir(txdata, { depth: null })

  return {
    inscribingAddress,
    cblock,
    tpubkey,
    seckey,
    script,
  };
};
