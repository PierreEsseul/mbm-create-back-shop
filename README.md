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

const getUserIdByMail = async (mail, connection) => {
    try {
        const [rows] = await connection.execute(
            `SELECT id FROM users WHERE mail = ?`,
            [mail]
        );
        if (rows.length === 0) {
            return null;
        } else {
            return rows[0].id;
        }
    } catch (error) {
        console.error(error);
    }
};



