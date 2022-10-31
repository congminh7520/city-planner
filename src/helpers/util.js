const CID = require("cids");
const multihashing = require("multihashing-async");

export const hashUrl = (itemFetch) => {
  return fetch(itemFetch)
    .then((res) => {
      return res.blob();
    })
    .then((blob) => blob.arrayBuffer())
    .then(async (buffer) => {
      const buffer8Arr = new Uint8Array(buffer);
      const cid = await getCID(buffer8Arr);
      return cid;
    });
};

export async function getCID(bufferArr) {
  const hash = await multihashing(bufferArr, "sha2-256");
  let cid = new CID(1, "raw", hash);
  return cid.toBaseEncodedString();
}

export const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
