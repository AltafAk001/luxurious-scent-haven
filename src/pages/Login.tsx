
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      toast({
        title: "Successfully logged in",
        description: "Welcome back to Nigedum",
      });
      navigate("/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <img 
          src="/lovable-uploads/0fed8e9c-7bde-43e8-8dcf-71367c2afb1f.png" 
          alt="Perfume bottle" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-h2 font-semibold mb-1">WELCOME BACK</h1>
          <p className="text-secondary-medium mb-8">If you have an account with us, please log in.</p>

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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-secondary-medium"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 border-secondary rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="text-xs uppercase">
                    Keep me sign in
                  </label>
                </div>
                
                <Link to="/forgot-password" className="text-xs text-secondary-dark hover:underline uppercase">
                  Forgot your password?
                </Link>
              </div>
              
              <Button 
                type="submit"
                variant="dark"
                className="w-full h-12 uppercase"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
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
              onClick={async () => {
                try {
                  const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: window.location.origin + '/profile',
                    }
                  });
                  if (error) throw error;
                } catch (error: any) {
                  toast({
                    variant: "destructive",
                    title: "Login failed",
                    description: error.message || "Failed to sign in with Google",
                  });
                }
              }}
              disabled={isLoading}
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
              <span>Sign in with Google</span>
            </Button>

            <Button
              type="button"
              variant="light"
              className="w-full h-12 uppercase flex items-center justify-center space-x-2"
              onClick={async () => {
                try {
                  const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'facebook',
                    options: {
                      redirectTo: window.location.origin + '/profile',
                    }
                  });
                  if (error) throw error;
                } catch (error: any) {
                  toast({
                    variant: "destructive",
                    title: "Login failed",
                    description: error.message || "Failed to sign in with Facebook",
                  });
                }
              }}
              disabled={isLoading}
            >
              <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6256856,22" />
              </svg>
              <span>Sign in with Facebook</span>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm">
              <span className="text-secondary-medium">Don't have an account? </span>
              <Link to="/signup" className="text-primary-dark font-semibold hover:underline">
                CREATE ACCOUNT
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
