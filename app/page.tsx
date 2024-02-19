'use client';
import { Button } from "@/components/ui/button";
import { auth } from "./_utility/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home(){
  
  const route = useRouter();

  const handleClick = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password).then(
      (response) => {
        route.push('/ballot')
      }
    ).catch((e)=>{
      alert('ERROR!')
    })
  }

  const handleLogInClick = () => {
    route.push('/sign-in');
  };

  const handleRegisterClick = () => {
    route.push('/register');
  };

  const handleViewResultsClick = () => {
    route.push('/results');
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/AbbottElementary.png/800px-AbbottElementary.png" className="w-96 mb-8 rounded-lg shadow-lg" alt="Abbott Elementary" />
        <h2 className="text-3xl font-bold mb-4">EDUCATOR OF THE YEAR ELECTION</h2>
        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleLogInClick}>
            Log In
          </Button>
          <Button onClick={handleRegisterClick}>
            Register
          </Button>
          <Button onClick={handleViewResultsClick}>
            View Results
          </Button>
        </div>
      </div>
  );  
}
