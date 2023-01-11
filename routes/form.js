import express from 'express';

import newShop from '../src/createShop.js';

import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
    console.log('/get:', { url: req.url, query: req.query });

    res.json({ success: true });
});


router.post('/', async (req, res) => {
    const ret = await newShop(req.body);

    res.json({ success: true, body: req.body, ret: ret });
});


export default router;