import mysql from "mysql2";
import slugify from "slugify";

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: "8889",
  user: "root",
  password: "root",
  database: "madebyme",
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
  const articles = await saveArticles(data.articles, id_user, id_shop);
  const address = await saveAddress(data, id_shop);

  return { id_user, id_shop, articles, address };
}

async function saveUser(data) {
  const sql = `INSERT INTO user (mail) VALUES ('${data.mail}');`;

  try {
    const [rows, _] = await promisePool.query(sql);

    return rows.insertId;
  } catch (err) {
    console.log("saveUser - err: ", err);
    return null;
  }
}

// recover: [ 'delivery', 'collect' ]
//TODO: Penser a modifier dans le front le pickup par le mot collect;
// payment: [ 'card', 'cash' ],
//TODO: Penser a modifier dans le front le card par le mot cb;

async function saveShop(data, id_user) {
  console.log("Valeur de data.recover l.47 : ", data.recover);
  console.log("Valeur de data.recover.length l.48 : ", data.recover.length);
  let order = data.recover.length === 2 ? "both" : data.recover[0];
  console.log("Valeur const order l.50 : ", order);
  let payment = data.payment.length === 2 ? "both" : data.payment[0];
  let slug = saveShopWithUniqSlug(data, id_user, order, payment);

  // const sql = `INSERT INTO shop (id_user, name_shop, slugify_name, order_type, payment_type) VALUES (${id_user}, '${
  //   data.shopName}', '${slugify || "neFonctionnePas_" + Math.floor(Math.random()*40) }', '${order}', '${payment}');`;

  // try {
  //   const [rows, _] = await promisePool.query(sql);
  //   console.log("rows : ", rows);
  //   return rows.insertId;
  // } catch (err) {
  //   console.log("saveShop - err: ", err);
  //   return null;
  // }
}

async function saveShopWithUniqSlug(data, id_user, order, payment) {
  const shop = data.shopName;
  console.log("valeur de shop l.69", shop);
  let slug = getSlugShopName(shop);

  let loop = null;

  do { 
    loop = false;
    let i = 1;
    console.log("Valeur de SLUG l.77 : ", slug);
    try { 
      console.log("Valeur de slug l.75", slug); 
      const [row, _] = await promisePool.query( 
        "INSERT INTO shop (id_user, name_shop, slugify_name, order_type, payment_type) VALUES (?, ?, ?, ?, ?)", [id_user, shop, slug, order, payment]); 
      } catch (err) { 
        if (err.errno === 1062) { 
          slug += `-${i}`;
          loop = true;
        } else {
          throw err;
        }
        console.log("Valeur de SLUG l.87 : ", slug);
      } i++ 
  } while (loop);
}

const getSlugShopName = (shop_name) => {
  return slugify(shop_name, { lower: true, remove: /[*+~.;,()'"!?:@]/g });
}

async function saveArticles(data, id_user, id_shop) {
  let sql = `INSERT INTO article (id_user, id_shop, name_article, amount_article, description) VALUES`;

  for (let i = 0; i < data.length; i++) {
    let article = data[i];
    sql += ` (${id_user}, ${id_shop}, '${article.articleName}', '${article.amount}', '${article.description}')`;
    sql += (data.length - 1 === i) ? ';' : ',';
  }

  try {
    const [rows, _] = await promisePool.query(sql);

    return rows.insertId;
  } catch (err) {
    console.log("saveShop - err: ", err);
    return null;
  }
}

async function saveAddress(data, id_shop) {
  if (data.recover.includes('collect')){
    const sql = `INSERT INTO address (id_shop, street, postal_code, city, hours, phone_number) VALUES (${id_shop}, '${data.collect.address.street}', '${data.collect.address.postalCode}', '${data.collect.address.city}', '${data.collect.hours}', '${data.collect.phoneNumber}');`;

    try {
      const [rows, _] = await promisePool.query(sql);
      console.log("rows: ", rows);
      return rows.insertId;
    } catch (err) {
      console.log("save - err: ", err);
      return null;
    }
  } else {
    return null;
  }
}

export default newShop;
