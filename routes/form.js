import express from 'express';

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

router.post('/upload-image', async (req, res) => {
    console.log('Value de req.body in form l.27 : ', req.body.image);
    // const ret = await newShop(req.body.image);
    const ret = "ok";

    // s3 enregistrement

    if (!ret) {
        return res.json({ success: false, error: "Erreur enregistrement image" });
     }
     res.json({ success: true, body: req.body, urlImage: "retour s3" });
});


export default router;