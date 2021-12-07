const jose = require('jose');

(async function run() {
    const { publicKey, privateKey } = await jose.generateKeyPair("EdDSA",{
        crv: "Ed25519"
    });
    const private = await jose.exportPKCS8(privateKey);
    const public = await jose.exportSPKI(publicKey);
    console.log(`PUB_KEY=${Buffer.from(public).toString('base64')}`)
    console.log(`PRIV_KEY=${Buffer.from(private).toString('base64')}`)
})();
