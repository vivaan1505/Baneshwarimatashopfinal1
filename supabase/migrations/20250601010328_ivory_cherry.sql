-- Add global brands from different countries
-- This migration adds clothing, footwear, jewelry, and beauty brands from around the world

-- First, create a function to safely insert brands with a unique name to avoid conflicts with existing functions
CREATE OR REPLACE FUNCTION insert_global_brand_v2(
    p_name TEXT,
    p_slug TEXT,
    p_category TEXT,
    p_origin TEXT,
    p_logo_url TEXT DEFAULT NULL,
    p_website TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    brand_id UUID;
BEGIN
    SELECT id INTO brand_id FROM brands WHERE slug = p_slug;
    IF NOT FOUND THEN
        INSERT INTO brands (
            name, 
            slug, 
            category, 
            origin, 
            logo_url, 
            website, 
            description, 
            is_active
        )
        VALUES (
            p_name, 
            p_slug, 
            p_category, 
            p_origin, 
            COALESCE(p_logo_url, 'https://logo.clearbit.com/' || REGEXP_REPLACE(LOWER(p_website), '^https?://(www\.)?', '')), 
            COALESCE(p_website, 'https://' || REGEXP_REPLACE(LOWER(p_slug), '-', '') || '.com'), 
            COALESCE(p_description, p_name || ' - ' || p_origin || ' ' || p_category || ' brand'), 
            true
        )
        RETURNING id INTO brand_id;
    END IF;
    RETURN brand_id;
END;
$$ LANGUAGE plpgsql;

-- CLOTHING BRANDS

-- Indian Clothing Brands
SELECT insert_global_brand_v2('Fabindia', 'fabindia', 'clothing', 'India', NULL, 'https://www.fabindia.com', 'Traditional Indian clothing and textiles');
SELECT insert_global_brand_v2('Manyavar', 'manyavar', 'clothing', 'India', NULL, 'https://www.manyavar.com', 'Indian ethnic wear for men');
SELECT insert_global_brand_v2('Anita Dongre', 'anita-dongre', 'clothing', 'India', NULL, 'https://www.anitadongre.com', 'Luxury Indian designer clothing');
SELECT insert_global_brand_v2('Sabyasachi', 'sabyasachi', 'clothing', 'India', NULL, 'https://www.sabyasachi.com', 'Luxury Indian bridal and traditional wear');
SELECT insert_global_brand_v2('Raymond', 'raymond', 'clothing', 'India', NULL, 'https://www.raymond.in', 'Men''s suiting and formal wear');
SELECT insert_global_brand_v2('Allen Solly', 'allen-solly', 'clothing', 'India', NULL, 'https://www.allensolly.com', 'Casual and formal wear');
SELECT insert_global_brand_v2('W for Woman', 'w-for-woman', 'clothing', 'India', NULL, 'https://www.wforwoman.com', 'Contemporary Indian wear for women');
SELECT insert_global_brand_v2('Biba', 'biba', 'clothing', 'India', NULL, 'https://www.biba.in', 'Indian ethnic wear for women');
SELECT insert_global_brand_v2('Forest Essentials', 'forest-essentials', 'beauty', 'India', NULL, 'https://www.forestessentialsindia.com', 'Luxury Ayurvedic beauty products');

-- Chinese Clothing Brands
SELECT insert_global_brand_v2('Li-Ning', 'li-ning', 'clothing', 'China', NULL, 'https://www.lining.com', 'Sportswear and athletic apparel');
SELECT insert_global_brand_v2('Anta', 'anta', 'clothing', 'China', NULL, 'https://www.anta.com', 'Sports and casual wear');
SELECT insert_global_brand_v2('Bosideng', 'bosideng', 'clothing', 'China', NULL, 'https://www.bosideng.com', 'Down jackets and winter clothing');
SELECT insert_global_brand_v2('Peacebird', 'peacebird', 'clothing', 'China', NULL, 'https://www.peacebird.com', 'Fashion-forward casual wear');
SELECT insert_global_brand_v2('Meters/bonwe', 'meters-bonwe', 'clothing', 'China', NULL, 'https://www.metersbonwe.com', 'Casual clothing for young adults');
SELECT insert_global_brand_v2('Semir', 'semir', 'clothing', 'China', NULL, 'https://www.semir.com', 'Casual clothing for all ages');
SELECT insert_global_brand_v2('Ochirly', 'ochirly', 'clothing', 'China', NULL, 'https://www.ochirly.com', 'Women''s fashion clothing');
SELECT insert_global_brand_v2('Erdos', 'erdos', 'clothing', 'China', NULL, 'https://www.erdos.cn', 'Luxury cashmere clothing');

-- European Clothing Brands
-- UK
SELECT insert_global_brand_v2('Burberry', 'burberry', 'clothing', 'UK', NULL, 'https://www.burberry.com', 'Luxury British fashion house');
SELECT insert_global_brand_v2('Ted Baker', 'ted-baker', 'clothing', 'UK', NULL, 'https://www.tedbaker.com', 'Luxury clothing and accessories');
SELECT insert_global_brand_v2('Marks & Spencer', 'marks-spencer', 'clothing', 'UK', NULL, 'https://www.marksandspencer.com', 'British retailer of clothing and home products');
SELECT insert_global_brand_v2('Superdry', 'superdry', 'clothing', 'UK', NULL, 'https://www.superdry.com', 'Contemporary clothing with Japanese-inspired graphics');
SELECT insert_global_brand_v2('AllSaints', 'allsaints', 'clothing', 'UK', NULL, 'https://www.allsaints.com', 'Fashion retailer with an independent spirit');
SELECT insert_global_brand_v2('Reiss', 'reiss', 'clothing', 'UK', NULL, 'https://www.reiss.com', 'Modern, design-led menswear and womenswear');
SELECT insert_global_brand_v2('Barbour', 'barbour', 'clothing', 'UK', NULL, 'https://www.barbour.com', 'British luxury and lifestyle brand');

-- Italy
SELECT insert_global_brand_v2('Prada', 'prada', 'clothing', 'Italy', NULL, 'https://www.prada.com', 'Italian luxury fashion house');
SELECT insert_global_brand_v2('Gucci', 'gucci', 'clothing', 'Italy', NULL, 'https://www.gucci.com', 'Italian luxury brand of fashion and leather goods');
SELECT insert_global_brand_v2('Armani', 'armani', 'clothing', 'Italy', NULL, 'https://www.armani.com', 'Italian luxury fashion house');
SELECT insert_global_brand_v2('Versace', 'versace', 'clothing', 'Italy', NULL, 'https://www.versace.com', 'Italian luxury fashion company');
SELECT insert_global_brand_v2('Dolce & Gabbana', 'dolce-gabbana', 'clothing', 'Italy', NULL, 'https://www.dolcegabbana.com', 'Italian luxury fashion house');
SELECT insert_global_brand_v2('Fendi', 'fendi', 'clothing', 'Italy', NULL, 'https://www.fendi.com', 'Italian luxury fashion house');
SELECT insert_global_brand_v2('Valentino', 'valentino', 'clothing', 'Italy', NULL, 'https://www.valentino.com', 'Italian luxury fashion house');
SELECT insert_global_brand_v2('Bottega Veneta', 'bottega-veneta', 'clothing', 'Italy', NULL, 'https://www.bottegaveneta.com', 'Italian luxury goods and high fashion brand');

-- France
SELECT insert_global_brand_v2('Louis Vuitton', 'louis-vuitton', 'clothing', 'France', NULL, 'https://www.louisvuitton.com', 'French luxury fashion house and company');
SELECT insert_global_brand_v2('Chanel', 'chanel', 'clothing', 'France', NULL, 'https://www.chanel.com', 'French luxury fashion house');
SELECT insert_global_brand_v2('Dior', 'dior', 'clothing', 'France', NULL, 'https://www.dior.com', 'French luxury goods company');
SELECT insert_global_brand_v2('Hermès', 'hermes', 'clothing', 'France', NULL, 'https://www.hermes.com', 'French luxury goods manufacturer');
SELECT insert_global_brand_v2('Yves Saint Laurent', 'yves-saint-laurent', 'clothing', 'France', NULL, 'https://www.ysl.com', 'French luxury fashion house');
SELECT insert_global_brand_v2('Lacoste', 'lacoste', 'clothing', 'France', NULL, 'https://www.lacoste.com', 'French clothing company');
SELECT insert_global_brand_v2('Givenchy', 'givenchy', 'clothing', 'France', NULL, 'https://www.givenchy.com', 'French luxury fashion and perfume house');
SELECT insert_global_brand_v2('Balmain', 'balmain', 'clothing', 'France', NULL, 'https://www.balmain.com', 'French luxury fashion house');

-- Spain
SELECT insert_global_brand_v2('Zara', 'zara', 'clothing', 'Spain', NULL, 'https://www.zara.com', 'Spanish clothing and accessories retailer');
SELECT insert_global_brand_v2('Mango', 'mango', 'clothing', 'Spain', NULL, 'https://www.mango.com', 'Spanish clothing design and manufacturing company');
SELECT insert_global_brand_v2('Desigual', 'desigual', 'clothing', 'Spain', NULL, 'https://www.desigual.com', 'Spanish casual clothing brand');
SELECT insert_global_brand_v2('Balenciaga', 'balenciaga', 'clothing', 'Spain', NULL, 'https://www.balenciaga.com', 'Spanish luxury fashion house');
SELECT insert_global_brand_v2('Loewe', 'loewe', 'clothing', 'Spain', NULL, 'https://www.loewe.com', 'Spanish luxury fashion house');

-- Germany
SELECT insert_global_brand_v2('Hugo Boss', 'hugo-boss', 'clothing', 'Germany', NULL, 'https://www.hugoboss.com', 'German luxury fashion house');
SELECT insert_global_brand_v2('Adidas', 'adidas', 'clothing', 'Germany', NULL, 'https://www.adidas.com', 'German multinational corporation');
SELECT insert_global_brand_v2('Puma', 'puma', 'clothing', 'Germany', NULL, 'https://www.puma.com', 'German multinational corporation');
SELECT insert_global_brand_v2('Jil Sander', 'jil-sander', 'clothing', 'Germany', NULL, 'https://www.jilsander.com', 'German luxury fashion house');
SELECT insert_global_brand_v2('Escada', 'escada', 'clothing', 'Germany', NULL, 'https://www.escada.com', 'German luxury women''s designer clothing company');

-- Sweden
SELECT insert_global_brand_v2('H&M', 'h-and-m', 'clothing', 'Sweden', NULL, 'https://www.hm.com', 'Swedish multinational clothing-retail company');
SELECT insert_global_brand_v2('Acne Studios', 'acne-studios', 'clothing', 'Sweden', NULL, 'https://www.acnestudios.com', 'Swedish luxury fashion house');
SELECT insert_global_brand_v2('Fjällräven', 'fjallraven', 'clothing', 'Sweden', NULL, 'https://www.fjallraven.com', 'Swedish outdoor clothing and equipment company');
SELECT insert_global_brand_v2('Tiger of Sweden', 'tiger-of-sweden', 'clothing', 'Sweden', NULL, 'https://www.tigerofsweden.com', 'Swedish fashion house');
SELECT insert_global_brand_v2('Filippa K', 'filippa-k', 'clothing', 'Sweden', NULL, 'https://www.filippa-k.com', 'Swedish fashion label');

-- Denmark
SELECT insert_global_brand_v2('Ganni', 'ganni', 'clothing', 'Denmark', NULL, 'https://www.ganni.com', 'Danish contemporary fashion brand');
SELECT insert_global_brand_v2('Samsøe Samsøe', 'samsoe-samsoe', 'clothing', 'Denmark', NULL, 'https://www.samsoe.com', 'Danish fashion brand');
SELECT insert_global_brand_v2('Baum und Pferdgarten', 'baum-und-pferdgarten', 'clothing', 'Denmark', NULL, 'https://www.baumundpferdgarten.com', 'Danish fashion house');
SELECT insert_global_brand_v2('By Malene Birger', 'by-malene-birger', 'clothing', 'Denmark', NULL, 'https://www.bymalenebirger.com', 'Danish fashion brand');

-- American Clothing Brands
SELECT insert_global_brand_v2('Ralph Lauren', 'ralph-lauren', 'clothing', 'USA', NULL, 'https://www.ralphlauren.com', 'American fashion company');
SELECT insert_global_brand_v2('Calvin Klein', 'calvin-klein', 'clothing', 'USA', NULL, 'https://www.calvinklein.com', 'American fashion house');
SELECT insert_global_brand_v2('Tommy Hilfiger', 'tommy-hilfiger', 'clothing', 'USA', NULL, 'https://www.tommy.com', 'American premium clothing company');
SELECT insert_global_brand_v2('Michael Kors', 'michael-kors', 'clothing', 'USA', NULL, 'https://www.michaelkors.com', 'American luxury fashion company');
SELECT insert_global_brand_v2('Marc Jacobs', 'marc-jacobs', 'clothing', 'USA', NULL, 'https://www.marcjacobs.com', 'American fashion designer');
SELECT insert_global_brand_v2('Levi''s', 'levis', 'clothing', 'USA', NULL, 'https://www.levi.com', 'American clothing company known for jeans');
SELECT insert_global_brand_v2('Gap', 'gap', 'clothing', 'USA', NULL, 'https://www.gap.com', 'American clothing and accessories retailer');
SELECT insert_global_brand_v2('Banana Republic', 'banana-republic', 'clothing', 'USA', NULL, 'https://www.bananarepublic.com', 'American clothing and accessories retailer');
SELECT insert_global_brand_v2('J.Crew', 'j-crew', 'clothing', 'USA', NULL, 'https://www.jcrew.com', 'American multi-brand, multi-channel, specialty retailer');
SELECT insert_global_brand_v2('Brooks Brothers', 'brooks-brothers', 'clothing', 'USA', NULL, 'https://www.brooksbrothers.com', 'American clothing retailer');
SELECT insert_global_brand_v2('Abercrombie & Fitch', 'abercrombie-fitch', 'clothing', 'USA', NULL, 'https://www.abercrombie.com', 'American lifestyle retailer');
SELECT insert_global_brand_v2('American Eagle', 'american-eagle', 'clothing', 'USA', NULL, 'https://www.ae.com', 'American clothing and accessories retailer');
SELECT insert_global_brand_v2('Urban Outfitters', 'urban-outfitters', 'clothing', 'USA', NULL, 'https://www.urbanoutfitters.com', 'American multinational lifestyle retail corporation');
SELECT insert_global_brand_v2('Anthropologie', 'anthropologie', 'clothing', 'USA', NULL, 'https://www.anthropologie.com', 'American clothing retailer');
SELECT insert_global_brand_v2('Free People', 'free-people', 'clothing', 'USA', NULL, 'https://www.freepeople.com', 'American bohemian apparel and lifestyle retail company');
SELECT insert_global_brand_v2('Vera Wang', 'vera-wang', 'clothing', 'USA', NULL, 'https://www.verawang.com', 'American fashion designer');
SELECT insert_global_brand_v2('Tom Ford', 'tom-ford', 'clothing', 'USA', NULL, 'https://www.tomford.com', 'American fashion designer and film director');
SELECT insert_global_brand_v2('Tory Burch', 'tory-burch', 'clothing', 'USA', NULL, 'https://www.toryburch.com', 'American fashion designer');
SELECT insert_global_brand_v2('Kate Spade', 'kate-spade', 'clothing', 'USA', NULL, 'https://www.katespade.com', 'American luxury fashion design house');

-- Canadian Clothing Brands
SELECT insert_global_brand_v2('Lululemon', 'lululemon', 'clothing', 'Canada', NULL, 'https://www.lululemon.com', 'Canadian athletic apparel retailer');
SELECT insert_global_brand_v2('Roots', 'roots', 'clothing', 'Canada', NULL, 'https://www.roots.com', 'Canadian clothing and lifestyle brand');
SELECT insert_global_brand_v2('Canada Goose', 'canada-goose', 'clothing', 'Canada', NULL, 'https://www.canadagoose.com', 'Canadian manufacturer of winter clothing');
SELECT insert_global_brand_v2('Aritzia', 'aritzia', 'clothing', 'Canada', NULL, 'https://www.aritzia.com', 'Canadian women''s fashion brand');
SELECT insert_global_brand_v2('Arc''teryx', 'arcteryx', 'clothing', 'Canada', NULL, 'https://www.arcteryx.com', 'Canadian outdoor clothing and sporting goods company');
SELECT insert_global_brand_v2('Mackage', 'mackage', 'clothing', 'Canada', NULL, 'https://www.mackage.com', 'Canadian luxury outerwear brand');
SELECT insert_global_brand_v2('Joe Fresh', 'joe-fresh', 'clothing', 'Canada', NULL, 'https://www.joefresh.com', 'Canadian fashion retailer');
SELECT insert_global_brand_v2('Kit and Ace', 'kit-and-ace', 'clothing', 'Canada', NULL, 'https://www.kitandace.com', 'Canadian technical clothing retailer');

-- FOOTWEAR BRANDS

-- Indian Footwear Brands
SELECT insert_global_brand_v2('Bata', 'bata', 'footwear', 'India', NULL, 'https://www.bata.in', 'Footwear manufacturer and retailer');
SELECT insert_global_brand_v2('Liberty Shoes', 'liberty-shoes', 'footwear', 'India', NULL, 'https://www.libertyshoes.com', 'Indian footwear manufacturer');
SELECT insert_global_brand_v2('Metro Shoes', 'metro-shoes', 'footwear', 'India', NULL, 'https://www.metroshoes.com', 'Indian footwear retailer');
SELECT insert_global_brand_v2('Relaxo', 'relaxo', 'footwear', 'India', NULL, 'https://www.relaxofootwear.com', 'Indian footwear manufacturer');
SELECT insert_global_brand_v2('Paragon', 'paragon', 'footwear', 'India', NULL, 'https://www.paragonshoes.com', 'Indian footwear brand');

-- Chinese Footwear Brands
SELECT insert_global_brand_v2('Li-Ning Footwear', 'li-ning-footwear', 'footwear', 'China', NULL, 'https://www.lining.com', 'Chinese sportswear and athletic footwear company');
SELECT insert_global_brand_v2('Anta Footwear', 'anta-footwear', 'footwear', 'China', NULL, 'https://www.anta.com', 'Chinese sportswear company');
SELECT insert_global_brand_v2('361 Degrees', '361-degrees', 'footwear', 'China', NULL, 'https://www.361sport.com', 'Chinese sportswear company');
SELECT insert_global_brand_v2('Warrior Shoes', 'warrior-shoes', 'footwear', 'China', NULL, 'https://www.warriorshoes.com', 'Chinese footwear brand');
SELECT insert_global_brand_v2('Feiyue', 'feiyue', 'footwear', 'China', NULL, 'https://www.feiyue-shoes.com', 'Chinese canvas shoe brand');

-- European Footwear Brands
-- Italy
SELECT insert_global_brand_v2('Salvatore Ferragamo', 'salvatore-ferragamo', 'footwear', 'Italy', NULL, 'https://www.ferragamo.com', 'Italian luxury goods company');
SELECT insert_global_brand_v2('Gucci Footwear', 'gucci-footwear', 'footwear', 'Italy', NULL, 'https://www.gucci.com', 'Italian luxury brand of fashion and leather goods');
SELECT insert_global_brand_v2('Prada Footwear', 'prada-footwear', 'footwear', 'Italy', NULL, 'https://www.prada.com', 'Italian luxury fashion house');
SELECT insert_global_brand_v2('Tod''s', 'tods', 'footwear', 'Italy', NULL, 'https://www.tods.com', 'Italian company known for shoes and luxury leather goods');
SELECT insert_global_brand_v2('Geox', 'geox', 'footwear', 'Italy', NULL, 'https://www.geox.com', 'Italian brand of shoe and clothing');

-- Spain
SELECT insert_global_brand_v2('Camper', 'camper', 'footwear', 'Spain', NULL, 'https://www.camper.com', 'Spanish footwear company');
SELECT insert_global_brand_v2('Manolo Blahnik', 'manolo-blahnik', 'footwear', 'Spain', NULL, 'https://www.manoloblahnik.com', 'Spanish fashion designer');
SELECT insert_global_brand_v2('Massimo Dutti Footwear', 'massimo-dutti-footwear', 'footwear', 'Spain', NULL, 'https://www.massimodutti.com', 'Spanish clothing company');

-- France
SELECT insert_global_brand_v2('Christian Louboutin', 'christian-louboutin', 'footwear', 'France', NULL, 'https://www.christianlouboutin.com', 'French luxury footwear and accessories designer');
SELECT insert_global_brand_v2('Repetto', 'repetto', 'footwear', 'France', NULL, 'https://www.repetto.com', 'French ballet shoes and luxury footwear company');
SELECT insert_global_brand_v2('Berluti', 'berluti', 'footwear', 'France', NULL, 'https://www.berluti.com', 'Parisian manufacturer of menswear, especially known for its leather shoes');

-- UK
SELECT insert_global_brand_v2('Church''s', 'churchs', 'footwear', 'UK', NULL, 'https://www.church-footwear.com', 'English luxury footwear manufacturer');
SELECT insert_global_brand_v2('Dr. Martens', 'dr-martens', 'footwear', 'UK', NULL, 'https://www.drmartens.com', 'British footwear and clothing brand');
SELECT insert_global_brand_v2('Clarks', 'clarks', 'footwear', 'UK', NULL, 'https://www.clarks.com', 'British international shoe manufacturer');
SELECT insert_global_brand_v2('Jimmy Choo', 'jimmy-choo', 'footwear', 'UK', NULL, 'https://www.jimmychoo.com', 'British high fashion house specializing in luxury shoes');
SELECT insert_global_brand_v2('Kurt Geiger', 'kurt-geiger', 'footwear', 'UK', NULL, 'https://www.kurtgeiger.com', 'British luxury footwear and accessories retailer');

-- American Footwear Brands
SELECT insert_global_brand_v2('Nike Footwear', 'nike-footwear', 'footwear', 'USA', NULL, 'https://www.nike.com', 'American multinational corporation');
SELECT insert_global_brand_v2('Converse', 'converse', 'footwear', 'USA', NULL, 'https://www.converse.com', 'American shoe company');
SELECT insert_global_brand_v2('Vans', 'vans', 'footwear', 'USA', NULL, 'https://www.vans.com', 'American manufacturer of skateboarding shoes');
SELECT insert_global_brand_v2('Timberland', 'timberland', 'footwear', 'USA', NULL, 'https://www.timberland.com', 'American manufacturer and retailer of outdoors wear');
SELECT insert_global_brand_v2('Steve Madden', 'steve-madden', 'footwear', 'USA', NULL, 'https://www.stevemadden.com', 'American fashion designer and businessman');
SELECT insert_global_brand_v2('New Balance', 'new-balance', 'footwear', 'USA', NULL, 'https://www.newbalance.com', 'American sports footwear manufacturer');
SELECT insert_global_brand_v2('Skechers', 'skechers', 'footwear', 'USA', NULL, 'https://www.skechers.com', 'American lifestyle and performance footwear company');
SELECT insert_global_brand_v2('UGG', 'ugg', 'footwear', 'USA', NULL, 'https://www.ugg.com', 'American footwear company');
SELECT insert_global_brand_v2('Tory Burch Shoes', 'tory-burch-shoes', 'footwear', 'USA', NULL, 'https://www.toryburch.com', 'American luxury footwear');
SELECT insert_global_brand_v2('Stuart Weitzman', 'stuart-weitzman', 'footwear', 'USA', NULL, 'https://www.stuartweitzman.com', 'American shoe designer, entrepreneur and founder of the shoe company');

-- Canadian Footwear Brands
SELECT insert_global_brand_v2('Aldo', 'aldo', 'footwear', 'Canada', NULL, 'https://www.aldoshoes.com', 'Canadian designer and retailer of footwear and accessories');
SELECT insert_global_brand_v2('Sorel', 'sorel', 'footwear', 'Canada', NULL, 'https://www.sorel.com', 'Canadian footwear company');
SELECT insert_global_brand_v2('Cougar Shoes', 'cougar-shoes', 'footwear', 'Canada', NULL, 'https://www.cougarshoes.com', 'Canadian footwear company');
SELECT insert_global_brand_v2('John Fluevog', 'john-fluevog', 'footwear', 'Canada', NULL, 'https://www.fluevog.com', 'Canadian shoe designer');
SELECT insert_global_brand_v2('Blundstone Canada', 'blundstone-canada', 'footwear', 'Canada', NULL, 'https://www.blundstone.ca', 'Australian footwear brand popular in Canada');

-- JEWELRY BRANDS

-- Indian Jewelry Brands
SELECT insert_global_brand_v2('Tanishq', 'tanishq', 'jewelry', 'India', NULL, 'https://www.tanishq.co.in', 'Indian jewelry brand');
SELECT insert_global_brand_v2('Kalyan Jewellers', 'kalyan-jewellers', 'jewelry', 'India', NULL, 'https://www.kalyanjewellers.net', 'Indian jewelry retailer');
SELECT insert_global_brand_v2('Malabar Gold & Diamonds', 'malabar-gold', 'jewelry', 'India', NULL, 'https://www.malabargoldanddiamonds.com', 'Indian jewelry retailer');
SELECT insert_global_brand_v2('PC Jeweller', 'pc-jeweller', 'jewelry', 'India', NULL, 'https://www.pcjeweller.com', 'Indian jewelry company');
SELECT insert_global_brand_v2('CaratLane', 'caratlane', 'jewelry', 'India', NULL, 'https://www.caratlane.com', 'Indian online jewelry brand');

-- Chinese Jewelry Brands
SELECT insert_global_brand_v2('Chow Tai Fook', 'chow-tai-fook', 'jewelry', 'China', NULL, 'https://www.chowtaifook.com', 'Chinese jewelry company');
SELECT insert_global_brand_v2('Lao Feng Xiang', 'lao-feng-xiang', 'jewelry', 'China', NULL, 'https://www.laofengxiang.com', 'Chinese jewelry company');
SELECT insert_global_brand_v2('Luk Fook', 'luk-fook', 'jewelry', 'China', NULL, 'https://www.lukfook.com', 'Hong Kong-based jeweler');
SELECT insert_global_brand_v2('Chow Sang Sang', 'chow-sang-sang', 'jewelry', 'China', NULL, 'https://www.chowsangsang.com', 'Hong Kong-based jewelry retailer');

-- European Jewelry Brands
-- Italy
SELECT insert_global_brand_v2('Bulgari', 'bulgari', 'jewelry', 'Italy', NULL, 'https://www.bulgari.com', 'Italian luxury brand known for jewelry, watches, fragrances, and leather goods');
SELECT insert_global_brand_v2('Pomellato', 'pomellato', 'jewelry', 'Italy', NULL, 'https://www.pomellato.com', 'Italian jewelry company');
SELECT insert_global_brand_v2('Damiani', 'damiani', 'jewelry', 'Italy', NULL, 'https://www.damiani.com', 'Italian luxury jewelry company');
SELECT insert_global_brand_v2('Buccellati', 'buccellati', 'jewelry', 'Italy', NULL, 'https://www.buccellati.com', 'Italian jewelry and watch company');

-- France
SELECT insert_global_brand_v2('Cartier', 'cartier', 'jewelry', 'France', NULL, 'https://www.cartier.com', 'French luxury goods conglomerate');
SELECT insert_global_brand_v2('Van Cleef & Arpels', 'van-cleef-arpels', 'jewelry', 'France', NULL, 'https://www.vancleefarpels.com', 'French jewelry, watch, and perfume company');
SELECT insert_global_brand_v2('Boucheron', 'boucheron', 'jewelry', 'France', NULL, 'https://www.boucheron.com', 'French luxury jewelry and watches house');
SELECT insert_global_brand_v2('Chaumet', 'chaumet', 'jewelry', 'France', NULL, 'https://www.chaumet.com', 'French high-end jeweler');
SELECT insert_global_brand_v2('Messika', 'messika', 'jewelry', 'France', NULL, 'https://www.messika.com', 'French luxury jewelry brand');

-- Switzerland
SELECT insert_global_brand_v2('Chopard', 'chopard', 'jewelry', 'Switzerland', NULL, 'https://www.chopard.com', 'Swiss luxury watch and jewelry manufacturer');
SELECT insert_global_brand_v2('Piaget', 'piaget', 'jewelry', 'Switzerland', NULL, 'https://www.piaget.com', 'Swiss luxury watchmaker and jeweler');

-- UK
SELECT insert_global_brand_v2('Graff', 'graff', 'jewelry', 'UK', NULL, 'https://www.graff.com', 'British multinational jeweler');
SELECT insert_global_brand_v2('Boodles', 'boodles', 'jewelry', 'UK', NULL, 'https://www.boodles.com', 'British fine jewelry company');
SELECT insert_global_brand_v2('Asprey', 'asprey', 'jewelry', 'UK', NULL, 'https://www.asprey.com', 'British luxury goods house');
SELECT insert_global_brand_v2('Links of London', 'links-of-london', 'jewelry', 'UK', NULL, 'https://www.linksoflondon.com', 'British luxury jewelry retailer');

-- Denmark
SELECT insert_global_brand_v2('Pandora', 'pandora', 'jewelry', 'Denmark', NULL, 'https://www.pandora.net', 'Danish jewelry manufacturer and retailer');
SELECT insert_global_brand_v2('Georg Jensen', 'georg-jensen', 'jewelry', 'Denmark', NULL, 'https://www.georgjensen.com', 'Danish design company');

-- American Jewelry Brands
SELECT insert_global_brand_v2('Tiffany & Co.', 'tiffany-co', 'jewelry', 'USA', NULL, 'https://www.tiffany.com', 'American luxury jewelry and specialty retailer');
SELECT insert_global_brand_v2('Harry Winston', 'harry-winston', 'jewelry', 'USA', NULL, 'https://www.harrywinston.com', 'American luxury jeweler and producer of watches');
SELECT insert_global_brand_v2('David Yurman', 'david-yurman', 'jewelry', 'USA', NULL, 'https://www.davidyurman.com', 'American luxury jewelry company');
SELECT insert_global_brand_v2('Kendra Scott', 'kendra-scott', 'jewelry', 'USA', NULL, 'https://www.kendrascott.com', 'American fashion accessories brand');
SELECT insert_global_brand_v2('Alex and Ani', 'alex-and-ani', 'jewelry', 'USA', NULL, 'https://www.alexandani.com', 'American jewelry and accessories brand');
SELECT insert_global_brand_v2('Blue Nile', 'blue-nile', 'jewelry', 'USA', NULL, 'https://www.bluenile.com', 'American online jewelry retailer');
SELECT insert_global_brand_v2('James Allen', 'james-allen', 'jewelry', 'USA', NULL, 'https://www.jamesallen.com', 'American online diamond and bridal jewelry retailer');
SELECT insert_global_brand_v2('Mejuri', 'mejuri', 'jewelry', 'Canada/USA', NULL, 'https://www.mejuri.com', 'Fine jewelry brand');

-- Canadian Jewelry Brands
SELECT insert_global_brand_v2('Birks', 'birks', 'jewelry', 'Canada', NULL, 'https://www.maisonbirks.com', 'Canadian luxury jewelry retailer');
SELECT insert_global_brand_v2('Hillberg & Berk', 'hillberg-berk', 'jewelry', 'Canada', NULL, 'https://www.hillbergandberk.com', 'Canadian jewelry brand');
SELECT insert_global_brand_v2('Dean Davidson', 'dean-davidson', 'jewelry', 'Canada', NULL, 'https://www.deandavidson.ca', 'Canadian jewelry designer');
SELECT insert_global_brand_v2('Pyrrha', 'pyrrha', 'jewelry', 'Canada', NULL, 'https://www.pyrrha.com', 'Canadian jewelry brand');
SELECT insert_global_brand_v2('Jenny Bird', 'jenny-bird', 'jewelry', 'Canada', NULL, 'https://www.jenny-bird.com', 'Canadian jewelry designer');

-- BEAUTY BRANDS

-- Indian Beauty Brands
SELECT insert_global_brand_v2('Forest Essentials Beauty', 'forest-essentials-beauty', 'beauty', 'India', NULL, 'https://www.forestessentialsindia.com', 'Indian luxury Ayurvedic beauty brand');
SELECT insert_global_brand_v2('Kama Ayurveda', 'kama-ayurveda', 'beauty', 'India', NULL, 'https://www.kamaayurveda.com', 'Indian luxury Ayurvedic beauty brand');
SELECT insert_global_brand_v2('Biotique', 'biotique', 'beauty', 'India', NULL, 'https://www.biotique.com', 'Indian beauty brand');
SELECT insert_global_brand_v2('Lakme', 'lakme', 'beauty', 'India', NULL, 'https://www.lakmeindia.com', 'Indian cosmetics brand');
SELECT insert_global_brand_v2('Himalaya Herbals', 'himalaya-herbals', 'beauty', 'India', NULL, 'https://www.himalayawellness.com', 'Indian herbal and personal care company');

-- Chinese Beauty Brands
SELECT insert_global_brand_v2('Herborist', 'herborist', 'beauty', 'China', NULL, 'https://www.herborist-international.com', 'Chinese skincare brand');
SELECT insert_global_brand_v2('Pechoin', 'pechoin', 'beauty', 'China', NULL, 'https://www.pechoin.com', 'Chinese skincare brand');
SELECT insert_global_brand_v2('Shanghai VIVE', 'shanghai-vive', 'beauty', 'China', NULL, 'https://www.shanghaivive.com', 'Chinese luxury beauty brand');
SELECT insert_global_brand_v2('Chando', 'chando', 'beauty', 'China', NULL, 'https://www.chando.com.cn', 'Chinese skincare brand');
SELECT insert_global_brand_v2('One Leaf', 'one-leaf', 'beauty', 'China', NULL, 'https://www.oneleaf.com.cn', 'Chinese skincare brand');

-- European Beauty Brands
-- France
SELECT insert_global_brand_v2('L''Oréal', 'loreal', 'beauty', 'France', NULL, 'https://www.loreal.com', 'French personal care company');
SELECT insert_global_brand_v2('Lancôme', 'lancome', 'beauty', 'France', NULL, 'https://www.lancome.com', 'French luxury perfumes and cosmetics house');
SELECT insert_global_brand_v2('Chanel Beauty', 'chanel-beauty', 'beauty', 'France', NULL, 'https://www.chanel.com/beauty', 'French luxury beauty brand');
SELECT insert_global_brand_v2('Dior Beauty', 'dior-beauty', 'beauty', 'France', NULL, 'https://www.dior.com/beauty', 'French luxury beauty brand');
SELECT insert_global_brand_v2('Guerlain', 'guerlain', 'beauty', 'France', NULL, 'https://www.guerlain.com', 'French perfume, cosmetics and skincare house');
SELECT insert_global_brand_v2('Clarins', 'clarins', 'beauty', 'France', NULL, 'https://www.clarins.com', 'French luxury skincare, cosmetics and perfume company');
SELECT insert_global_brand_v2('Sisley', 'sisley', 'beauty', 'France', NULL, 'https://www.sisley-paris.com', 'French luxury beauty brand');
SELECT insert_global_brand_v2('Yves Saint Laurent Beauty', 'ysl-beauty', 'beauty', 'France', NULL, 'https://www.yslbeauty.com', 'French luxury beauty brand');
SELECT insert_global_brand_v2('Caudalie', 'caudalie', 'beauty', 'France', NULL, 'https://www.caudalie.com', 'French skincare company');
SELECT insert_global_brand_v2('La Roche-Posay', 'la-roche-posay', 'beauty', 'France', NULL, 'https://www.laroche-posay.com', 'French dermatological skincare brand');

-- UK
SELECT insert_global_brand_v2('Charlotte Tilbury', 'charlotte-tilbury', 'beauty', 'UK', NULL, 'https://www.charlottetilbury.com', 'British makeup artist and founder of her eponymous brand');
SELECT insert_global_brand_v2('The Body Shop', 'the-body-shop', 'beauty', 'UK', NULL, 'https://www.thebodyshop.com', 'British cosmetics, skin care and perfume company');
SELECT insert_global_brand_v2('Lush', 'lush', 'beauty', 'UK', NULL, 'https://www.lush.com', 'British cosmetics retailer');
SELECT insert_global_brand_v2('Rimmel London', 'rimmel-london', 'beauty', 'UK', NULL, 'https://www.rimmellondon.com', 'British cosmetics brand');
SELECT insert_global_brand_v2('Jo Malone London', 'jo-malone', 'beauty', 'UK', NULL, 'https://www.jomalone.com', 'British perfume and scented candle brand');
SELECT insert_global_brand_v2('Molton Brown', 'molton-brown', 'beauty', 'UK', NULL, 'https://www.moltonbrown.com', 'British luxury fragrance and lifestyle brand');

-- Italy
SELECT insert_global_brand_v2('Acqua di Parma', 'acqua-di-parma', 'beauty', 'Italy', NULL, 'https://www.acquadiparma.com', 'Italian lifestyle and fragrance brand');
SELECT insert_global_brand_v2('Kiko Milano', 'kiko-milano', 'beauty', 'Italy', NULL, 'https://www.kikocosmetics.com', 'Italian professional cosmetics brand');

-- Germany
SELECT insert_global_brand_v2('Dr. Hauschka', 'dr-hauschka', 'beauty', 'Germany', NULL, 'https://www.drhauschka.com', 'German natural cosmetics company');
SELECT insert_global_brand_v2('Nivea', 'nivea', 'beauty', 'Germany', NULL, 'https://www.nivea.com', 'German personal care brand');

-- American Beauty Brands
SELECT insert_global_brand_v2('Estée Lauder', 'estee-lauder', 'beauty', 'USA', NULL, 'https://www.esteelauder.com', 'American multinational manufacturer and marketer of prestige skincare, makeup, fragrance and hair care products');
SELECT insert_global_brand_v2('MAC Cosmetics', 'mac-cosmetics', 'beauty', 'USA', NULL, 'https://www.maccosmetics.com', 'American cosmetics manufacturer');
SELECT insert_global_brand_v2('Clinique', 'clinique', 'beauty', 'USA', NULL, 'https://www.clinique.com', 'American manufacturer of skincare, cosmetics, toiletries and fragrances');
SELECT insert_global_brand_v2('Maybelline', 'maybelline', 'beauty', 'USA', NULL, 'https://www.maybelline.com', 'American makeup brand');
SELECT insert_global_brand_v2('Revlon', 'revlon', 'beauty', 'USA', NULL, 'https://www.revlon.com', 'American multinational cosmetics, skin care, fragrance, and personal care company');
SELECT insert_global_brand_v2('Bobbi Brown', 'bobbi-brown', 'beauty', 'USA', NULL, 'https://www.bobbibrowncosmetics.com', 'American professional cosmetics brand');
SELECT insert_global_brand_v2('Urban Decay', 'urban-decay', 'beauty', 'USA', NULL, 'https://www.urbandecay.com', 'American cosmetics brand');
SELECT insert_global_brand_v2('Glossier', 'glossier', 'beauty', 'USA', NULL, 'https://www.glossier.com', 'American cosmetics brand');
SELECT insert_global_brand_v2('Fenty Beauty', 'fenty-beauty', 'beauty', 'USA', NULL, 'https://www.fentybeauty.com', 'Cosmetics brand created by Rihanna');
SELECT insert_global_brand_v2('Kylie Cosmetics', 'kylie-cosmetics', 'beauty', 'USA', NULL, 'https://www.kyliecosmetics.com', 'American cosmetics company');
SELECT insert_global_brand_v2('Tarte Cosmetics', 'tarte-cosmetics', 'beauty', 'USA', NULL, 'https://www.tartecosmetics.com', 'American cosmetics company');
SELECT insert_global_brand_v2('Too Faced', 'too-faced', 'beauty', 'USA', NULL, 'https://www.toofaced.com', 'American cosmetics company');
SELECT insert_global_brand_v2('Anastasia Beverly Hills', 'anastasia-beverly-hills', 'beauty', 'USA', NULL, 'https://www.anastasiabeverlyhills.com', 'American cosmetics company');
SELECT insert_global_brand_v2('Morphe', 'morphe', 'beauty', 'USA', NULL, 'https://www.morphe.com', 'American cosmetics company');
SELECT insert_global_brand_v2('Milk Makeup', 'milk-makeup', 'beauty', 'USA', NULL, 'https://www.milkmakeup.com', 'American cosmetics company');
SELECT insert_global_brand_v2('Drunk Elephant', 'drunk-elephant', 'beauty', 'USA', NULL, 'https://www.drunkelephant.com', 'American skincare company');
SELECT insert_global_brand_v2('The Ordinary', 'the-ordinary', 'beauty', 'Canada/USA', NULL, 'https://www.theordinary.com', 'Skincare brand');

-- Canadian Beauty Brands
SELECT insert_global_brand_v2('Bite Beauty', 'bite-beauty', 'beauty', 'Canada', NULL, 'https://www.bitebeauty.com', 'Canadian cosmetics company');
SELECT insert_global_brand_v2('Deciem', 'deciem', 'beauty', 'Canada', NULL, 'https://www.deciem.com', 'Canadian multi-brand beauty company');
SELECT insert_global_brand_v2('MAC Cosmetics Canada', 'mac-cosmetics-canada', 'beauty', 'Canada', NULL, 'https://www.maccosmetics.ca', 'Canadian cosmetics company');
SELECT insert_global_brand_v2('Lise Watier', 'lise-watier', 'beauty', 'Canada', NULL, 'https://www.lisewatier.com', 'Canadian cosmetics company');
SELECT insert_global_brand_v2('Marcelle', 'marcelle', 'beauty', 'Canada', NULL, 'https://www.marcelle.com', 'Canadian cosmetics company');

-- MULTI-CATEGORY BRANDS (brands that operate in multiple categories)

-- Add multi-category brands (these will appear in multiple categories)
-- For each multi-category brand, add entries for each category they operate in

-- Louis Vuitton (Clothing, Footwear, Accessories)
SELECT insert_global_brand_v2('Louis Vuitton Footwear', 'louis-vuitton-footwear', 'footwear', 'France', NULL, 'https://www.louisvuitton.com', 'French luxury fashion house - footwear collection');
SELECT insert_global_brand_v2('Louis Vuitton Accessories', 'louis-vuitton-accessories', 'accessories', 'France', NULL, 'https://www.louisvuitton.com', 'French luxury fashion house - accessories collection');

-- Gucci (Clothing, Footwear, Accessories, Beauty)
SELECT insert_global_brand_v2('Gucci Beauty', 'gucci-beauty', 'beauty', 'Italy', NULL, 'https://www.gucci.com/beauty', 'Italian luxury brand - beauty collection');
SELECT insert_global_brand_v2('Gucci Accessories', 'gucci-accessories', 'accessories', 'Italy', NULL, 'https://www.gucci.com', 'Italian luxury brand - accessories collection');

-- Chanel (Clothing, Jewelry, Beauty)
SELECT insert_global_brand_v2('Chanel Jewelry', 'chanel-jewelry', 'jewelry', 'France', NULL, 'https://www.chanel.com/jewelry', 'French luxury fashion house - jewelry collection');

-- Dior (Clothing, Footwear, Jewelry, Beauty)
SELECT insert_global_brand_v2('Dior Footwear', 'dior-footwear', 'footwear', 'France', NULL, 'https://www.dior.com', 'French luxury goods company - footwear collection');
SELECT insert_global_brand_v2('Dior Jewelry', 'dior-jewelry', 'jewelry', 'France', NULL, 'https://www.dior.com', 'French luxury goods company - jewelry collection');

-- Hermès (Clothing, Footwear, Accessories, Beauty)
SELECT insert_global_brand_v2('Hermès Footwear', 'hermes-footwear', 'footwear', 'France', NULL, 'https://www.hermes.com', 'French luxury goods manufacturer - footwear collection');
SELECT insert_global_brand_v2('Hermès Beauty', 'hermes-beauty', 'beauty', 'France', NULL, 'https://www.hermes.com', 'French luxury goods manufacturer - beauty collection');

-- Prada (Clothing, Footwear, Accessories)
SELECT insert_global_brand_v2('Prada Accessories', 'prada-accessories', 'accessories', 'Italy', NULL, 'https://www.prada.com', 'Italian luxury fashion house - accessories collection');

-- Burberry (Clothing, Footwear, Beauty)
SELECT insert_global_brand_v2('Burberry Footwear', 'burberry-footwear', 'footwear', 'UK', NULL, 'https://www.burberry.com', 'British luxury fashion house - footwear collection');
SELECT insert_global_brand_v2('Burberry Beauty', 'burberry-beauty', 'beauty', 'UK', NULL, 'https://www.burberry.com', 'British luxury fashion house - beauty collection');

-- Ralph Lauren (Clothing, Footwear, Accessories, Beauty)
SELECT insert_global_brand_v2('Ralph Lauren Footwear', 'ralph-lauren-footwear', 'footwear', 'USA', NULL, 'https://www.ralphlauren.com', 'American fashion company - footwear collection');
SELECT insert_global_brand_v2('Ralph Lauren Beauty', 'ralph-lauren-beauty', 'beauty', 'USA', NULL, 'https://www.ralphlauren.com', 'American fashion company - beauty collection');

-- Calvin Klein (Clothing, Footwear, Beauty)
SELECT insert_global_brand_v2('Calvin Klein Footwear', 'calvin-klein-footwear', 'footwear', 'USA', NULL, 'https://www.calvinklein.com', 'American fashion house - footwear collection');
SELECT insert_global_brand_v2('Calvin Klein Beauty', 'calvin-klein-beauty', 'beauty', 'USA', NULL, 'https://www.calvinklein.com', 'American fashion house - beauty collection');

-- Tommy Hilfiger (Clothing, Footwear, Accessories)
SELECT insert_global_brand_v2('Tommy Hilfiger Footwear', 'tommy-hilfiger-footwear', 'footwear', 'USA', NULL, 'https://www.tommy.com', 'American premium clothing company - footwear collection');

-- Michael Kors (Clothing, Footwear, Accessories)
SELECT insert_global_brand_v2('Michael Kors Footwear', 'michael-kors-footwear', 'footwear', 'USA', NULL, 'https://www.michaelkors.com', 'American luxury fashion company - footwear collection');

-- Adidas (Clothing, Footwear)
SELECT insert_global_brand_v2('Adidas Footwear', 'adidas-footwear', 'footwear', 'Germany', NULL, 'https://www.adidas.com', 'German multinational corporation - footwear collection');

-- Puma (Clothing, Footwear)
SELECT insert_global_brand_v2('Puma Footwear', 'puma-footwear', 'footwear', 'Germany', NULL, 'https://www.puma.com', 'German multinational corporation - footwear collection');

-- Nike (Clothing, Footwear)
SELECT insert_global_brand_v2('Nike Clothing', 'nike-clothing', 'clothing', 'USA', NULL, 'https://www.nike.com', 'American multinational corporation - clothing collection');

-- Drop the helper function
DROP FUNCTION IF EXISTS insert_global_brand_v2;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';