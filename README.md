
import slugify from 'slugify';

export const getSlugShopName = (shop_name) => {
    return slugify(shop_name, { lower: true, remove: /[*+~.;,()'"!?:@]/g });
}



    async saveShopWithUniqSlug(answers, id_user) {
        const shop = getObjetShop(answers);
        const slugify_name = shop.slugify_name;

        for (let i = 1;;i++) {
            try {
                <!-- enregistrement db  -->
                return await this.saveShop(shop, id_user);
            } catch (err) {
                if (err.errno === 1062) {
                    shop.slugify_name = slugify_name + `-${i}`;
                    continue;
                }
                throw err;
            }
        }
    }

    do { 
      try { 
        console.log("Je rentre dans la for loops l.74"); console.log("Valeur de slug l.75", slug); const [row, _] = await promisePool.query( 
          "INSERT INTO shop (id_user, name_shop, slugify_name, order_type, payment_type) VALUES (?, ?, ?, ?, ?)", [id_user, shop, slug, order, payment]); 
        } catch (err) { 
          if (err.errno === 1062) { 
            slug += -${i}; 
            continue; 
          } 
        throw err; 
        } i++ 
    } while (i <=1);




async function saveUser(connection, data) {
  const sql = "INSERT INTO user SET mail = ?";
  const [rows] = await connection.query(sql, [data.mail]);
  return rows.insertId;
}

async function saveShop(connection, data, id_user) {
  const sql = "INSERT INTO shop SET id_user = ?, name_shop = ?, slugify_name = ?, order_type = ?, payment_type = ?";
  
  return rows.insertId;
}

async function saveArticles(connection, data, id_user, id_shop) {
  const sql = "INSERT INTO article SET id_user = ?, id_shop = ?, name_article = ?, amount_article = ?, description = ?";
  const [rows] = await connection.query(sql, [id_user, id_shop, data.articleName, data.amount, data.description]);
  return rows.insertId;
}

async function saveArticles(connection, data, id_user, id_shop) {
  const sql = "INSERT INTO article (id_user, id_shop, name_article, amount_article, description) VALUES ?";
  const values = data.map((article) => [id_user, id_shop, article.articleName, article.amount, article.description]);
  await connection.query(sql, [values]);
}

async function saveAddress(connection, data, id_shop) {
  const sql = "INSERT INTO address SET id_shop = ?, address = ?, city = ?, zip_code = ?";
  const [rows] = await connection.query(sql, [id_shop, data.address, data.city, data.zip_code]);
  return rows.insertId;
}




