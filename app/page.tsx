'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "./_utility/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home(){
  
  const router = useRouter();

  const handleClick = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password).then(
      (response) => {
        router.push('/ballot')
      }
    ).catch((e)=>{
      alert('ERROR!')
    })
  }
  return (
    <section>
      <Button onClick={
        () => handleClick('test@gmail.com', '123456')
      }>
        Log In
      </Button>
    </section>
  );
}
