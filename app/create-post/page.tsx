
import {redirect} from 'next/navigation'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreatePostPage from '@/components/createPost';

export default async function CreatePage() {
const session = await getServerSession(authOptions) 

if(!session) {
    redirect('/')
}
return <CreatePostPage />
}