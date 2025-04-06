import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import {  Loader2, LockKeyhole, Mail} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [input,setInput]=useState<LoginInputState>({
    email:"",
    password:""
  }) 

  const [errors,setErrors]=useState<Partial<LoginInputState>>({});
  const {loading,login}=useUserStore();
  const changeEventHandler=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setInput({...input,[name]:value})
  }

  const loginSubmitHandler=async (e:FormEvent)=>{
    e.preventDefault();
    const result=userLoginSchema.safeParse(input);
    if(!result.success){
      const fieldErrors=result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
    }
   
    await login(input);
  }
 
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={loginSubmitHandler} className="flex items-center justify-center flex-col gap-4 md:p-8 w-full max-w-md md:border border-gray-200 rounded-lg mx-4">
        <div className="font-bold text-2xl text-center">AshishEats</div>
        <div className="relative w-full">
          <Input
            value={input.email}
            onChange={changeEventHandler}
            name="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10 focus-visible:ring-1"
          />
          <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {
            errors && <span className="text-xs text-red-500">{
              errors.email
              }</span>
          }
        </div>
        <div className="relative w-full">
          <Input
            value={input.password}
            onChange={changeEventHandler}
            type="password"
            name="password"
            placeholder="Enter your password"
            className="pl-10 focus-visible:ring-1"
          />
          <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {
            errors && <span className="text-xs text-red-500">{
              errors.password
              }</span>
          }
        </div>

        <Button disabled={loading} type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Please wait</span>
            </div>
          ) : (
            "Login"
          )}
        </Button>
        <Link to='/forgot-password' className="hover:text-blue-500 hover:underline">Forgot Password</Link>
        <Separator className="mt-4"/>
        <p>
            Don't have an account?{" "}
            <Link to='/signup' className="text-blue-500">Signup</Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
