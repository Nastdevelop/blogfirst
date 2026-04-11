'use client'
import {useRouter} from 'next/navigation'
import { Post, User } from '@/app/generated/prisma/client'

type devinisi = Post & {
    author: User
}

export default  function Postcard({post}: {post: devinisi}) {
    const router = useRouter()

return(
    <div className="border p-4 rounded-lg shadow-sm" onClick={() => router.push(`/post/${post.id}`)} >
    <h2 className="text-lg font-semibold">{post.title}</h2>

    <p className="text-sm text-zinc-500">
      by {post.author.name}
    </p>

    {post.content && (
      <p className="mt-2 text-zinc-700">
        {post.content}
      </p>
    )}
  </div>
)

}

