require('dotenv').config();
const express = require('express');
const jose = require('jose');
const app = express();
const data = require('./mock_data.json');

(async function() {
    // preload keys
    const privateKey = await jose.importPKCS8(
        Buffer.from(process.env.PRIV_KEY, "base64").toString("utf-8"),
        "EdDSA"
    );

    const publicKey = await jose.importSPKI(
        Buffer.from(process.env.PUB_KEY, "base64").toString("utf-8"),
        "EdDSA"
    );

    async function validateJWT(jwt) {
        try {
            const {payload, protectedHeader} = await jose.jwtVerify(jwt, publicKey, {
                issuer: 'primary_backend',
                audience: 'primary_frontend'
            });

            return [
                true,
                payload["urn:example:username"]
            ]
        } catch(e) {
            return [
                false
            ];
        }
    }

    app.use(express.json());
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN ?? "*");
        res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET");
        next();
    })
    app.post("/authenticate", async(req, res) => {
        // Verify username and password
        // TODO: Attach a database connection
        if (!req.body.username || !req.body.password) {
            return res.status(400).end();
        }

        if (req.body.username === process.env.USERNAME && req.body.password === process.env.PASSWORD) {
            // issue jwt
            const jwt = await new jose.SignJWT({ 'urn:example:username': req.body.username })
                .setProtectedHeader({ alg: 'EdDSA' })
                .setIssuedAt()
                .setIssuer('primary_backend')
                .setAudience('primary_frontend')
                .setExpirationTime('2h')
                .sign(privateKey, {
                    crit: true
                });
            return res.json({
                jwt
            })
        } else {
            return res.status(401).json({
                error: "Invalid username or password"
            })
        }
    })

    app.get("/whoami", async (req, res) => {
        let [success, username] = (await validateJWT(req.headers.authorization));
        if (!success) {
            return res.status(401).end();
        }

        return res.json({
            username
        })
    });

    app.get("/data", async (req, res) => {
        let [success, username] = (await validateJWT(req.headers.authorization));
        if (!success) {
            return res.status(401).end();
        }

        return res.json({
            data
        })
    })

    app.listen(process.env.PORT);
})();
