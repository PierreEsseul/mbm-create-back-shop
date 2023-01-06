import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
    console.log('/get:', { url: req.url, query: req.query });

    res.json({ success: true });
});


router.post('/', (req, res) => {
    console.log('/post:', { req, res });

    res.json({ success: true, body: req.body });
});




export default router;