import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

const AvailableMenu = () => {
  return (
    <div className="md:p-2">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6">
        Available Menus
      </h1>
      <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
        <Card className="py-0 md:max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden gap-0">
          <img
            src="https://i0.wp.com/blog.petpooja.com/wp-content/uploads/2021/10/cultural-cuisine.jpg?resize=696%2C385&ssl=1"
            alt=""
            className="w-full h-40 object-cover"
          />
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Biryani
            </h2>
            <p className="text-sm text-gray-600 mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]"> ₹80</span>
            </h3>
          </CardContent>
          <CardFooter className="mb-4 px-3">
            <Button className="w-full bg-[#D19254] hover:bg-[#d18c47]">Add to cart</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AvailableMenu;
