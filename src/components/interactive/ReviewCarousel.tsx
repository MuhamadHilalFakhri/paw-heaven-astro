import type { ClientReview } from "../../data/community-content";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";

export default function ReviewCarousel({ reviews }: { reviews: ClientReview[] }) {
  return <Carousel className="review-carousel" aria-label="Client experiences">
    <CarouselContent>{reviews.map(review => <CarouselItem key={review.name + review.quote}><figure><blockquote><p>{review.quote}</p></blockquote><figcaption>{review.name}</figcaption></figure></CarouselItem>)}</CarouselContent>
    {reviews.length > 1 && <div className="review-controls"><CarouselPrevious /><CarouselNext /></div>}
  </Carousel>;
}
