import mysql from "mysql2";
import slugify from "slugify";
import dotenv from 'dotenv';
dotenv.config();

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
    //web book sur discords
    // Success
    return { id_user, id_shop };
}

async function saveUser(data) {
  const sql = `INSERT INTO users (mail) VALUES ('${data.mail}');`;

  try {
    const [rows, _] = await promisePool.query(sql);

    return rows.insertId;
  } catch (err) {
    if (err.errno === 1062) {
        return await getUserIdByMail(data.mail);
    }
    // Webhook Error saveUser
    console.log("saveUser - err: ", err);
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

    } catch (error) {
        // Webhook Error getUserIdByMail
        console.error("getUserIdByMail - err : ", error);
        return null;
    }
};

// recover: [ 'delivery', 'collect' ]
//TODO: Penser a modifier dans le front le pickup par le mot collect;
// payment: [ 'card', 'cash' ],
//TODO: Penser a modifier dans le front le card par le mot cb;

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
        } catch (error) {
            if (error.errno === 1062) {
                data.slug = `${slug}-${i}`;
            } else {
                // Webhook Error saveShop
                console.log(error);
                return null;
            }
        }
        i++;
    } while (true);
}

const getSlugShopName = (shop_name) => {
    return slugify(shop_name, { lower: true, remove: /[*+~.;,()'"!?:@]/g });
};

async function saveArticles(data, id_user, id_shop) {
    let sql = `INSERT INTO articles (id_user, id_shop, name_article, amount_article, description) VALUES`;

    for (let i = 0; i < data.length; i++) {
        let article = data[i];
        sql += ` (${id_user}, ${id_shop}, '${article.articleName}', '${article.amount}', '${article.description}')`;
        sql += data.length - 1 === i ? ";" : ",";
    }

    try {
        const [rows, _] = await promisePool.query(sql);

        return rows.insertId;
    } catch (err) {
        // Webhook Error saveArticles
        console.log("saveArticles - err: ", err);
        return null;
    }
}

async function saveAddress(data, id_shop) {
    const sql = `INSERT INTO address (id_shop, street, postal_code, city, hours, phone_number) VALUES (${id_shop}, '${data.collect.address.street}', '${data.collect.address.postalCode}', '${data.collect.address.city}', '${data.collect.hours}', '${data.collect.phoneNumber}');`;

    try {
        const [rows, _] = await promisePool.query(sql);
        return rows.insertId;
    } catch (err) {
        // Webhook Error saveAddress
        console.log("saveAddress - err: ", err);
        return null;
    }
  
}

export default newShop;
