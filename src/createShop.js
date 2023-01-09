import mysql from 'mysql2';

// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     port: '8889',
//     user: 'root',
//     password: 'root',
//     database: 'madebyme'
// });

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: '8889',
  user: 'root',
  password: 'root',
  database: 'madebyme'
});
const promisePool = pool.promise();

async function newShop(dataShop) {
  const id_user = await saveUser(dataShop);
  if (!id_user) {
    return null; //retourner une erreur pour la renvoyer au front
  }
  const id_shop = await saveShop(dataShop, id_user);
  if (!id_shop) {
    return null;
  }
  const articles = await saveArticles(dataShop.articles, id_user, id_shop);
  const address = await saveAddress(dataShop, id_shop)

  return { id_user };

};

async function saveUser(data) {
  const sql = `INSERT INTO user (mail) VALUES ('${data.mail}');`

  try {
    const [rows, _] = await promisePool.query(sql);
    
    return rows.insertId;
  } catch (err) {
    console.log('saveUser - err: ', err);
    return null;
  }
}

// recover: [ 'delivery', 'collect' ]
//TODO: Penser a modifier dans le front le pickup par le mot collect;
// payment: [ 'card', 'cash' ],
//TODO: Penser a modifier dans le front le card par le mot cb;

  async function saveShop(data, id_user) {
   
    let order = (data.recover.length === 2) ? 'both' : data.recover[0];
    let payment = (data.payment.length === 2) ? 'both' : data.payment[0];

    const sql =`INSERT INTO shop (id_user, name_shop, slugify_name, order_type, payment_type) VALUES (${id_user}, '${data.shopName}', '${data.slugify || "nimportequoi2"}', '${order}', '${payment}');`;
    
    try {
      const [rows, _] = await promisePool.query(sql);
      console.log('rows: ', rows);
      return rows.insertId;
    } catch (err) {
      console.log('saveShop - err: ', err);
      return null;
    }
  }

  async function saveArticles(data, id_user, id_shop) {
    try {
        for (let i = 0; i < data.length; i++) {
        let article = data[i];
        let sql = `INSERT INTO article (id_user, id_shop, name_article, amount_article, description) VALUES (${id_user}, ${id_shop}, '${article.articleName}', '${article.amount}', '${article.description}');`;    
        const [rows, _] = await promisePool.query(sql);
        console.log('rows: ', rows);
        return rows.insertId;
        }
    } catch (err) {
    console.log('saveShop - err: ', err);
    return null;
    }
  }

  async function saveAddress(data, id_shop) {

    const sql = `INSERT INTO address (id_shop, street, postal_code, city, hours, phone_number) VALUES (${id_shop}, '${data.collect.address.street}', '${data.collect.address.postalCode}', '${data.collect.address.city}', '${data.collect.hours}', '${data.collect.phoneNumber}');`;
    
    try {
      const [rows, _] = await promisePool.query(sql);
      console.log('rows: ', rows);
      return rows.insertId;
    } catch (err) {
      console.log('save - err: ', err);
      return null;
    }
  }

export default newShop;