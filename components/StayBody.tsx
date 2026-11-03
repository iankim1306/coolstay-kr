import type { Block } from '@/lib/stay'
import type { ReactNode } from 'react'

// **굵게** 와 [글자](https://주소) 만 지원하는 아주 작은 인라인 렌더러
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={i++} className="font-semibold text-gray-900">{m[1]}</strong>)
    else
      out.push(
        <a key={i++} href={m[3]} target="_blank" rel="noopener nofollow" className="text-teal-700 underline underline-offset-2">
          {m[2]}
        </a>,
      )
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function StayBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[17px] leading-8 text-gray-700">
      {blocks.map((b, i) => {
        if ('h2' in b)
          return (
            <h2 key={i} className="mt-12 mb-4 text-2xl font-bold text-gray-900">
              {b.h2}
            </h2>
          )
        if ('h3' in b)
          return (
            <h3 key={i} className="mt-8 mb-2 text-lg font-bold text-gray-900">
              {b.h3}
            </h3>
          )
        if ('p' in b)
          return (
            <p key={i} className="my-4">
              {inline(b.p)}
            </p>
          )
        if ('ul' in b)
          return (
            <ul key={i} className="my-4 list-disc space-y-2 pl-6">
              {b.ul.map((li, j) => (
                <li key={j}>{inline(li)}</li>
              ))}
            </ul>
          )
        return (
          <ol key={i} className="my-4 list-decimal space-y-2 pl-6">
            {b.ol.map((li, j) => (
              <li key={j}>{inline(li)}</li>
            ))}
          </ol>
        )
      })}
    </div>
  )
}
