import React from 'react';
type Props = { onSubmit: (email: string, password: string) => void; };
export default function SignUp({ onSubmit }: Props) {
  const [email, setEmail] = React.useState(''); const [password, setPassword] = React.useState('');
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(email, password);}} className="grid gap-3 max-w-sm">
      <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="px-4 py-2 border rounded">Create Account</button>
    </form>
  );
}
