import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const {addToCart}=useCartStore();
  const navigate=useNavigate();
  return (
    <div className="md:p-2">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6">
        Available Menus
      </h1>
      <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
        {menus?.map((menu: MenuItem) => (
          <div className="m-3">
          <Card className="py-0 mx-auto shadow-lg rounded-lg overflow-hidden gap-0">
            <img
              src={menu.image}
              alt=""
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {menu.description}
              </p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]"> ₹{menu.price}</span>
              </h3>
            </CardContent>
            <CardFooter className="mb-4 px-3">
              <Button onClick={()=>{
                addToCart(menu);
                navigate("/cart")
              }} className="w-full bg-[#D19254] hover:bg-[#d18c47]">
                Add to cart
              </Button>
            </CardFooter>
          </Card>
          </div>

        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
