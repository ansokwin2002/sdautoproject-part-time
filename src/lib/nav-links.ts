import { products } from "@/lib/products";

export const getNavLinks = () => {
  const allBrands = Array.from(new Set(products.map(product => product.brand)));
  const brandsToRemove = ["Mitsubishi Parts", "Nissan Parts", "Porsche Parts", "Ram Parts", "Subaru Parts", "GMC Parts", "Isuzu Parts"];
  const uniqueBrands = allBrands.filter(brand => !brandsToRemove.includes(brand)).sort();

  const brandDropdownItems = uniqueBrands.map(brand => ({
    href: `/genuine-parts?brand=${encodeURIComponent(brand)}`,
    label: brand,
  }));

  return [
    {
      href: "/genuine-parts",
      label: "Genuines Parts and Accessories",
      hasDropdown: true,
      dropdownItems: [
        { href: "/genuine-parts", label: "All Parts" },
        { href: "/genuine-parts?brand=Ford%20Parts", label: "Ford Genuine Parts" },
        { href: "/genuine-parts?brand=Isuzu%20Parts", label: "Isuzu Genuine Parts" },
        { href: "/genuine-parts?brand=Toyota%20Parts", label: "Toyota Genuine Parts" },
        { href: "/genuine-parts?brand=Mazda%20Parts", label: "Mazda Genuine Parts" },
        { href: "/genuine-parts?brand=Mitsubishi%20Parts", label: "Mitsubishi Genuine Parts" },
        { href: "/genuine-parts?brand=Nissan%20Parts", label: "Nissan Genuine Parts" },
        { href: "/genuine-parts?brand=Honda%20Parts", label: "Honda Genuine Parts" },
        { href: "/genuine-parts?brand=Suzuki%20Parts", label: "Suzuki Genuine Parts" },
        { href: "/genuine-parts?brand=Aftermarket", label: "Aftermarket Accessories" },
      ],
    },
    { href: "/", label: "Home" },
    { href: "/shipping", label: "Shipping" },
    { href: "/policy", label: "Policy" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
  ];
};
