import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Building2, Github, Loader2, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'login';
  const role = searchParams.get('role') || 'TENANT';

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if profile exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          userId: user.uid,
          email: user.email,
          fullName: user.displayName || 'User',
          role: role,
          avatarUrl: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      
      toast.success("Welcome to UrbanStay!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          userId: user.uid,
          email: email,
          fullName: fullName,
          role: role,
          createdAt: serverTimestamp(),
        });
        
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8 text-center">
            <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                <Building2 className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {mode === 'signup' ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-slate-500 mt-2">
                {mode === 'signup' 
                    ? 'Start your premium property journey today' 
                    : 'Access your curated properties and messages'}
            </p>
        </div>

        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50">
          <CardHeader>
            <Tabs 
                value={mode} 
                onValueChange={(val) => navigate(`/auth?mode=${val}&role=${role}`)}
                className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input 
                    id="fullname" 
                    placeholder="John Doe" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === 'login' && (
                    <button 
                        type="button"
                        onClick={() => email ? sendPasswordResetEmail(auth, email).then(() => toast.info("Check your email for reset instructions")) : toast.info("Enter email first")}
                        className="text-xs text-slate-500 hover:text-slate-900"
                    >
                        Forgot password?
                    </button>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {mode === 'signup' && (
                  <div className="space-y-2 pt-2">
                      <Label>I am a...</Label>
                      <div className="grid grid-cols-3 gap-2">
                          {['TENANT', 'LANDLORD', 'AGENT'].map((r) => (
                              <Button
                                key={r}
                                type="button"
                                variant={role === r ? 'default' : 'outline'}
                                className="text-xs py-1 h-auto"
                                onClick={() => navigate(`/auth?mode=signup&role=${r}`)}
                              >
                                {r.charAt(0) + r.slice(1).toLowerCase()}
                              </Button>
                          ))}
                      </div>
                  </div>
              )}

              <Button type="submit" className="w-full bg-slate-900" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                <Mail className="h-4 w-4 mr-2" />
                Google
              </Button>
              <Button variant="outline" disabled={isLoading}>
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 p-4">
            <p className="text-xs text-slate-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
