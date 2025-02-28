
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic would go here
    console.log("Sign up attempt with:", { email, username, password, newsletter });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-h2 font-semibold mb-1">CREATE ACCOUNT</h1>
          <p className="text-secondary-medium mb-8">We are happy to be able to provide you with a great shopping experience</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-secondary uppercase text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 border-secondary uppercase text-sm"
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-secondary uppercase text-sm pr-10"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-secondary-medium"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="space-y-2 relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="CONFIRM PASSWORD"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 border-secondary uppercase text-sm pr-10"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-secondary-medium"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={newsletter}
                  onChange={() => setNewsletter(!newsletter)}
                  className="h-4 w-4 border-secondary rounded mt-1"
                />
                <label htmlFor="newsletter" className="text-xs text-secondary-dark">
                  I want to get personalized offers about newly added products, special offers and discount codes.
                </label>
              </div>

              <div className="text-xs text-secondary-medium">
                <span>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our </span>
                <Link to="/privacy-policy" className="text-primary-dark hover:underline">Privacy Policy</Link>
                <span> and </span>
                <Link to="/terms" className="text-primary-dark hover:underline">Terms and Conditions</Link>.
              </div>
              
              <Button 
                type="submit"
                variant="dark"
                className="w-full h-12 uppercase"
              >
                <span className="text-primary-accent">Create Account</span>
              </Button>
            </div>
          </form>

          <div className="mt-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-secondary-medium">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="light"
              className="w-full h-12 uppercase flex items-center justify-center space-x-2"
              onClick={() => console.log("Sign up with Google")}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign up with Google</span>
            </Button>

            <Button
              type="button"
              variant="light"
              className="w-full h-12 uppercase flex items-center justify-center space-x-2"
              onClick={() => console.log("Sign up with Facebook")}
            >
              <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6256856,22" />
              </svg>
              <span>Sign up with Facebook</span>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm">
              <span className="text-secondary-medium">ALREADY A CLIENT? </span>
              <Link to="/login" className="text-primary-dark font-semibold hover:underline">
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <img 
          src="/lovable-uploads/9fe406ef-b60a-4298-beaf-4d1b81da3da2.png" 
          alt="Perfume bottle with plant" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUp;
