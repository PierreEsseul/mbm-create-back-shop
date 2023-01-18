import mysql from "mysql2";
import slugify from "slugify";
import dotenv from 'dotenv';
import FormData from 'form-data';
import { Webhook } from "discord-webhook-node";


dotenv.config();
const successHook = new Webhook("https://discord.com/api/webhooks/1043935729966919746/nXzq0VanJZIULHQloaMZ_V41GZLD3ZzVOAm3oLfxgGn4toVgviF-25jDSnNWyyFdQSWm");
const errorHook = new Webhook("https://discord.com/api/webhooks/1043932829425348628/VbvsAw6k3w6HKXWGtDJDmRjxzEyF3_JR5bni4P3d21L0lIBbBCyIWjCwakMyWBda6SId");

successHook.setUsername(`API - Form MadeByMe (${process.env.ENVIRONMENT})`);
errorHook.setUsername(`API - Form MadeByMe (${process.env.ENVIRONMENT})`);

const pool = mysql.createPool({
  host: process.env.HOST_MYSQL,
  port: process.env.PORT_MYSQL,
  user: process.env.USER_MYSQL,
  password: process.env.PASSWORD_MYSQL,
  database: process.env.DB_MYSQL,
});

const promisePool = pool.promise();

async function newShop(data) {
    const id_user = await saveUser(data);
    if (!id_user) {
        return null; //retourner une erreur pour la renvoyer au front
    }

    const id_shop = await saveShop(data, id_user);
    if (!id_shop) {
        return null;
    }
    
    const ret = await saveArticles(data.articles, id_user, id_shop);
    if (!ret){
        return null;
    }

    if (data.recover.includes("collect")) {
        await saveAddress(data, id_shop);
    }

    successHook.success(
        `**Création d'une nouvelle boutique par : ${data.mail}!!** 
        \nNom de la boutique : ${data.shopName}.
        \nContenant : ${data.articles.length} article(s)!`);
    // successHook.success(
    //     "**Création d'une nouvelle boutique par : " + data.mail + "!!**" + 
    //     "\nNom de la boutique : " + data.shopName + "." +
    //     "\nContenant : " + data.articles.length + " article(s)!");
    return { id_user, id_shop };
}

async function saveUser(data) {
    const sql = "INSERT INTO users SET mail = ?";
    try {
        const [rows] = await promisePool.query(sql, [data.mail]);
        return rows.insertId;
    } 
    catch (err) {
        if (err.errno === 1062) {
            return await getUserIdByMail(data.mail);
        }
        errorHook.send("saveUser : " + err);
    }
}

async function getUserIdByMail(mail) {
    try {
        const [rows, _] = await promisePool.query(
            `SELECT id_user FROM users WHERE mail = ?`,
            [mail]
        );

        if (!rows || rows?.length === 0) {
            return null;
        }
        return rows[0].id_user;
    } 
    catch (error) {
        errorHook.error("getUserIdByMail : " + error);
        return null;
    }
};

async function saveShop(data, id_user) {
    const shop = data.shopName;

    let order = data.recover.length === 2 ? "both" : data.recover[0];
    let payment = data.payment.length === 2 ? "both" : data.payment[0];
    let slug = getSlugShopName(shop);
    data.slug = slug;
    let i = 1;

    do {
        try {
            const [rows, _] = await promisePool.query(
                "INSERT INTO shops (id_user, name_shop, slugify_name, order_type, payment_type) VALUES (?, ?, ?, ?, ?)",
                [id_user, shop, data.slug, order, payment]
            );
            return rows.insertId;
        } 
        catch (error) {
            if (error.errno === 1062) {
                data.slug = `${slug}-${i}`;
            } else {
                errorHook.error("saveShop : " + error);
                return null;
            }
        }
        i++;
    } while (true);
}

const getSlugShopName = (shop_name) => {
    return slugify(shop_name, { lower: true, remove: /[*+~.;,()'"!?:@]/g });
};

async function saveArticles(articles, id_user, id_shop) {
    let sql = "INSERT INTO articles (id_user, id_shop, name_article, picture_url, amount_article, description) VALUES ?";

    console.log('Value articles in createShop l.124 : ', articles);
    const formatArticles = articles.map((value) => { 
        return [id_user, id_shop, value.articleName, value.image, value.amount, value.description]; 
    });

    try {
        const [rows, _] = await promisePool.query(sql, [formatArticles]);  
        return rows.insertId;
    } 
    catch (error) {
        console.log('saveArticles - error :>> ', error);
        errorHook.error("saveArticles : " + error)
        return null;
    }
}

async function saveAddress(data, id_shop) {
    const sql = "INSERT INTO address SET id_shop = ?, street = ?, postal_code = ?, city = ?, hours = ?, phone_number = ?";

    try {
        const [rows] = await promisePool.query(sql, [id_shop, data.address.street, data.address.postalCode, data.address.city, data.address.hours, data.address.phoneNumber]);
        return rows.insertId;
    } catch (error) {
        errorHook.error("saveAddress : " + error);
        return null;
    }
  
}

export default newShop;



