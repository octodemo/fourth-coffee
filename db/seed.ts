import { db, Product, Review } from 'astro:db';

export default async function seed() {
  await db.insert(Product).values([
    { id: 1, name: 'Ethiopian Yirgacheffe', slug: 'ethiopian-yirgacheffe', description: 'Bright and fruity with wine-like acidity.', price: 18.99, roast: 'Light', origin: 'Ethiopia', notes: 'Blueberry, citrus, floral' },
    { id: 2, name: 'Colombian Supremo', slug: 'colombian-supremo', description: 'Perfectly balanced with nutty sweetness.', price: 16.99, roast: 'Medium', origin: 'Colombia', notes: 'Caramel, walnut, mild citrus' },
    { id: 3, name: 'Sumatra Mandheling', slug: 'sumatra-mandheling', description: 'Full-bodied and earthy.', price: 17.99, roast: 'Dark', origin: 'Indonesia', notes: 'Earthy, herbal, dark chocolate' },
    { id: 4, name: 'Sunrise Blend', slug: 'sunrise-blend', description: 'Our signature morning blend.', price: 15.99, roast: 'Medium', origin: 'Blend', notes: 'Caramel, orange, chocolate' },
    { id: 5, name: 'Guatemala Antigua', slug: 'guatemala-antigua', description: 'Complex and spicy with a velvety body.', price: 17.49, roast: 'Medium', origin: 'Guatemala', notes: 'Cocoa, spice, brown sugar' },
    { id: 6, name: 'Kenya AA', slug: 'kenya-aa', description: 'Bold and bright with a grapefruit kick.', price: 19.99, roast: 'Light', origin: 'Kenya', notes: 'Grapefruit, blackcurrant, sugar cane' },
    { id: 7, name: 'Costa Rica Tarrazú', slug: 'costa-rica-tarrazu', description: 'Clean and sweet with a honey finish.', price: 18.49, roast: 'Medium', origin: 'Costa Rica', notes: 'Honey, almond, citrus' },
    { id: 8, name: 'Brazil Santos', slug: 'brazil-santos', description: 'Smooth and low-acid with chocolate notes.', price: 14.99, roast: 'Medium', origin: 'Brazil', notes: 'Chocolate, peanut, mild fruit' },
    { id: 9, name: 'Espresso Roast', slug: 'espresso-roast', description: 'Rich and bold, built for espresso.', price: 16.49, roast: 'Dark', origin: 'Blend', notes: 'Dark chocolate, toasted walnut, caramel' },
    { id: 10, name: 'Decaf House Blend', slug: 'decaf-house-blend', description: 'All the flavor, none of the buzz.', price: 15.49, roast: 'Medium', origin: 'Blend', notes: 'Milk chocolate, hazelnut, soft berry' },
    { id: 11, name: 'Papua New Guinea', slug: 'papua-new-guinea', description: 'Exotic and complex with tropical notes.', price: 19.49, roast: 'Medium', origin: 'Papua New Guinea', notes: 'Mango, brown sugar, butter' },
    { id: 12, name: 'Rwanda Kivu', slug: 'rwanda-kivu', description: 'Sweet and delicate with floral aroma.', price: 18.99, roast: 'Light', origin: 'Rwanda', notes: 'Red grape, jasmine, caramel' },
    { id: 13, name: 'Mexican Chiapas', slug: 'mexican-chiapas', description: 'Bright and nutty with a clean finish.', price: 15.99, roast: 'Medium', origin: 'Mexico', notes: 'Almond, green apple, toffee' },
    { id: 14, name: 'French Roast', slug: 'french-roast', description: 'Smoky and intense for dark roast lovers.', price: 16.99, roast: 'Dark', origin: 'Blend', notes: 'Smoke, dark cocoa, roasted marshmallow' },
    { id: 15, name: 'Honduran Marcala', slug: 'honduran-marcala', description: 'Silky body with tropical sweetness.', price: 16.49, roast: 'Medium', origin: 'Honduras', notes: 'Peach, vanilla, milk chocolate' },
    { id: 16, name: 'Tanzanian Peaberry', slug: 'tanzanian-peaberry', description: 'Vibrant and juicy with a wine-like finish.', price: 20.99, roast: 'Light', origin: 'Tanzania', notes: 'Blackberry, lemon zest, brown sugar' },
    { id: 17, name: 'Italian Roast', slug: 'italian-roast', description: 'Deep and bold with a bittersweet edge.', price: 17.49, roast: 'Dark', origin: 'Blend', notes: 'Charred oak, espresso, anise' },
    { id: 18, name: 'Peru Cajamarca', slug: 'peru-cajamarca', description: 'Balanced and mild with nutty undertones.', price: 16.99, roast: 'Medium', origin: 'Peru', notes: 'Cashew, milk chocolate, dried fig' },
    { id: 19, name: 'Midnight Blend', slug: 'midnight-blend', description: 'Our darkest roast for the bold at heart.', price: 17.99, roast: 'Dark', origin: 'Blend', notes: 'Molasses, black cherry, smoky cedar' },
    { id: 20, name: 'Hawaiian Kona', slug: 'hawaiian-kona', description: 'Rare and luxurious with buttery sweetness.', price: 34.99, roast: 'Medium', origin: 'Hawaii', notes: 'Butter, macadamia, brown sugar' },
    { id: 21, name: 'Jamaican Blue Mountain', slug: 'jamaican-blue-mountain', description: 'Exceptionally smooth with zero bitterness.', price: 39.99, roast: 'Medium', origin: 'Jamaica', notes: 'Floral, sweet herb, creamy chocolate' },
    { id: 22, name: 'Vietnamese Robusta', slug: 'vietnamese-robusta', description: 'Strong and punchy, perfect for iced coffee.', price: 13.99, roast: 'Dark', origin: 'Vietnam', notes: 'Dark chocolate, whiskey, burnt caramel' },
    { id: 23, name: 'Burundi Kayanza', slug: 'burundi-kayanza', description: 'Delicate acidity with a silky mouthfeel.', price: 19.49, roast: 'Light', origin: 'Burundi', notes: 'Lemon, black tea, raw honey' },
    { id: 24, name: 'Indian Monsooned Malabar', slug: 'indian-monsooned-malabar', description: 'Uniquely mellow from monsoon processing.', price: 18.49, roast: 'Medium', origin: 'India', notes: 'Tobacco, clove, bittersweet chocolate' },
    { id: 25, name: 'Mocha Java Blend', slug: 'mocha-java-blend', description: 'The original coffee blend, rich and complex.', price: 17.99, roast: 'Medium', origin: 'Blend', notes: 'Wine, chocolate, spice' },
    { id: 26, name: 'Nicaragua Jinotega', slug: 'nicaragua-jinotega', description: 'Creamy and sweet with a citrus lift.', price: 16.49, roast: 'Medium', origin: 'Nicaragua', notes: 'Orange cream, toffee, walnut' },
    { id: 27, name: 'Congo Kivu', slug: 'congo-kivu', description: 'Bold and earthy with a wild character.', price: 18.99, roast: 'Dark', origin: 'Congo', notes: 'Dark plum, cedar, roasted peanut' },
    { id: 28, name: 'Breakfast Blend', slug: 'breakfast-blend', description: 'Light and approachable, an everyday favorite.', price: 14.49, roast: 'Light', origin: 'Blend', notes: 'Citrus, toast, mild berry' },
    { id: 29, name: 'Yunnan China', slug: 'yunnan-china', description: 'Surprisingly sweet with a tea-like quality.', price: 17.99, roast: 'Light', origin: 'China', notes: 'Rose, dark chocolate, plum' },
    { id: 30, name: 'El Salvador Pacamara', slug: 'el-salvador-pacamara', description: 'Juicy and complex, a specialty standout.', price: 21.99, roast: 'Light', origin: 'El Salvador', notes: 'Tropical fruit, jasmine, honeycomb' },
  ]);

  await db.insert(Review).values([
    { id: 1, productSlug: 'brazil-santos', author: 'Maria S.', rating: 5, comment: 'So smooth and easy to drink. Perfect everyday coffee.' },
    { id: 2, productSlug: 'brazil-santos', author: 'James K.', rating: 4, comment: 'Low acidity and great chocolate notes. Love it.' },
    { id: 3, productSlug: 'breakfast-blend', author: 'Sarah L.', rating: 5, comment: 'Light and approachable. My go-to morning cup.' },
    { id: 4, productSlug: 'breakfast-blend', author: 'Tom R.', rating: 4, comment: 'Great citrus notes. Works perfectly iced too.' },
    { id: 5, productSlug: 'burundi-kayanza', author: 'Alex P.', rating: 5, comment: 'Delicate and complex. The honey sweetness is lovely.' },
    { id: 6, productSlug: 'burundi-kayanza', author: 'Rachel M.', rating: 4, comment: 'Beautiful lemon and black tea flavors. So unique.' },
    { id: 7, productSlug: 'colombian-supremo', author: 'Chris D.', rating: 4, comment: 'Perfectly balanced. Great for everyday drinking.' },
    { id: 8, productSlug: 'colombian-supremo', author: 'Emily W.', rating: 3, comment: 'Smooth and nutty. My go-to office coffee.' },
  ]);
}
