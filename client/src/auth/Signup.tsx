import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState<SignupInputState>({
    fullname: "",
    contact: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<SignupInputState>>({});

  const navigate=useNavigate();

  const {signup,loading}=useUserStore();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const signupSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldsError = result.error.formErrors.fieldErrors;
      setErrors(fieldsError as Partial<SignupInputState>);
      return;
    }
    //api implementation
    try {
      await signup(input);
      navigate('/verify-email')

    } catch (error) {
     
    }
    
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={signupSubmitHandler}
        className="flex items-center justify-center flex-col gap-4 md:p-8 w-full max-w-md md:border border-gray-200 rounded-lg mx-4"
      >
        <div className="font-bold text-2xl text-center">AshishEats</div>
        <div className="relative w-full">
          <Input
            value={input.fullname}
            onChange={changeEventHandler}
            name="fullname"
            type="text"
            placeholder="Full Name"
            className="pl-10 focus-visible:ring-1"
          />
          <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors && (
            <span className="text-xs text-red-500">{errors.fullname}</span>
          )}
        </div>
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
          {errors && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
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
          {errors && (
            <span className="text-xs text-red-500">{errors.password}</span>
          )}
        </div>
        <div className="relative w-full">
          <Input
            value={input.contact}
            onChange={changeEventHandler}
            type="number"
            name="contact"
            placeholder="Contact"
            className="pl-10 focus-visible:ring-1"
          />
          <Phone className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors && (
            <span className="text-xs text-red-500">{errors.contact}</span>
          )}
        </div>
        <Button
          disabled={loading}
          type="submit"
          className="bg-[#D19254] hover:bg-[#d18c47] w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Please wait</span>
            </div>
          ) : (
            "Signup"
          )}
        </Button>
        <Separator className="mt-4" />
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
