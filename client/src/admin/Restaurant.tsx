import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { restaurantFormSchema } from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const Restaurant = () => {
  const [input, setInput] = useState<restaurantFormSchema>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined,
  });
  const [errors, setErrors] = useState<Partial<restaurantFormSchema>>({});

  const { loading, restaurant, createRestaurant, updateRestaurant,getRestaurant } =
    useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = restaurantFormSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<restaurantFormSchema>);
      return;
    }
    //api

    try {
      const formData = new FormData();
      formData.append("restaurantName", input.restaurantName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("deliveryTime", input.deliveryTime.toString());
      formData.append("cuisines", JSON.stringify(input.cuisines));

      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }

      if (restaurant) {
        await updateRestaurant(formData);
      } else {
        await createRestaurant(formData);
      }
    } 
    catch (error) {
     
    }
  };

  useEffect(() => {
  if (restaurant) {
    setInput({
      restaurantName: restaurant.restaurantName || "",
      city: restaurant.city || "",
      country: restaurant.country || "",
      deliveryTime: restaurant.deliveryTime || 0,
      cuisines: restaurant.cuisines ? restaurant.cuisines.map((c: string) => c) : [],
      imageFile: undefined,
    });
  }
}, [restaurant]);
useEffect(() => {
  getRestaurant();
}, []);
  
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div>
        <div>
          <h1 className="font-extrabold text-2xl mb-5">Add Restaurant</h1>
          <form action="" onSubmit={submitHandler}>
            <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
              <div className="flex flex-col gap-1">
                <Label>Restaurant Name</Label>
                <Input
                  value={input.restaurantName}
                  onChange={changeEventHandler}
                  type="text"
                  name="restaurantName"
                  placeholder="Enter your restaurant name"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.restaurantName}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label>City</Label>
                <Input
                  value={input.city}
                  onChange={changeEventHandler}
                  type="text"
                  name="city"
                  placeholder="Enter your city name"
                />
                {errors && (
                  <span className="text-xs text-red-600">{errors.city}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label>Country</Label>
                <Input
                  value={input.country}
                  onChange={changeEventHandler}
                  type="text"
                  name="country"
                  placeholder="Enter your country name"
                />
                {errors && (
                  <span className="text-xs text-red-600">{errors.country}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label>Delivery Time</Label>
                <Input
                  value={input.deliveryTime}
                  onChange={changeEventHandler}
                  type="number"
                  name="deliveryTime"
                  placeholder="Enter your delivery timing"
                />
                {errors && (
                  <span className="text-xs text-red-600">
                    {errors.deliveryTime}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label>Cuisines</Label>
                <Input
                  value={input.cuisines}
                  onChange={(e) =>
                    setInput({ ...input, cuisines: e.target.value.split(",") })
                  }
                  type="text"
                  name="cuisines"
                  placeholder="e.g Momos,Biryani"
                />
                {errors && (
                  <span className="text-xs text-red-600">
                    {errors.cuisines}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label>Upload Restaurant Banner</Label>
                <Input
                  onChange={(e) =>
                    setInput({
                      ...input,
                      imageFile: e.target.files?.[0] || undefined,
                    })
                  }
                  type="file"
                  name="imageFile"
                  accept="image/*"
                />
                {errors && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.imageFile?.name}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Button
                  disabled
                  type="submit"
                  className="bg-[#D19254] hover:bg-[#d18c47]"
                >
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-[#D19254] hover:bg-[#d18c47]"
                >
                  {restaurant
                    ? "Update Your Restaurant"
                    : "Add Your Restaurant"
                  }
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
