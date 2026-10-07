import type { LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import type { ClientReview } from "../../data/community-content";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";

export default function ReviewCarousel({ reviews, locale }: LocaleProps & { reviews: ClientReview[] }) {
  const { interactive: t } = getMessages(locale);
  return <Carousel className="review-carousel" aria-label={t.reviewLabel}>
    <CarouselContent>{reviews.map(review => <CarouselItem key={review.name + review.quote}><figure><blockquote><p>{review.quote}</p></blockquote><figcaption>{review.name}</figcaption></figure></CarouselItem>)}</CarouselContent>
    {reviews.length > 1 && <div className="review-controls"><CarouselPrevious><span className="sr-only">{t.previousSlide}</span></CarouselPrevious><CarouselNext><span className="sr-only">{t.nextSlide}</span></CarouselNext></div>}
  </Carousel>;
}
