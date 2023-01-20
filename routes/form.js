import express from 'express';

import upload from '../src/upload.js'
import newShop from '../src/createShop.js';

const router = express.Router();

router.get('/', (req, res) => {
    console.log('/get:', { url: req.url, query: req.query });

    res.json({ success: true });
});


router.post('/', async (req, res) => {
    console.log('Value req.body in form.js l.18 : ',req.body);
    const ret = await newShop(req.body);
    
    if (!ret) {
       return res.json({ success: false, error: "Erreur enregistrement shop" });
    }
    res.json({ success: true, body: req.body, ret: ret });    
});

const uploadFunc = upload.single('file'); // formData.append("file", file);
router.post('/upload-image', async (req, res) => {
    console.log('\n\n/upload-image', { file: req.file })

    uploadFunc(req, res, (err) => {
        if (err || !req.file) {
            return res.json({ success: false, error: req.errorMessage || "Erreur enregistrement image s3", errno: req.errorErrno,  urlImage: null });
        }
        res.json({ success: true, urlImage: req.file.location || null });
    })
});


export default router;