import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface ArticleCardProps {
  headline: string
  excerpt: string
  cover?: string
  tag?: string
  readingTime?: number
  writer?: string
  publishedAt?: Date
  clampLines?: number
  readMoreUrl?: string
}

function Image({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-[24px]">
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  )
}

export function formatReadTime(seconds: number): string {
  if (!seconds || seconds < 60) return "Less than 1 min read"
  const minutes = Math.ceil(seconds / 60)
  return `${minutes} min read`
}

export function formatPostDate(date: Date): string {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ArticleCard({
  cover,
  tag,
  readingTime,
  headline,
  excerpt,
  writer,
  publishedAt,
  clampLines,
  readMoreUrl,
}: ArticleCardProps) {
  const hasMeta = tag || readingTime
  const hasFooter = writer || publishedAt

  return (
    <Card className="card-hover h-full flex w-full max-w-sm flex-col gap-6 p-4">
      {cover && (
        <CardHeader>
          <Image src={cover} alt={headline} />
        </CardHeader>
      )}
      {!cover && (
        <CardHeader>
          <div className="h-56 w-full rounded-[24px] bg-gradient-to-br from-orange-500/10 to-orange-400/10 flex items-center justify-center">
            <span className="text-5xl opacity-40">📝</span>
          </div>
        </CardHeader>
      )}

      <CardContent>
        {hasMeta && (
          <div className="mb-4 flex items-center text-[13px] text-gray-500">
            {tag && <Badge variant="secondary">{tag}</Badge>}
            {tag && readingTime && <span className="mx-2">·</span>}
            {readingTime && <span>{formatReadTime(readingTime)}</span>}
          </div>
        )}

        <h2 className="mb-3 text-[22px] font-bold leading-[1.3] tracking-tight text-white">
          {headline}
        </h2>

        <p
          className={cn("text-[15px] leading-[1.6] text-gray-400", {
            "overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [display:-webkit-box]":
              clampLines && clampLines > 0,
          })}
          style={{
            WebkitLineClamp: clampLines,
          }}
        >
          {excerpt}
        </p>

          {readMoreUrl && (
            <a
              href={readMoreUrl}
              className="mt-4 inline-flex items-center px-4 py-2 bg-white/[0.06] text-gray-300 rounded-xl text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all"
            >
              Read More
            </a>
          )}
      </CardContent>

      {hasFooter && (
        <CardFooter>
          {writer && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-500">Written by</p>
              <p className="text-sm font-semibold text-gray-200">{writer}</p>
            </div>
          )}
          {publishedAt && (
            <div className={writer ? "text-right" : ""}>
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-500">Published</p>
              <p className="text-sm font-semibold text-gray-200">
                {formatPostDate(publishedAt)}
              </p>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}