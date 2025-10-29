// seedProducts.js
const { db } = require("./config/firebase");

const products = [
  { name: "Fresh Milk", desc: "Organic full-cream milk from local dairy farms.", price: 120, img: "https://images.unsplash.com/photo-1580910051070-8aa4b4b3f33d" },
  { name: "Strawberry Yoghurt", desc: "Creamy strawberry-flavored yoghurt with natural fruit.", price: 90, img: "https://images.unsplash.com/photo-1612536002084-7aa6b58e55f2" },
  { name: "Cheddar Cheese", desc: "Rich and aged cheddar cheese block, 250g.", price: 300, img: "https://images.unsplash.com/photo-1629822579633-6c3a8e0f8f4a" },
  { name: "Butter", desc: "Pure unsalted butter made from fresh cream.", price: 180, img: "https://images.unsplash.com/photo-1607330289199-4c04b0bcd107" },
  { name: "Mala", desc: "Traditional fermented milk drink — locally made.", price: 70, img: "https://images.unsplash.com/photo-1601050690597-7f2eea1a7c74" },
  { name: "Ghee", desc: "Clarified butter rich in nutrients and flavor.", price: 250, img: "https://images.unsplash.com/photo-1628294895950-9e4bca9b9f47" },
  { name: "Vanilla Yoghurt", desc: "Smooth and sweet vanilla yoghurt — 500ml cup.", price: 100, img: "https://images.unsplash.com/photo-1600185365483-26d7d1b96b4b" },
  { name: "Mozzarella Cheese", desc: "Soft mozzarella cheese ideal for pizza and sandwiches.", price: 320, img: "https://images.unsplash.com/photo-1625943558509-7779bceecb50" },
  { name: "Chocolate Milk", desc: "Delicious chocolate-flavored milk drink for kids.", price: 110, img: "https://images.unsplash.com/photo-1625242304511-b5fcb5af3d1b" },
  { name: "Cream Cheese", desc: "Soft, spreadable cheese perfect for toast and cakes.", price: 200, img: "https://images.unsplash.com/photo-1629822909418-4b037cfbfa45" }
];

(async () => {
  try {
    for (const product of products) {
      await db.collection("products").add(product);
      console.log(`✅ Added: ${product.name}`);
    }
    console.log("🎉 All products added successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
})();
