import express from 'express';

import middlewareUploadSingleFile from '../src/upload.js'
import newShop from '../src/createShop.js';

const router = express.Router();

router.get('/', (req, res) => {
    console.log('/get:', { url: req.url, query: req.query });

    res.json({ success: true });
});

router.post('/', async (req, res) => {
    const ret = await newShop(req.body);
    
    if (!ret) {
       return res.json({ success: false, error: "Erreur enregistrement shop" });
    }
    res.json({ success: true, body: req.body, slug: req.body.slug, ret: ret }); 
    console.log(res.json());   
});

router.post('/upload-image', middlewareUploadSingleFile, async (req, res) => {
    
    res.json({ success: true, urlImage: req.file.location || null });
});

export default router;

