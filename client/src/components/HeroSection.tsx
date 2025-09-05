import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import HeroImage from "../assets/hero_pizza.png"
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate=useNavigate();
  const [searchText, setSearchText] = useState<string>("");
  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto md:p-10 rounded-lg items-center justify-center gap-20">
      <div className="flex flex-col gap-10 md:w-[45%]">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-4xl text-4xl">
            Order Food anytime and anywhere
          </h1>
          <p className="text-gray-500 ">
            Hey! Our Delicious food is waiting for you ,we are always near to
            you
          </p>
        </div>
        <div className="relative flex items-center gap-2">
          <Input
            type="text"
            value={searchText}
            onChange={(e: any) => setSearchText(e.target.value)}
            placeholder="Search restaurant by name,city & country"
            className="pl-10 h-10 shadow-lg"
          />
          <Search className="text-gray-500 absolute inset-y-2 left-2" />
          <Button onClick={()=>navigate(`/search/${searchText}`)} className="bg-[#D19254] hover:bg-[#d18c47] h-10">Search</Button>
        </div>
      </div>
      <div>
        <img className="object-cover w-full max-h-[500px]" src={HeroImage} alt="" />
      </div>
    </div>
  );
};

export default HeroSection;
