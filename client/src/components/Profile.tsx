import { Loader2, Locate, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FormEvent, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {
  const {user,updateProfile}=useUserStore();
  const [loading,setLoading]=useState(false);
  const [profileData,setProfileData]=useState({
    fullname:user?.fullname || "",
    email:user?.email || "",
    address:user?.address || "",
    city:user?.city || "",
    country:user?.country || "",
    profilePicture:user?.profilePicture || ""
  });
  const imageRef=useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture,setSelectedProfilePicture]=useState<string>(user?.profilePicture || "");


  const fileChangeHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(file){
      const reader=new FileReader();
      reader.onloadend=()=>{
        const result=reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData)=>({
          ...prevData,
          profilePicture:result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const changeHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setProfileData({...profileData,[name]:value})
  }

  const updateProfileHandler= async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    //api implementation
    setLoading(true);
    await updateProfile(profileData);
    setLoading(false);
   
  }
  return (
    <form onSubmit={updateProfileHandler} className="max-w-6xl mx-auto my-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
            <AvatarImage src={selectedProfilePicture}/>
            <AvatarFallback>CN</AvatarFallback>
            <input ref={imageRef} accept='image/*' className="hidden" type="file" onChange={fileChangeHandler} />
            <div onClick={()=>imageRef.current?.click()} className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer">
              <Plus className="text-white w-8 h-8" />
            </div>
          </Avatar>
          <input
          type="text"
          name="fullname"
          className="font-bold md:text-2xl bg-transparent outline-none border-none focus-visible:border-transparent focus-visible:ring-0"
          value={profileData.fullname}
          onChange={changeHandler}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
        <div className="bg-gray-200 flex items-center gap-4 rounded-sm p-2">
          <Mail className="text-gray-500"/>
          <div className="w-full">
            <Label className="dark:text-gray-600">Email</Label>
            <input
            disabled
            name="email"
            value={profileData.email}
            onChange={changeHandler}
            className="mt-1 w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:ring-transparent outline-none"
            />
          </div>
        </div>
        <div className="bg-gray-200 flex items-center gap-4 rounded-sm p-2">
          <Locate className="text-gray-500"/>
          <div className="w-full">
            <Label className="text-gray-600">Address</Label>
            <input
            name="address"
            value={profileData.address}
            onChange={changeHandler}
            className=" mt-1 w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:ring-transparent outline-none"
            />
          </div>
        </div>
        <div className="bg-gray-200 flex items-center gap-4 rounded-sm p-2">
          <MapPin className="text-gray-500"/>
          <div className="w-full">
            <Label className="text-gray-600">City</Label>
            <input
            name="city"
            value={profileData.city}
            onChange={changeHandler}
            className="mt-1 w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:ring-transparent outline-none"
            />
          </div>
        </div>
        <div className="bg-gray-200 flex items-center gap-4 rounded-sm p-2">
          <MapPinnedIcon className="text-gray-500"/>
          <div className="w-full">
            <Label className="text-gray-600">Country</Label>
            <input
            name="country"
            value={profileData.country}
            onChange={changeHandler}
            className="mt-1 w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:ring-transparent outline-none"
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        {
          loading?<Button disabled className="bg-[#D19254] hover:bg-[#d18c47]"><Loader2 className="animate-spin mr-2 w-4 h-4"/>Please wait</Button>:<Button className="bg-[#D19254] hover:bg-[#d18c47]">Update</Button>
        }
      </div>
    </form>
  );
};

export default Profile;
