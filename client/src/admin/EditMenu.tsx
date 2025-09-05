import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { Loader2 } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

const EditMenu = ({
  selectedMenu,
  editOpen,
  setEditOpen,
}: {
  selectedMenu: any;
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [error,setError]=useState<Partial<MenuFormSchema>>({})
  const {loading,editMenu}=useMenuStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler =async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }
    try {
      const formData=new FormData();
      formData.append("name",input.name);
      formData.append("description",input.description);
      formData.append("price",input.price.toString());
      if(input.image){
        formData.append("image",input.image);
      }
      await editMenu(selectedMenu._id,formData);
    } catch (error) {
      
    }
  };
  useEffect(() => {
    setInput({
      name: selectedMenu?.name,
      description: selectedMenu?.description,
      price: selectedMenu?.price,
      image: undefined,
    });
  }, [selectedMenu]);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Update your menu to keep your offerings fresh and exciting
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
              onChange={(e) =>
                setInput({ ...input, image: e.target.files?.[0] || undefined })
              }
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
  );
};

export default EditMenu;
