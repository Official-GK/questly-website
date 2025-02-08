import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import SubscriptionPlans from "./subscription/SubscriptionPlans";

export default function Navigation() {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const [showSubscription, setShowSubscription] = useState(false);
  const isPremiumUser = userProfile?.isPremium || false;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Questly
        </Link>

        {currentUser ? (
          <div className="flex items-center gap-4">
            <Sheet open={showSubscription} onOpenChange={setShowSubscription}>
              <Button 
                onClick={() => setShowSubscription(true)}
                className={`flex items-center gap-2 ${isPremiumUser ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' : ''}`}
                variant={isPremiumUser ? "outline" : "default"}
              >
                <Crown className="h-4 w-4" />
                {isPremiumUser ? "Premium Member" : "Get Premium Access"}
              </Button>
              <SheetContent side="right" className="w-full sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Choose Your Plan</SheetTitle>
                  <SheetDescription>
                    Select the plan that best fits your learning goals
                  </SheetDescription>
                </SheetHeader>
                <SubscriptionPlans />
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.photoURL || ""} alt={currentUser.email || ""} />
                    <AvatarFallback>{currentUser.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSubscription(true)}>
                  <Crown className="mr-2 h-4 w-4" />
                  Subscription
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}