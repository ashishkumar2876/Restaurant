import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus} from "lucide-react";
import { useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";


const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });


  const [open, setOpen] = useState<boolean>(false);
  const [editOpen,setEditOpen]=useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error,setError]=useState<Partial<MenuFormSchema>>({});

  const {loading,createMenu}=useMenuStore();
  const {restaurant,getRestaurant}=useRestaurantStore();
  
  
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };


  const submitHandler=async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const result=menuSchema.safeParse(input);
    if(!result.success){
        const fieldErrors=result.error.formErrors.fieldErrors;
        setError(fieldErrors as Partial<MenuFormSchema>);
        return;
    }
    //api banao
    try {
      const formData=new FormData();
      formData.append("name",input.name);
      formData.append("description",input.description);
      formData.append("price",input.price.toString());
      if(input.image){
        formData.append("image",input.image);
      }
      await createMenu(formData);
    } catch (error) {
      
    }
    
  }
  useEffect(()=>{
    getRestaurant();
  },[])
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-[#D19254] hover:bg-[#d18c47]">
              <Plus />
              Add Menus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  onChange={changeEventHandler}
                  value={input.name}
                  type="text"
                  name="name"
                  placeholder="Enter menu name"
                />
                {error && <span className="text-xs font-medium text-red-600">{error.name}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                  value={input.description}
                  onChange={changeEventHandler}
                  type="text"
                  name="description"
                  placeholder="Enter menu description"
                />
                {error && <span className="text-xs font-medium text-red-600">{error.description}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Price(Rupees)</Label>
                <Input
                  value={input.price}
                  onChange={changeEventHandler}
                  type="number"
                  name="price"
                  placeholder="Enter menu price"
                />
                {error && <span className="text-xs font-medium text-red-600">{error.price}</span>}
              </div> 
              <div className="flex flex-col gap-2">
                <Label>Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e)=>setInput({...input,image:e.target.files?.[0] || undefined})}
                />
                {error && <span className="text-xs font-medium text-red-600">{error.image?.name}</span>}
              </div>
              <DialogFooter className="mt-5">
                {loading ? (
                  <Button type="submit" disabled className="bg-[#D19254] hover:bg-[#d18c47]">
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" className="bg-[#D19254] hover:bg-[#d18c47]">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {restaurant!.menus.map((item: any, _: number) => (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
            <img
              src={item.image}
              alt=""
              className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <h2 className="text-md font-semibold mt-2">
                Price: <span className="text-[#D19254]">{item.price}</span>
              </h2>
            </div>
            <Button
              onClick={() => {
                setSelectedMenu(item)
                setEditOpen(true)
              }}
              size={"sm"}
              className="mt-2 bg-[#D19254] hover:bg-[#d18c47]"
            >
              Edit
            </Button>
          </div>
        </div>
      ))}

      <EditMenu selectedMenu={selectedMenu} editOpen={editOpen} setEditOpen={setEditOpen}/>
    </div>
  );
};

export default AddMenu;
